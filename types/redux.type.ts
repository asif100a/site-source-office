export interface AuthResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  accessToken?: string;
  data?: {
    user?: {
      _id?: string;
      id?: string;
      name?: string;
      email?: string;
      countryCode?: string;
      phone?: string;
      status?: string;
    };
    otpToken?: {
      verificationToken?: string;
    };
    verificationToken?: string;
    accessToken?: string;
  };
}

export interface LoginRequest {
  email?: string;
  password?: string;
  rememberMe?: boolean;
}

export interface GoogleLoginRequest {
  name: string;
  email: string;
  token: string;
  profileImage?: string;
  isLegalTermsAccepted: boolean;
}

export interface RegisterData {
  name?: string;
  email?: string;
  role?: string;
  countryCode?: string;
  phone?: string;
  address?:
    | string
    | {
        type: "Point";
        coordinates: [number, number];
      };
  password?: string;
  isLegalTermsAccepted?: boolean;
}

export type VerifyOTPPurpose = "VERIFY_ACCOUNT" | "RESET_PASSWORD";

export interface VerifyOTPRequest {
  email: string;
  otp: string;
  purpose: VerifyOTPPurpose;
}
