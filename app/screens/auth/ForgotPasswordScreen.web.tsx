import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
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

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const handleSend = (data: { email: string }) => {
    if (onSubmitEmail) {
      onSubmitEmail(data.email);
      return;
    }

    router.push({
      pathname: "/auth",
      params: { step: "verify_otp", role: activeRole },
    });
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
    <View className="rounded-[28px] border border-neutral-200 bg-white p-5 md:p-6">
      <View className="mb-6 items-center rounded-[24px] bg-[#FF5500] px-6 py-8">
        <LogoWhite />
        <Text className="mt-6 text-center text-2xl font-semibold tracking-tight text-white">
          Forgot your password?
        </Text>
        <Text className="mt-2 max-w-md text-center text-sm leading-6 text-white/85">
          We’ll send a one-time code so you can reset your password safely.
        </Text>
      </View>

      <View className="gap-5">
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
            Send verification code
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
            Back to login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
