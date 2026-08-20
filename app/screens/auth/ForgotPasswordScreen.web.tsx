import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useForm } from "react-hook-form";
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
    <AuthWebShell
      eyebrow="Password recovery"
      title="Forgot your password?"
      subtitle="We'll send a one-time code so you can reset your password safely."
      onBackPress={handleBack}
    >
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
          <Text className="text-sm font-semibold text-[#1B2530] underline">
            Back to login
          </Text>
        </TouchableOpacity>
      </View>
    </AuthWebShell>
  );
}
