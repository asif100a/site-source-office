import React, { useEffect, useMemo, useRef, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight, RotateCcw, ShieldCheck } from "lucide-react-native";
import LogoWhite from "@/assets/icons/LogoWhite";
import { Text } from "@/components/ui/text";
import { normalizeUserRole, type UserRole } from "@/constants/Routes";
import AuthWebShell from "./_web-shell";

interface VerifyOtpScreenProps {
  role?: UserRole;
  name?: string;
  email?: string;
  provider?: "google" | "apple" | "manual";
  onComplete?: (code: string) => void;
  onBackPress?: () => void;
  onResend?: () => void;
}

const OTP_LENGTH = 6;
const RESEND_DELAY = 30;

export default function VerifyOtpScreenWeb({
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
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY);

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

  const handleVerify = () => {
    if (code.length !== OTP_LENGTH) {
      setError(`Enter the full ${OTP_LENGTH}-digit code.`);
      return;
    }

    if (onComplete) {
      onComplete(code);
      return;
    }

    router.push({
      pathname: "/auth",
      params: { step: "register_general", role: activeRole },
    });
  };

  const handleResend = () => {
    if (secondsLeft > 0) {
      return;
    }

    setCode("");
    setError("");
    setSecondsLeft(RESEND_DELAY);
    onResend?.();
    inputRef.current?.focus();
  };

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    router.push({
      pathname: "/auth",
      params: { step: "register_sso", role: activeRole },
    });
  };

  return (
    <AuthWebShell
      eyebrow="Verification"
      title="Verify your email"
      subtitle={`We sent a 6-digit code to ${verificationTarget}.`}
    >
      <View className="rounded-[28px] border border-neutral-200 bg-white p-5 md:p-6">
        <View className="mb-6 items-center rounded-[24px] bg-[#FF5500] px-6 py-8">
          <LogoWhite />
          <Text className="mt-6 text-center text-2xl font-black tracking-tight text-white">
            Confirm your code
          </Text>
          <Text className="mt-2 max-w-md text-center text-sm leading-6 text-white/85">
            {name ? `Hi ${name}, enter the code to continue registration.` : "Enter the code to continue registration."}
          </Text>
        </View>

        <View className="grid gap-6">
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
                    <Text className="text-xl font-bold text-[#1B2530]">
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
              Secure verification keeps your registration linked to the right account.
            </Text>
          </View>

          <View className="flex-row items-center gap-2 rounded-2xl bg-neutral-50 px-4 py-3">
            <RotateCcw size={16} color="#FF5500" />
            <Text className="text-sm font-medium text-neutral-600">
              Resend available in {secondsLeft}s
            </Text>
          </View>
        </View>

        <View className="mt-6 gap-4">
          <TouchableOpacity
            onPress={handleVerify}
            activeOpacity={0.9}
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
          >
            <Text className="text-base font-semibold text-white">
              Verify and continue
            </Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <View className="flex-row items-center justify-between gap-4">
            <TouchableOpacity
              onPress={handleResend}
              activeOpacity={0.7}
              disabled={secondsLeft > 0}
            >
              <Text
                className={`text-sm font-bold ${
                  secondsLeft > 0 ? "text-neutral-400" : "text-[#1B2530] underline"
                }`}
              >
                Resend code
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
              <Text className="text-sm font-bold text-neutral-600 underline">
                Back to sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AuthWebShell>
  );
}
