import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  onAuthChanged,
  registerUser as fbRegister,
  signIn as fbSignIn,
  signOut as fbSignOut,
} from "../firebase/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    await fbSignIn(email, password);

    return true;
  }, []);

  const register = useCallback(async (email, password, displayName) => {
    await fbRegister(email, password, displayName);

    return true;
  }, []);

  const logout = useCallback(async () => {
    await fbSignOut();
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
