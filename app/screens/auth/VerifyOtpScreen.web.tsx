import React, { useEffect, useMemo, useRef, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight, RotateCcw, ShieldCheck } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { Text } from "@/components/ui/text";
import { normalizeUserRole, type UserRole } from "@/constants/Routes";
import {
  useResendOTPMutation,
  useVerifyForgotOtpMutation,
  useVerifyOTPMutation,
} from "@/store/api/authApi";
import AuthWebShell from "./_web-shell";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/slices/authSlice";

interface VerifyOtpScreenProps {
  flow?: "registration" | "password_reset";
  role?: UserRole;
  name?: string;
  email?: string;
  provider?: "google" | "apple" | "manual";
  onComplete?: () => void;
  onBackPress?: () => void;
  onResend?: () => void;
}

const OTP_LENGTH = 6;
const RESEND_DELAY = 30;

export default function VerifyOtpScreenWeb({
  flow = "registration",
  role,
  name,
  email,
  provider,
  onComplete,
  onBackPress,
  onResend,
}: VerifyOtpScreenProps) {
  const router = useRouter();
  const activeRole = normalizeUserRole(role);
  const dispatch = useDispatch();
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY);
  const [verifyOTP, { isLoading: isVerifyingRegistration }] =
    useVerifyOTPMutation();
  const [verifyForgotOtp, { isLoading: isVerifyingForgotOtp }] =
    useVerifyForgotOtpMutation();
  const [resendOTP, { isLoading: isResendingOtp }] = useResendOTPMutation();
  const isLoading =
    flow === "password_reset"
      ? isVerifyingForgotOtp
      : isVerifyingRegistration;

  const verificationTarget = useMemo(() => {
    const trimmedEmail = email?.trim();
    if (trimmedEmail) {
      return trimmedEmail;
    }

    if (provider === "google") {
      return "the email linked to your Google account";
    }

    if (provider === "apple") {
      return "the email linked to your Apple account";
    }

    return "your email";
  }, [email, provider]);

  useEffect(() => {
    if (secondsLeft === 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChange = (value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setCode(nextValue);

    if (error) {
      setError("");
    }
  };

  const handleVerify = async () => {
    if (code.length !== OTP_LENGTH) {
      setError(`Enter the full ${OTP_LENGTH}-digit code.`);
      return;
    }

    const trimmedEmail = email?.trim();

    if (!trimmedEmail) {
      setError("Email is required to verify this code.");
      return;
    }

    try {
      const verifyMutation =
        flow === "password_reset" ? verifyForgotOtp : verifyOTP;
      const response = await verifyMutation({
        email: trimmedEmail,
        otp: code,
        purpose:
          flow === "password_reset" ? "RESET_PASSWORD" : "VERIFY_ACCOUNT",
      }).unwrap();

      if (response.success || response?.data?.success) {
        if (flow !== "password_reset") {
          const token =
            response.accessToken ??
            response.data?.accessToken ??
            (response.data as any)?.token;

          if (token) {
            dispatch(setToken(token));
            await AsyncStorage.setItem("token", token);
          }
        }

        Toast.show({
          type: "success",
          text1: "OTP verified",
          text2: response?.message ?? "Your code has been verified.",
        });

        if (onComplete) {
          onComplete();
          return;
        }
      }

      // if (flow === "password_reset") {
      //   router.push({
      //     pathname: "/auth",
      //     params: { step: "login", role: activeRole },
      //   });
      //   return;
      // }

      // router.push({
      //   pathname: "/auth",
      //   params: { step: "register_general", role: activeRole },
      // });
    } catch (error: any) {
      const message =
        error?.data?.message ??
        error?.message ??
        "Unable to verify this code right now.";

      setError(message);
      Toast.show({
        type: "error",
        text1: "OTP verification failed",
        text2: message,
      });
      return;
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) {
      return;
    }

    const trimmedEmail = email?.trim();

    if (!trimmedEmail) {
      setError("Email is required to resend this code.");
      return;
    }

    try {
      const response = await resendOTP({
        email: trimmedEmail,
        purpose:
          flow === "password_reset" ? "RESET_PASSWORD" : "VERIFY_ACCOUNT",
      }).unwrap();

      setCode("");
      setError("");
      setSecondsLeft(RESEND_DELAY);
      onResend?.();
      inputRef.current?.focus();

      Toast.show({
        type: "success",
        text1: "Code resent",
        text2: response?.message ?? "A fresh OTP has been sent to your email.",
      });
    } catch (apiError: any) {
      const message =
        apiError?.data?.message ??
        apiError?.message ??
        "Unable to resend the code right now.";

      setError(message);
      Toast.show({
        type: "error",
        text1: "Resend failed",
        text2: message,
      });
    }
  };

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    router.push({
      pathname: "/auth",
      params: {
        step: flow === "password_reset" ? "forgot_password" : "register_sso",
        role: activeRole,
      },
    });
  };

  const title =
    flow === "password_reset" ? "Verify reset code" : "Verify your email";
  const subtitle =
    flow === "password_reset"
      ? `We sent a 6-digit code to ${verificationTarget} so you can reset your password.`
      : `We sent a 6-digit code to ${verificationTarget} to confirm your registration.`;

  return (
    <AuthWebShell
      eyebrow={flow === "password_reset" ? "Password recovery" : "Verification"}
      title={title}
      subtitle={subtitle}
      onBackPress={handleBack}
    >
      <View className="grid gap-6">
        <View className="gap-2">
          <Text className="text-lg font-semibold text-[#1B2530]">
            Enter the code we have sent to your email to finish your
            Registration
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => inputRef.current?.focus()}
          className="relative gap-3"
        >
          <View className="flex-row justify-between gap-2">
            {Array.from({ length: OTP_LENGTH }).map((_, index) => {
              const digit = code[index] ?? "";
              const isActive = index === code.length;
              const isFilled = Boolean(digit);

              return (
                <View
                  key={index}
                  className={`h-14 flex-1 items-center justify-center rounded-2xl border ${
                    isActive
                      ? "border-[#FF5500] bg-white"
                      : isFilled
                        ? "border-neutral-300 bg-neutral-50"
                        : "border-neutral-200 bg-white"
                  }`}
                >
                  <Text className="text-xl font-semibold text-[#1B2530]">
                    {digit}
                  </Text>
                </View>
              );
            })}
          </View>

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleChange}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={OTP_LENGTH}
            autoFocus
            className="absolute h-0 w-0 opacity-0"
          />
        </TouchableOpacity>

        {error ? (
          <Text className="text-sm font-medium text-[#D92D20]">{error}</Text>
        ) : null}

        <View className="flex-row items-center gap-3 rounded-2xl bg-neutral-50 px-4 py-3">
          <ShieldCheck size={16} color="#FF5500" />
          <Text className="text-sm font-medium text-neutral-600">
            {flow === "password_reset"
              ? "Secure verification protects password changes."
              : "Secure verification keeps your registration linked to the right account."}
          </Text>
        </View>

        <View className="flex-row items-center gap-2 rounded-2xl bg-neutral-50 px-4 py-3">
          <RotateCcw size={16} color="#FF5500" />
          <Text className="text-sm font-medium text-neutral-600">
            {flow === "password_reset"
              ? `Resend code in ${secondsLeft}s`
              : `Resend available in ${secondsLeft}s`}
          </Text>
        </View>
      </View>

      <View className="mt-6 gap-4">
        <TouchableOpacity
          onPress={handleVerify}
          activeOpacity={0.9}
          disabled={isLoading}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
        >
          <Text className="text-base font-semibold text-white">
            {isLoading
              ? "Verifying..."
              : flow === "password_reset"
                ? "Verify code"
                : "Verify and continue"}
          </Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </TouchableOpacity>

        <View className="flex-row items-center justify-between gap-4">
          <TouchableOpacity
            onPress={handleResend}
            activeOpacity={0.7}
            disabled={secondsLeft > 0 || isResendingOtp}
          >
            <Text
              className={`text-sm font-semibold ${
                secondsLeft > 0
                  ? "text-neutral-400"
                  : "text-[#1B2530] underline"
              }`}
            >
              {isResendingOtp
                ? "Sending..."
                : flow === "password_reset"
                  ? "Send again"
                  : "Resend code"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <Text className="text-sm font-semibold text-neutral-600 underline">
              {flow === "password_reset"
                ? "Back to password reset"
                : "Back to sign up"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthWebShell>
  );
}
