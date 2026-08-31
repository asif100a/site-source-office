import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { Text } from "@/components/ui/text";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import { normalizeUserRole, type UserRole } from "@/constants/Routes";
import AuthWebShell from "./_web-shell";
import { useForgotPasswordMutation } from "@/store/api/authApi";
import Toast from "react-native-toast-message";

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
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const handleSend = async (data: { email: string }) => {
    try {
      const response = await forgotPassword({
        email: data.email.trim(),
        purpose: "RESET_PASSWORD",
      }).unwrap();

      if (response.success || (response?.data as any)?.success) {
        Toast.show({
          type: "success",
          text1: "Verification code sent",
          text2: response?.message ?? "Check your email for the reset code.",
        });

        if (onSubmitEmail) {
          onSubmitEmail(data.email.trim());
          return;
        }
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Unable to send code",
        text2:
          error?.data?.message ??
          error?.message ??
          "Please try again in a moment.",
      });
    }
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
          disabled={isLoading}
          activeOpacity={0.9}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
        >
          <Text className="text-base font-semibold text-white">
            {isLoading ? "Sending..." : "Send verification code"}
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
