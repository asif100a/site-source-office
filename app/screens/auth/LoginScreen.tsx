import React, { useState } from "react";
import { Platform, View, TouchableOpacity, ScrollView } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "@/components/ui/text";
import LogoWhite from "@/assets/icons/LogoWhite";
import { useForm } from "react-hook-form";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import {
  useAppleLoginMutation,
  useGoogleLoginMutation,
  useLoginMutation,
} from "@/store/api/authApi";
import { logout, setToken } from "@/store/slices/authSlice";
import {
  getDashboardRouteForRole,
  normalizeUserRole,
  UserRole,
} from "@/constants/Routes";
import { passwordSchema } from "@/zod/authSchema";
import { getRoleFromToken } from "@/utils/authToken";
import {
  getGoogleSignInErrorMessage,
  isGoogleSignInConfigured,
  signInWithGoogleInApp,
} from "@/utils/googleSignIn";
import { getOptionalPushNotificationToken } from "@/services/pushNotifications";
import { checkIsProfileComplete } from "@/utils/profileCompleteness";

interface LoginScreenProps {
  role?: UserRole;
  onRegisterPress?: () => void;
  onForgotPasswordPress?: () => void;
  onLoginPress?: (email: string) => void;
  onRequireDetails?: (data: {
    email: string;
    name?: string;
    provider?: "google" | "apple" | "manual";
  }) => void;
}

export default function LoginScreen({
  role,
  onRegisterPress,
  onForgotPasswordPress,
  onLoginPress,
  onRequireDetails,
}: LoginScreenProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const activeRole = normalizeUserRole(role);
  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const [appleLogin] = useAppleLoginMutation();
  const [ssoLoading, setSsoLoading] = useState<"google" | "apple" | null>(null);

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
      // console.log("Login response: ", response);

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

        const isComplete = await checkIsProfileComplete(dispatch, activeRole);
        if (!isComplete) {
          Toast.show({
            type: "info",
            text1: "Profile incomplete",
            text2: "Please complete your profile details to continue.",
          });
          if (onRequireDetails) {
            onRequireDetails({
              email: data.email,
              provider: "manual",
            });
            return;
          }
          router.replace({
            pathname: "/auth",
            params: {
              step:
                activeRole === "employer"
                  ? "register_employer"
                  : "register_general",
              role: activeRole,
            },
          });
          return;
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

  const completeSsoLogin = async (
    provider: "google" | "apple",
    identity: { email?: string; name?: string; picture?: string; idToken?: string },
  ) => {
    if (!identity.email) {
      throw new Error(
        "Your provider did not return an email address. Please use a different sign-in method.",
      );
    }

    const payload = {
      name: identity.name || identity.email.split("@")[0],
      email: identity.email,
      role: activeRole.toUpperCase(),
      image: identity.picture,
      fcmToken: (await getOptionalPushNotificationToken()) ?? "",
      idToken: identity.idToken ?? "",
    };
    const response =
      provider === "google"
        ? await googleLogin(payload).unwrap()
        : await appleLogin(payload).unwrap();

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

    const isComplete = await checkIsProfileComplete(dispatch, activeRole);
    if (!isComplete) {
      Toast.show({
        type: "info",
        text1: "Profile incomplete",
        text2: "Please complete your profile details to continue.",
      });
      if (onRequireDetails) {
        onRequireDetails({
          email: identity.email,
          name: identity.name,
          provider,
        });
        return;
      }
      router.replace({
        pathname: "/auth",
        params: {
          step:
            activeRole === "employer"
              ? "register_employer"
              : "register_general",
          role: activeRole,
        },
      });
      return;
    }

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
  };

  const handleGoogleLogin = async () => {
    if (!isGoogleSignInConfigured()) {
      Toast.show({
        type: "error",
        text1: "Google sign-in is not configured",
        text2: "Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to .env.",
      });
      return;
    }

    setSsoLoading("google");
    try {
      const identity = await signInWithGoogleInApp();
      // console.log("Google sign-in identity: ", identity);
      if (!identity) return;
      await completeSsoLogin("google", identity);
      
    } catch (error: any) {
      console.error("Google sign-in error: ", error);
      const errorMessage = getGoogleSignInErrorMessage(error);
      if (!errorMessage) return;

      Toast.show({
        type: "error",
        text1: "Google sign-in failed",
        text2: error?.data?.message ?? errorMessage,
      });
    } finally {
      setSsoLoading(null);
    }
  };

  const handleAppleLogin = async () => {
    if (Platform.OS !== "ios" || !(await AppleAuthentication.isAvailableAsync())) {
      Toast.show({
        type: "error",
        text1: "Apple sign-in is unavailable",
        text2: "Apple sign-in is available in the iOS app.",
      });
      return;
    }

    setSsoLoading("apple");
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!credential.identityToken) {
        throw new Error("Apple did not return an identity token.");
      }
      const tokenIdentity = getIdentityFromToken(credential.identityToken);
      const name = [
        credential.fullName?.givenName,
        credential.fullName?.familyName,
      ]
        .filter(Boolean)
        .join(" ");
      await completeSsoLogin("apple", {
        email: credential.email ?? tokenIdentity.email,
        name: name || tokenIdentity.name,
        idToken: credential.identityToken,
      });
    } catch (error: any) {
      console.error("Apple sign-in error: ", error);
      if (error?.code !== "ERR_REQUEST_CANCELED") {
        Toast.show({
          type: "error",
          text1: "Apple sign-in failed",
          text2:
            error?.data?.message ?? error?.message ?? "Please try again.",
        });
      }
    } finally {
      setSsoLoading(null);
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
              onPress={() => void handleGoogleLogin()}
              activeOpacity={0.9}
              disabled={isLoading || ssoLoading !== null}
              className="w-full border border-neutral-200 bg-white py-4 rounded-xl items-center justify-center shadow-sm"
            >
              <Text className="text-[#1B2530] text-base font-semibold">
                {ssoLoading === "google" ? "Connecting to Google..." : "Sign in with Google"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => void handleAppleLogin()}
              activeOpacity={0.9}
              disabled={isLoading || ssoLoading !== null}
              className="w-full bg-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm"
            >
              <Text className="text-white text-base font-semibold">
                {ssoLoading === "apple" ? "Connecting to Apple..." : "Sign in with Apple"}
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
