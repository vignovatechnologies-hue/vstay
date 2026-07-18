import { apiFetch } from "./api-client";
import { ApiError } from "./api-client";
import type { LoginCredentials, LoginResult, User } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    return apiFetch<LoginResult>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  async signup(data: {
    fullName: string;
    email: string;
    phone: string;
    hostelName: string;
    password?: string;
    planId?: "monthly" | "yearly" | null;
  }): Promise<LoginResult> {
    return apiFetch<LoginResult>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<void> {
    // Stateless JWT – just clear client-side session
    return;
  },

  async me(userId: string): Promise<User> {
    return apiFetch<User>(`/api/auth/me/${userId}`);
  },
};

export { ApiError };
