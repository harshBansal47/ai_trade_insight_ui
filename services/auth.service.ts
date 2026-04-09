import { apiClient } from "@/lib/api";
import { User } from "@/types";


// ── Types ────────────────────────────────────────────────────────────────────

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  otp: string;
}

export interface LoginPasswordRequest {
  email: string;
  password: string;
}

export interface LoginOtpRequest {
  email: string;
  otp: string;
}

export interface SendOtpRequest {
  email: string;
  purpose: "signup" | "login" | "forgot_password";
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  purpose: "signup" | "login" | "forgot_password";
}

export interface ForgotPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  points: number;
  message: string;
}

export interface OtpResponse {
  message: string;
  expires_in: number;
}

export interface VerifyOtpResponse {
  verified: boolean;
  message: string;
}

// ── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Register a new user after OTP verification
   */
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/signup", data);
    return response.data;
  },

  /**
   * Login with email + password
   */
  loginWithPassword: async (
    data: LoginPasswordRequest
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", {
      ...data,
      method: "password",
    });
    return response.data;
  },

  /**
   * Login with email + OTP
   */
  loginWithOtp: async (data: LoginOtpRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", {
      ...data,
      method: "otp",
    });
    return response.data;
  },

  /**
   * Send OTP to email
   */
  sendOtp: async (data: SendOtpRequest): Promise<OtpResponse> => {
    const response = await apiClient.post<OtpResponse>("/auth/send-otp", data);
    return response.data;
  },

  /**
   * Verify OTP code
   */
  verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    const response = await apiClient.post<VerifyOtpResponse>(
      "/auth/verify-otp",
      data
    );
    return response.data;
  },

  /**
   * Reset password using OTP
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      "/auth/forgot-password",
      data
    );
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<{ user: User; points: number }> => {
    const response = await apiClient.get<{ user: User; points: number }>(
      "/auth/me"
    );
    return response.data;
  },

  /**
   * Logout (invalidate token on server)
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
};
