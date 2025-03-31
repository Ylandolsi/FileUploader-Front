import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "../services/AuthService";
import { tokenService } from "../services/TokenService";

import { AuthRequest } from "../types/types";

interface AuthContextType {
  isLoggedIn: boolean;
  user: string | null;
  login: (loginRequest: AuthRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const checkTokenInterval = setInterval(async () => {
      if (!(await authService.checkAndRefreshToken(user))) {
        logout();
      }
    }, 60000); // every minute check if we have to refresh the token

    return () => clearInterval(checkTokenInterval);
  }, [isLoggedIn, user]);

  const login = async (loginRequest: AuthRequest) => {
    try {
      const userData = await authService.login(loginRequest);
      setUser(loginRequest.username);
      tokenService.saveTokens(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
