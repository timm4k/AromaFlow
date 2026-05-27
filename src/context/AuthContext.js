import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { findUser } from "../data/users";
import {
  getSession,
  removeSession,
  saveSession,
} from "../storage/sessionStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await getSession();

        if (user) {
          setCurrentUser(user);
        }
      } catch (e) {
        console.warn("Failed to restore session", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (username, password) => {
    const user = findUser(username, password);

    if (!user) return false;

    const session = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
    };

    await saveSession(session);
    setCurrentUser(session);

    return true;
  }, []);

  const logout = useCallback(async () => {
    await removeSession();
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
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
