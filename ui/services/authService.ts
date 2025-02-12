/* eslint-disable @typescript-eslint/ban-ts-comment */
import { API_CONFIG } from "@/config/api.config";

export class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  // Handle API responses consistently
  async handleResponse(response: Response) {
    const data = await response.json();

    if (!response.ok) {
      // If the server sends an error message, use it; otherwise, use a default message
      throw new Error(data.message || "An error occurred");
    }

    return data;
  }

  // Login user
  //@ts-ignore
  async login(email, password) {
    try {
      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.endpoints.login}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Include credentials if your API uses cookies
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await this.handleResponse(response);

      // Store auth data
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Register new user
  //@ts-ignore
  async signup(name, email, password) {
    try {
      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.endpoints.signup}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await this.handleResponse(response);

      // Store auth data
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      // Call logout endpoint if your API has one
      await fetch(`${this.baseUrl}${API_CONFIG.endpoints.logout}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage even if API call fails
      this.clearAuth();
    }
  }

  // Get current auth token
  getToken() {
    return localStorage.getItem("token");
  }

  // Get current user data
  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Clear all auth data
  clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

// Create a singleton instance
export const authService = new AuthService();
