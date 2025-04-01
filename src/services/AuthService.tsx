import { apiurl } from "../constants/apiurl";
import { tokenService } from "./TokenService";

import { AuthRequest, AuthTokens } from "../types/types";
const pendingRequests = new Map();
export const authService = {
  // to avoid rerun the same request ( strict mode )
  async refreshToken(userName: string): Promise<AuthTokens> {
    const requestKey = `refresh_${userName}`;

    if (pendingRequests.has(requestKey)) {
      console.log("Reusing pending refresh token request");
      return pendingRequests.get(requestKey);
    }

    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No tokens available");
    }

    const requestPromise = (async () => {
      try {
        console.log("Making refresh token request");
        const response = await fetch(`${apiurl}/Auth/refresh-token`, {
          method: "POST",
          headers: {
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
      } finally {
        // Short timeout to handle React's strict mode double invocation
        setTimeout(() => {
          pendingRequests.delete(requestKey);
        }, 100);
      }
    })();

    // Store the promise
    pendingRequests.set(requestKey, requestPromise);
    return requestPromise;
  },

  checkAndRefreshToken: async (userName: string): Promise<boolean> => {
    const requestKey = `check_${userName}`;

    if (pendingRequests.has(requestKey)) {
      console.log("Reusing pending check token request");
      return pendingRequests.get(requestKey);
    }

    const requestPromise = (async () => {
      try {
        if (tokenService.isTokenExpired()) {
          try {
            await authService.refreshToken(userName);
            return true;
          } catch (error) {
            return false;
          }
        }
        return true;
      } finally {
        setTimeout(() => {
          pendingRequests.delete(requestKey);
        }, 100);
      }
    })();

    pendingRequests.set(requestKey, requestPromise);
    return requestPromise;
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
