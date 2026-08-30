import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react-native";
import Toast from "react-native-toast-message";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import { normalizeUserRole } from "@/constants/Routes";
import { useRegisterMutation } from "@/store/api/authApi";
import AuthWebShell from "./_web-shell";

interface RegisterSsoScreenProps {
  onContinue?: (data: {
    provider?: "google" | "apple";
    name?: string;
    email?: string;
  }) => void;
  onLoginPress?: () => void;
  onBackPress?: () => void;
}

export default function RegisterSsoScreenWeb({
  onContinue,
  onLoginPress,
  onBackPress,
}: RegisterSsoScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const activeRole = normalizeUserRole(params.role);
  const [register, { isLoading }] = useRegisterMutation();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleProviderContinue = (provider: "google" | "apple") => {
    onContinue?.({ provider });
  };

  const handleManualContinue = async (data: {
    name: string;
    email: string;
  }) => {
    try {
      const response = await register({
        name: data.name,
        email: data.email,
      }).unwrap();

      Toast.show({
        type: "success",
        text1: "Registration successful",
        text2: response.message ?? "Your account has been created.",
      });

      router.push({
        pathname: "/auth",
        params: {
          step: "register_general",
          role: activeRole,
        },
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2:
          error?.data?.message ??
          error?.message ??
          "Unable to complete registration right now.",
      });
    }
  };

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    router.push({ pathname: "/auth", params: { step: "login" } });
  };

  return (
    <AuthWebShell
      eyebrow="Registration"
      title="Start your registration"
      subtitle="Use Google, Apple, or your details to confirm your email and begin creating your account."
      onBackPress={handleBack}
    >
      <View className="gap-5">
        <StandardInputField
          label="Name"
          id="name"
          control={control}
          required
          placeholder="Enter your name"
        />

        <StandardInputField
          label="Email"
          id="email"
          type="email"
          control={control}
          required
          placeholder="Enter your email"
        />

        <StandardInputField
          label="Password"
          id="password"
          type="password"
          control={control}
          required
          placeholder="Enter your password"
        />

        <StandardInputField
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          control={control}
          required
          placeholder="Confirm your password"
        />

        <TouchableOpacity
          onPress={handleSubmit(handleManualContinue)}
          activeOpacity={0.9}
          disabled={isLoading}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
        >
          <Text className="text-base font-semibold text-white">
            {isLoading ? "Creating Account..." : "Continue"}
          </Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View className="my-6 flex-row items-center gap-3">
        <View className="h-px flex-1 bg-neutral-200" />
        <Text className="text-xs font-semibold uppercase text-neutral-400">
          Or register with
        </Text>
        <View className="h-px flex-1 bg-neutral-200" />
      </View>

      <View className="grid gap-3 md:grid-cols-2">
        <TouchableOpacity
          onPress={() => handleProviderContinue("google")}
          activeOpacity={0.9}
          className="items-center justify-center rounded-2xl border border-neutral-200 bg-white py-4"
        >
          <Text className="text-base font-semibold text-[#1B2530]">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleProviderContinue("apple")}
          activeOpacity={0.9}
          className="items-center justify-center rounded-2xl bg-[#1B2530] py-4"
        >
          <Text className="text-base font-semibold text-white">
            Continue with Apple
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-8 flex-row items-center justify-center">
        <Text className="text-sm font-medium text-neutral-700">
          Already have an account?{" "}
        </Text>
        <TouchableOpacity
          onPress={
            onLoginPress ??
            (() =>
              router.push({ pathname: "/auth", params: { step: "login" } }))
          }
          activeOpacity={0.7}
        >
          <Text className="text-sm font-semibold text-[#1B2530] underline">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </AuthWebShell>
  );
}
