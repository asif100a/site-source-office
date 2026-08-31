import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react-native";
import { useForm } from "react-hook-form";
import LogoWhite from "@/assets/icons/LogoWhite";
import { Text } from "@/components/ui/text";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import { normalizeUserRole, type UserRole } from "@/constants/Routes";
import { useForgotPasswordMutation } from "@/store/api/authApi";
import Toast from "react-native-toast-message";

interface ForgotPasswordScreenProps {
  role?: UserRole;
  onBackToLogin?: () => void;
  onSubmitEmail?: (email: string) => void;
}

export default function ForgotPasswordScreen({
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

      console.log("Forgot password response: ", response);

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
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      <View className="bg-[#FF5500] px-6 pb-10 pt-16">
        <View className="mb-4 items-center justify-center">
          <LogoWhite />
        </View>
        <Text className="text-3xl font-bold tracking-tight text-white">
          Reset Your Password
        </Text>
        <Text className="mt-1.5 text-sm font-medium text-white/85">
          Enter your email to receive a verification code.
        </Text>
      </View>

      <View className="flex-1 justify-between px-6 pb-10 pt-8">
        <View className="gap-6">
          <View className="gap-1">
            <Text className="text-lg font-semibold text-[#1B2530]">
              Forgot your password?
            </Text>
            <Text className="text-sm leading-6 text-neutral-500">
              We’ll send a one-time code so you can reset your password safely.
            </Text>
          </View>

          <StandardInputField
            label="Email Address"
            id="email"
            type="email"
            control={control}
            required={true}
            placeholder="Enter your email"
          />

          <TouchableOpacity
            onPress={handleSubmit(handleSend)}
            disabled={isLoading}
            activeOpacity={0.9}
            className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-[#1B2530] py-4 shadow-sm"
          >
            <Text className="text-base font-semibold text-white">
              {isLoading ? "Sending..." : "Send verification code"}
            </Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          className="mt-8 flex-row items-center justify-center gap-2 py-2"
        >
          <ArrowLeft size={16} color="#1B2530" />
          <Text className="text-sm font-semibold text-[#1B2530] underline">
            Back to login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
