import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import LogoWhite from "@/assets/icons/LogoWhite";
import { useForm } from "react-hook-form";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import {
  getDashboardRouteForRole,
  normalizeUserRole,
  UserRole,
} from "@/constants/Routes";

interface LoginScreenProps {
  role?: UserRole;
  onRegisterPress?: () => void;
  onForgotPasswordPress?: () => void;
  onLoginPress?: (email: string) => void;
}

export default function LoginScreen({
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
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      <View className="bg-[#FF5500] pb-10 px-6">
        <View className="mb-4 justify-center items-center">
          <LogoWhite />
        </View>
        <Text className="text-white text-3xl font-bold tracking-tight">
          Login To Your Account
        </Text>
        <Text className="text-white/85 text-sm mt-1.5 font-medium">
          Sign in to continue your journey with Site Source
        </Text>
      </View>

      <View className="flex-1 px-6 pt-8 pb-10 justify-between">
        <View className="gap-1">
          <StandardInputField
            label="Email Address"
            id="email"
            type="email"
            control={control}
            required={true}
            placeholder="Enter Your Email"
          />

          <StandardInputField
            label="Password"
            id="password"
            type="password"
            control={control}
            required={true}
            placeholder="•••••••"
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

        <View className="mt-6 gap-6">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.9}
            className="w-full bg-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm"
          >
            <Text className="text-white text-base font-semibold">Login</Text>
          </TouchableOpacity>

          <View className="gap-3">
            <View className="flex-row items-center gap-3">
              <View className="flex-1 h-px bg-neutral-200" />
              <Text className="text-neutral-400 text-xs font-semibold uppercase">
                Or
              </Text>
              <View className="flex-1 h-px bg-neutral-200" />
            </View>

            <TouchableOpacity
              onPress={handleSsoLogin}
              activeOpacity={0.9}
              className="w-full border border-neutral-200 bg-white py-4 rounded-xl items-center justify-center shadow-sm"
            >
              <Text className="text-[#1B2530] text-base font-semibold">
                Sign in with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSsoLogin}
              activeOpacity={0.9}
              className="w-full bg-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm"
            >
              <Text className="text-white text-base font-semibold">
                Sign in with Apple
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center items-center">
            <Text className="text-neutral-800 text-sm font-medium">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={handleRegister} activeOpacity={0.7}>
              <Text className="text-[#1B2530] text-sm font-bold underline">
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
