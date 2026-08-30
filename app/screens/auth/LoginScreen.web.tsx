import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react-native";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { Text as UiText } from "@/components/ui/text";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import { useLoginMutation } from "@/store/api/authApi";
import { setToken } from "@/store/slices/authSlice";
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
  const dispatch = useDispatch();
  const activeRole = normalizeUserRole(role);
  const [login, { isLoading }] = useLoginMutation();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      if (response.success || (response?.data as any)?.success) {
        const token =
          response.accessToken ??
          response.data?.accessToken ??
          (response.data as any)?.token;

        if (token) {
          dispatch(setToken(token));
        }

        Toast.show({
          type: "success",
          text1: "Login successful",
          text2: response.message ?? "Welcome back.",
        });

        if (onLoginPress) {
          onLoginPress(data.email);
        } else {
          router.replace(getDashboardRouteForRole(activeRole));
        }
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2:
          error?.data?.message ??
          error?.message ??
          "Please check your email and password.",
      });
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
          disabled={isLoading}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
        >
          <UiText className="text-base font-semibold text-white">
            {isLoading ? "Logging in..." : "Login"}
          </UiText>
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
