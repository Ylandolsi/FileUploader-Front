import { apiurl } from "../constants/apiurl";
import { tokenService } from "./TokenService";

import { AuthRequest, AuthTokens } from "../types/types";

export const authService = {
  async refreshToken(userName: string): Promise<AuthTokens> {
    const refreshToken = tokenService.getRefreshToken();
    const accessToken = tokenService.getAccessToken();

    if (!refreshToken || !accessToken) {
      throw new Error("No tokens available");
    }

    const response = await fetch(`${apiurl}/Auth/refresh-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Invalid refresh token");
    }

    const tokens = await response.json();
    tokenService.saveTokens(tokens);
    return tokens;
  },

  login: async (loginData: AuthRequest): Promise<AuthTokens> => {
    if (!loginData.password || !loginData.username) {
      throw new Error("LoginData Missing");
    }
    const response = await fetch(`${apiurl}/Auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: loginData.username,
        password: loginData.password,
      }),
    });

    if (!response.ok) {
      throw new Error("Login Failed");
    }
    const tokens = await response.json();
    tokenService.saveTokens(tokens);

    return tokens;
  },

  logout: (): void => {
    tokenService.clearTokens();
  },

  register: async (RegisterData: AuthRequest): Promise<void> => {
    if (!RegisterData.username || !RegisterData.password) {
      throw new Error("RegisterData Missing");
    }
    const response = await fetch(`${apiurl}/Auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: RegisterData.username,
        password: RegisterData.password,
      }),
    });

    if (!response.ok) {
      throw new Error("Register Failed");
    }
  },

  checkAndRefreshToken: async (userName: string): Promise<boolean> => {
    console.log("checkAndRefreshToken");
    if (tokenService.isTokenExpired()) {
      try {
        console.log("Token expired, refreshing...");
        await authService.refreshToken(userName);
        console.log("Token refreshed successfully");
        return true;
      } catch (error) {
        return false;
      }
    }
    return true;
  },

  checkUserNameAvailable: async (userName: string): Promise<boolean> => {
    const response = await fetch(
      `${apiurl}/Auth/check-username?username=${userName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Check Username Failed");
    }
    const isAvailable = await response.json();
    console.log("isAvailable", isAvailable.available);
    return isAvailable.available;
  },
};
