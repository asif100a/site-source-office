import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react-native";
import { useForm } from "react-hook-form";
import LogoWhite from "@/assets/icons/LogoWhite";
import { Text } from "@/components/ui/text";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import { normalizeUserRole, type UserRole } from "@/constants/Routes";
import AuthWebShell from "./_web-shell";

type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

interface ResetPasswordScreenProps {
  role?: UserRole;
  email?: string;
  onBackPress?: () => void;
  onComplete?: () => void;
}

export default function ResetPasswordScreenWeb({
  role,
  email,
  onBackPress,
  onComplete,
}: ResetPasswordScreenProps) {
  const router = useRouter();
  const activeRole = normalizeUserRole(role);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSave = (data: ResetPasswordFormValues) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSaved(true);
  };

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    router.push({
      pathname: "/auth",
      params: { step: "verify_otp", role: activeRole },
    });
  };

  const handleContinue = () => {
    if (onComplete) {
      onComplete();
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
      subtitle={`Set a new password for ${email || "your account"}.`}
    >
      <View className="rounded-[28px] border border-neutral-200 bg-white p-5 md:p-6">
        <View className="mb-6 items-center rounded-[24px] bg-[#FF5500] px-6 py-8">
          <LogoWhite />
          <Text className="mt-6 text-center text-2xl font-semibold tracking-tight text-white">
            Reset your password
          </Text>
          <Text className="mt-2 max-w-md text-center text-sm leading-6 text-white/85">
            Choose a new password to secure your account.
          </Text>
        </View>

        {!isSaved ? (
          <View className="grid gap-5">
            <View className="gap-1">
              <Text className="text-lg font-semibold text-[#1B2530]">
                Create a new password
              </Text>
              <Text className="text-sm leading-6 text-neutral-500">
                Choose a strong password you have not used before.
              </Text>
            </View>

            <StandardInputField<ResetPasswordFormValues>
              label="New Password"
              id="password"
              type="password"
              control={control}
              required
              placeholder="Enter your new password"
            />

            <StandardInputField<ResetPasswordFormValues>
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              control={control}
              required
              placeholder="Confirm your new password"
            />

            {error ? (
              <Text className="text-sm font-medium text-[#D92D20]">{error}</Text>
            ) : null}

            <View className="flex-row items-center gap-3 rounded-2xl bg-neutral-50 px-4 py-3">
              <ShieldCheck size={16} color="#FF5500" />
              <Text className="text-sm font-medium text-neutral-600">
                Use a unique password to keep your account secure.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSubmit(handleSave)}
              activeOpacity={0.9}
              className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
            >
              <Text className="text-base font-semibold text-white">
                Save new password
              </Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.7}
              className="flex-row items-center justify-center gap-2 py-2"
            >
              <ArrowLeft size={16} color="#1B2530" />
              <Text className="text-sm font-semibold text-[#1B2530] underline">
                Back to verification
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex items-center justify-center gap-5 py-8">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <CheckCircle2 size={28} color="#16A34A" />
            </View>

            <View className="gap-2">
              <Text className="text-center text-2xl font-semibold tracking-tight text-[#1B2530]">
                Password updated
              </Text>
              <Text className="max-w-md text-center text-sm leading-6 text-neutral-500">
                Your password has been reset successfully. You can now sign in
                with the new password.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleContinue}
              activeOpacity={0.9}
              className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] px-5 py-4"
            >
              <Text className="text-base font-semibold text-white">
                Back to login
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </AuthWebShell>
  );
}
