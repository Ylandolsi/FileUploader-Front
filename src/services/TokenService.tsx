import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  // claims of jwt
  exp: number;
  sub: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

let inMemoryToken: string | null = null;

export const tokenService = {
  getAccessToken: (): string | null => {
    return inMemoryToken;
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem("refreshToken");
  },

  saveTokens: (tokens: TokenPair): void => {
    inMemoryToken = tokens.accessToken;
    localStorage.setItem("refreshToken", tokens.refreshToken);
  },

  clearTokens: (): void => {
    inMemoryToken = null;
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("secondVerify");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  },

  isTokenExpired: (): boolean => {
    if (!inMemoryToken) return true;

    try {
      const decoded = jwtDecode<DecodedToken>(inMemoryToken);
      const currentTime = Date.now() / 1000;

      return decoded.exp < currentTime + 30;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  },
};
