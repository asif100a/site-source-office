import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react-native";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text as UiText } from "@/components/ui/text";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import {
  useGoogleLoginMutation,
  useLoginMutation,
} from "@/store/api/authApi";
import { logout, setToken } from "@/store/slices/authSlice";
import {
  getDashboardRouteForRole,
  normalizeUserRole,
  type UserRole,
} from "@/constants/Routes";
import AuthWebShell from "./_web-shell";
import { passwordSchema } from "@/zod/authSchema";
import { getRoleFromToken } from "@/utils/authToken";

interface LoginScreenProps {
  role?: UserRole;
  onRegisterPress?: () => void;
  onForgotPasswordPress?: () => void;
  onLoginPress?: (email: string) => void;
}

WebBrowser.maybeCompleteAuthSession();

const googleClientIds = {
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

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
  const [googleLogin] = useGoogleLoginMutation();
  const [ssoLoading, setSsoLoading] = useState(false);
  const [googleRequest, , promptGoogle] = Google.useIdTokenAuthRequest({
    ...googleClientIds,
    scopes: ["openid", "profile", "email"],
  });

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

        const tokenRole = token ? getRoleFromToken(token) : null;
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
      console.log("Login error: ", error);
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

  const getIdentityFromToken = (token: string) => {
    try {
      const payload = token.split(".")[1];
      if (!payload) return {};
      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(decodeURIComponent(escape(atob(normalized)))) as {
        email?: string;
        name?: string;
        picture?: string;
      };
    } catch {
      return {};
    }
  };

  const handleGoogleLogin = async () => {
    if (!googleClientIds.webClientId) {
      Toast.show({
        type: "error",
        text1: "Google sign-in is not configured",
        text2: "Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to .env.",
      });
      return;
    }
    if (!googleRequest) return;

    setSsoLoading(true);
    try {
      const result = await promptGoogle();
      if (result.type !== "success") return;
      const providerToken = result.params.id_token;
      if (!providerToken) {
        throw new Error("Google did not return an identity token.");
      }
      const identity = getIdentityFromToken(providerToken);
      if (!identity.email) {
        throw new Error("Google did not return an email address.");
      }

      const response = await googleLogin({
        name: identity.name || identity.email.split("@")[0],
        email: identity.email,
        profileImage: identity.picture,
        isLegalTermsAccepted: true,
      }).unwrap();
      const appToken =
        response.accessToken ??
        response.data?.accessToken ??
        (response.data as any)?.token;
      const tokenRole = appToken ? getRoleFromToken(appToken) : null;

      if (!appToken || !tokenRole || tokenRole !== activeRole) {
        dispatch(logout());
        await AsyncStorage.removeItem("token");
        Toast.show({
          type: "error",
          text1: "Wrong account type",
          text2: `This account is not registered as a ${activeRole}.`,
        });
        return;
      }

      dispatch(setToken(appToken));
      await AsyncStorage.setItem("token", appToken);

      Toast.show({
        type: "success",
        text1: "Login successful",
        text2: response.message ?? "Welcome back.",
      });

      if (onLoginPress) {
        onLoginPress(identity.email);
      } else {
        router.replace(getDashboardRouteForRole(activeRole));
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Google sign-in failed",
        text2:
          error?.data?.message ?? error?.message ?? "Please try again.",
      });
    } finally {
      setSsoLoading(false);
    }
  };

  const handleAppleLogin = () => {
    Toast.show({
      type: "error",
      text1: "Apple web sign-in needs server setup",
      text2: "Configure an Apple web OAuth callback on the backend before enabling this button.",
    });
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
          rules={{
            validate: (value: string) => {
              const result = passwordSchema.safeParse(value);
              return result.success || result.error.errors[0]?.message;
            },
          }}
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
          disabled={isLoading || ssoLoading}
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
            onPress={() => void handleGoogleLogin()}
            activeOpacity={0.9}
            disabled={isLoading || ssoLoading || !googleRequest}
            className="items-center justify-center rounded-2xl border border-neutral-200 bg-white py-4"
          >
            <UiText className="text-base font-semibold text-[#1B2530]">
              {ssoLoading ? "Connecting to Google..." : "Sign in with Google"}
            </UiText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAppleLogin}
            activeOpacity={0.9}
            disabled={isLoading || ssoLoading}
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
