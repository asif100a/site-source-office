import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react-native";
import { useForm } from "react-hook-form";
import LogoWhite from "@/assets/icons/LogoWhite";
import { Text } from "@/components/ui/text";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import { normalizeUserRole, type UserRole } from "@/constants/Routes";

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

export default function ResetPasswordScreen({
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
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      <View className="bg-[#FF5500] px-6 pb-10">
        <View className="mb-4 items-center justify-center">
          <LogoWhite />
        </View>
        <Text className="text-3xl font-bold tracking-tight text-white">
          Reset Password
        </Text>
        <Text className="mt-1.5 text-sm font-medium text-white/85">
          Set a new password for {email || "your account"}.
        </Text>
      </View>

      {!isSaved ? (
        <View className="flex-1 px-6 pt-8 pb-10 justify-between">
          <View className="gap-6">
            <View className="gap-1">
              <Text className="text-lg font-semibold text-[#1B2530]">
                Create a new password
              </Text>
              <Text className="text-sm leading-6 text-neutral-500">
                Choose a strong password you have not used before.
              </Text>
            </View>

            <View className="gap-1">
              <StandardInputField<ResetPasswordFormValues>
                label="New Password"
                id="password"
                type="password"
                control={control}
                required={true}
                placeholder="Enter your new password"
              />

              <StandardInputField<ResetPasswordFormValues>
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                control={control}
                required={true}
                placeholder="Confirm your new password"
              />
            </View>

            {error ? (
              <Text className="text-sm font-medium text-[#D92D20]">{error}</Text>
            ) : null}
          </View>

          <View className="gap-4">
            <View className="flex-row items-center gap-2 rounded-2xl bg-neutral-50 px-4 py-3">
              <ShieldCheck size={16} color="#FF5500" />
              <Text className="text-sm font-medium text-neutral-600">
                Use a unique password to keep your account secure.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSubmit(handleSave)}
              activeOpacity={0.9}
              className="flex-row items-center justify-center gap-2 rounded-xl bg-[#1B2530] py-4 shadow-sm"
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
        </View>
      ) : (
        <View className="flex-1 items-center justify-center px-6 py-10">
          <View className="w-full max-w-md items-center gap-5 rounded-[28px] border border-neutral-200 bg-white p-6">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <CheckCircle2 size={28} color="#16A34A" />
            </View>
            <View className="gap-2">
              <Text className="text-center text-2xl font-black tracking-tight text-[#1B2530]">
                Password updated
              </Text>
              <Text className="text-center text-sm leading-6 text-neutral-500">
                Your password has been reset successfully. You can now sign in
                with the new password.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleContinue}
              activeOpacity={0.9}
              className="mt-2 w-full items-center justify-center rounded-xl bg-[#1B2530] py-4 shadow-sm"
            >
              <Text className="text-base font-semibold text-white">
                Back to login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
