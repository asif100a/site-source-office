import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, MailCheck } from "lucide-react-native";
import { useForm } from "react-hook-form";
import LogoWhite from "@/assets/icons/LogoWhite";
import { Text } from "@/components/ui/text";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import { normalizeUserRole, type UserRole } from "@/constants/Routes";
import AuthWebShell from "./_web-shell";

interface ForgotPasswordScreenProps {
  role?: UserRole;
  onBackToLogin?: () => void;
  onSubmitEmail?: (email: string) => void;
}

export default function ForgotPasswordScreenWeb({
  role,
  onBackToLogin,
  onSubmitEmail,
}: ForgotPasswordScreenProps) {
  const router = useRouter();
  const activeRole = normalizeUserRole(role);
  const [isSent, setIsSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const handleSend = (data: { email: string }) => {
    setSubmittedEmail(data.email);
    onSubmitEmail?.(data.email);
    setIsSent(true);
  };

  const handleBack = () => {
    if (onBackToLogin) {
      onBackToLogin();
      return;
    }

    router.push({
      pathname: "/auth",
      params: { step: "login", role: activeRole },
    });
  };

  return (
    <AuthWebShell
      eyebrow="Password reset"
      title="Reset your password"
      subtitle="We’ll send a reset link to your email address."
    >
      <View className="rounded-[28px] border border-neutral-200 bg-white p-5 md:p-6">
        <View className="mb-6 items-center rounded-[24px] bg-[#FF5500] px-6 py-8">
          <LogoWhite />
          <Text className="mt-6 text-center text-2xl font-black tracking-tight text-white">
            Reset your password
          </Text>
          <Text className="mt-2 max-w-md text-center text-sm leading-6 text-white/85">
            We’ll email you a secure link to create a new password.
          </Text>
        </View>

        {!isSent ? (
          <View className="gap-5">
            <View className="gap-1">
              <Text className="text-lg font-semibold text-[#1B2530]">
                Enter your email
              </Text>
              <Text className="text-sm leading-6 text-neutral-500">
                We’ll send a password reset link to the address on file.
              </Text>
            </View>

            <StandardInputField
              label="Email Address"
              id="email"
              type="email"
              control={control}
              required
              placeholder="Enter your email"
            />

            <TouchableOpacity
              onPress={handleSubmit(handleSend)}
              activeOpacity={0.9}
              className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
            >
              <Text className="text-base font-semibold text-white">
                Send reset link
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.7}
              className="flex-row items-center justify-center gap-2 py-2"
            >
              <ArrowLeft size={16} color="#1B2530" />
              <Text className="text-sm font-semibold text-[#1B2530] underline">
                Back to login
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex items-center justify-center gap-5 py-8">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <MailCheck size={28} color="#16A34A" />
            </View>

            <View className="gap-2">
              <Text className="text-center text-2xl font-black tracking-tight text-[#1B2530]">
                Check your inbox
              </Text>
              <Text className="max-w-md text-center text-sm leading-6 text-neutral-500">
                We sent a password reset link to {submittedEmail}.
              </Text>
            </View>

            <View className="flex-row items-center gap-3 pt-4">
              <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.9}
                className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] px-5 py-4"
              >
                <Text className="text-base font-semibold text-white">
                  Back to login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsSent(false)}
                activeOpacity={0.7}
                className="flex-row items-center justify-center gap-2 py-2"
              >
                <ArrowLeft size={16} color="#1B2530" />
                <Text className="text-sm font-semibold text-[#1B2530] underline">
                  Use a different email
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </AuthWebShell>
  );
}
