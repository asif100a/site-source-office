import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight, RotateCcw } from "lucide-react-native";
import LogoWhite from "@/assets/icons/LogoWhite";
import { Text } from "@/components/ui/text";
import { normalizeUserRole, type UserRole } from "@/constants/Routes";

interface VerifyOtpScreenProps {
  flow?: "registration" | "password_reset";
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

export default function VerifyOtpScreen({
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

    if (flow === "password_reset") {
      router.push({
        pathname: "/auth",
        params: { step: "login", role: activeRole },
      });
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
      params: {
        step: flow === "password_reset" ? "forgot_password" : "register_sso",
        role: activeRole,
      },
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      <View className="bg-[#FF5500] px-6 pb-10">
        <View className="mb-4 justify-center items-center">
          <LogoWhite />
        </View>
        <Text className="text-3xl font-bold tracking-tight text-white">
          {flow === "password_reset" ? "Verify Reset Code" : "Verify Your Email"}
        </Text>
        <Text className="mt-1.5 text-sm font-medium text-white/85">
          {flow === "password_reset"
            ? `We sent a 6-digit code to ${verificationTarget}.`
            : `We sent a 6-digit code to ${verificationTarget}.`}
        </Text>
      </View>

      <View className="flex-1 justify-between px-6 pb-10 pt-8">
        <View className="gap-6">
          <View className="gap-2">
            <Text className="text-lg font-semibold text-[#1B2530]">
              Enter the code we have sent to your email to finish your Registration
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
                    className={`h-14 flex-1 items-center justify-center rounded-2xl border text-center ${
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

          <View className="flex-row items-center gap-2 rounded-2xl bg-neutral-50 px-4 py-3">
            <RotateCcw size={16} color="#FF5500" />
            <Text className="text-sm font-medium text-neutral-600">
              {flow === "password_reset"
                ? `Resend code in ${secondsLeft}s`
                : `Resend available in ${secondsLeft}s`}
            </Text>
          </View>
        </View>

        <View className="gap-4">
          <TouchableOpacity
            onPress={handleVerify}
            activeOpacity={0.9}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-[#1B2530] py-4"
          >
            <Text className="text-base font-semibold text-white">
              {flow === "password_reset" ? "Verify code" : "Verify and continue"}
            </Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleResend}
            activeOpacity={0.7}
            disabled={secondsLeft > 0}
            className="items-center py-1"
          >
            <Text
              className={`text-sm font-semibold ${
                secondsLeft > 0 ? "text-neutral-400" : "text-[#1B2530] underline"
              }`}
            >
              {flow === "password_reset" ? "Send again" : "Resend code"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
