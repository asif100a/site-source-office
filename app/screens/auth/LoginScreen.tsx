import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "@/components/ui/text";
import LogoWhite from "@/assets/icons/LogoWhite";
import { useForm } from "react-hook-form";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import { useLoginMutation } from "@/store/api/authApi";
import { logout, setToken } from "@/store/slices/authSlice";
import {
  getDashboardRouteForRole,
  normalizeUserRole,
  UserRole,
} from "@/constants/Routes";
import { passwordSchema } from "@/zod/authSchema";
import { getRoleFromToken } from "@/utils/authToken";

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
      console.log("Login response: ", response);

      if (response.success || (response?.data as any)?.success) {
        const token =
          response.accessToken ??
          response.data?.accessToken ??
          (response.data as any)?.token;

        const tokenRole = token ? getRoleFromToken(token) : null

        if (!token || !tokenRole || tokenRole !== activeRole) {
          dispatch(logout());
          await AsyncStorage.removeItem("token");
          Toast.show({
            type: "error",
            text1: "Wrong account type",
            text2: `This account is not registered as a ${activeRole}.`,
          });
          return;
        }

        dispatch(setToken(token));
        await AsyncStorage.setItem("token", token);

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
            rules={{
              validate: (value: string) => {
                const result = passwordSchema.safeParse(value);
                return result.success || result.error.errors[0]?.message;
              },
            }}
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
            disabled={isLoading}
            className="w-full bg-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm"
          >
            <Text className="text-white text-base font-semibold">
              {isLoading ? "Logging in..." : "Login"}
            </Text>
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
