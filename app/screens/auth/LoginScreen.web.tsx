import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react-native";
import { Text as UiText } from "@/components/ui/text";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import {
  getDashboardRouteForRole,
  normalizeUserRole,
  type UserRole,
} from "@/constants/Routes";
import AuthWebShell from "./_web-shell";

interface LoginScreenProps {
  role?: UserRole;
  onRegisterPress?: () => void;
  onForgotPasswordPress?: () => void;
  onLoginPress?: (email: string) => void;
}

export default function LoginScreenWeb({
  role,
  onRegisterPress,
  onForgotPasswordPress,
  onLoginPress,
}: LoginScreenProps) {
  const router = useRouter();
  const activeRole = normalizeUserRole(role);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: any) => {
    if (onLoginPress) {
      onLoginPress(data.email);
    } else {
      router.replace(getDashboardRouteForRole(activeRole));
    }
  };

  const handleSsoLogin = () => {
    if (onLoginPress) {
      onLoginPress("");
    } else {
      router.replace(getDashboardRouteForRole(activeRole));
    }
  };

  const handleRegister = () => {
    if (onRegisterPress) {
      onRegisterPress();
    } else {
      router.push({
        pathname: "/auth",
        params: {
          step:
            activeRole === "employer" ? "register_employer" : "register_sso",
          role: activeRole,
        },
      });
    }
  };

  const handleForgotPassword = () => {
    if (onForgotPasswordPress) {
      onForgotPasswordPress();
      return;
    }

    router.push({
      pathname: "/auth",
      params: { step: "forgot_password", role: activeRole },
    });
  };

  return (
    <AuthWebShell
      eyebrow="Welcome back"
      title="Login to your account"
      subtitle="Sign in to continue your journey with Site Source."
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

        <StandardInputField
          label="Password"
          id="password"
          type="password"
          control={control}
          required
          placeholder="Enter your password"
        />

        <TouchableOpacity
          onPress={handleForgotPassword}
          activeOpacity={0.7}
          className="self-end py-1"
        >
          <Text className="text-sm font-semibold text-[#1B2530] underline">
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-6 gap-4">
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.9}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
        >
          <UiText className="text-base font-semibold text-white">Login</UiText>
          <ArrowRight size={16} color="#FFFFFF" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-3">
          <View className="h-px flex-1 bg-neutral-200" />
          <Text className="text-xs font-semibold uppercase text-neutral-400">
            Or
          </Text>
          <View className="h-px flex-1 bg-neutral-200" />
        </View>

        <View className="grid gap-3 md:grid-cols-2">
          <TouchableOpacity
            onPress={handleSsoLogin}
            activeOpacity={0.9}
            className="items-center justify-center rounded-2xl border border-neutral-200 bg-white py-4"
          >
            <UiText className="text-base font-semibold text-[#1B2530]">
              Sign in with Google
            </UiText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSsoLogin}
            activeOpacity={0.9}
            className="items-center justify-center rounded-2xl bg-[#1B2530] py-4"
          >
            <UiText className="text-base font-semibold text-white">
              Sign in with Apple
            </UiText>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-center">
          <Text className="text-sm font-medium text-neutral-700">
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={handleRegister} activeOpacity={0.7}>
            <Text className="text-sm font-semibold text-[#1B2530] underline">
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthWebShell>
  );
}
