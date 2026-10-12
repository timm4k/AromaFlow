import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState, type PropsWithChildren } from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import StoreSubscriber from "../components/StoreSubscriber";
import { useTheme } from "../hooks/useTheme";
import { getNavigationTheme } from "./navigationTheme";
import { querySettings } from "./querySettings";

export function AppProviders({ children }: PropsWithChildren) {
  const { theme, darkMode } = useTheme();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: querySettings.staleTime,
            retry: querySettings.retry,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const navigationTheme = useMemo(
    () => getNavigationTheme(theme, darkMode),
    [theme, darkMode],
  );
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={navigationTheme}>
          <StatusBar style={darkMode ? "light" : "dark"} />
          {children}
          <StoreSubscriber />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
