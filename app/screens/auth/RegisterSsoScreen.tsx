import React, { useState } from "react";
import { Platform, ScrollView, TouchableOpacity, View } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import LogoWhite from "@/assets/icons/LogoWhite";
import { useForm } from "react-hook-form";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import Toast from "react-native-toast-message";
import { normalizeUserRole } from "@/constants/Routes";
import {
  useAppleLoginMutation,
  useGoogleLoginMutation,
  useRegisterMutation,
} from "@/store/api/authApi";
import { passwordSchema } from "@/zod/authSchema";
import {
  getGoogleSignInErrorMessage,
  isGoogleSignInConfigured,
  signInWithGoogleInApp,
} from "@/utils/googleSignIn";
import { getOptionalPushNotificationToken } from "@/services/pushNotifications";

interface RegisterSsoScreenProps {
  onContinue?: (data: {
    provider?: "google" | "apple";
    name?: string;
    email?: string;
  }) => void;
  onLoginPress?: () => void;
  onBackPress?: () => void;
}

export default function RegisterSsoScreen({
  onContinue,
  onLoginPress,
}: RegisterSsoScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const activeRole = normalizeUserRole(params.role);
  const [register, { isLoading }] = useRegisterMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const [appleLogin] = useAppleLoginMutation();
  const [ssoLoading, setSsoLoading] = useState<"google" | "apple" | null>(null);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

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

  const completeSsoRegistration = async (
    provider: "google" | "apple",
    identity: { email?: string; name?: string; picture?: string; idToken?: string },
  ) => {
    if (!identity.email) {
      throw new Error("Your provider did not return an email address. Please use a different sign-in method.");
    }

    const payload = {
      name: identity.name || identity.email.split("@")[0],
      email: identity.email,
      role: activeRole.toUpperCase(),
      image: identity.picture,
      fcmToken: (await getOptionalPushNotificationToken()) ?? "",
      idToken: identity.idToken ?? "",
    };
    const response = provider === "google"
      ? await googleLogin(payload).unwrap()
      : await appleLogin(payload).unwrap();
    const user = response.data?.user;
    onContinue?.({
      provider,
      email: user?.email ?? identity.email,
      name: user?.name ?? identity.name,
    });
  };

  const handleGoogleContinue = async () => {
    if (!isGoogleSignInConfigured()) {
      Toast.show({ type: "error", text1: "Google sign-in is not configured", text2: "Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to .env." });
      return;
    }

    setSsoLoading("google");
    try {
      const identity = await signInWithGoogleInApp();
      if (!identity) return;
      await completeSsoRegistration("google", identity);
    } catch (error: any) {
      const errorMessage = getGoogleSignInErrorMessage(error);
      if (!errorMessage) return;

      Toast.show({ type: "error", text1: "Google sign-in failed", text2: error?.data?.message ?? errorMessage });
    } finally {
      setSsoLoading(null);
    }
  };

  const handleAppleContinue = async () => {
    if (Platform.OS !== "ios" || !(await AppleAuthentication.isAvailableAsync())) {
      Toast.show({ type: "error", text1: "Apple sign-in is unavailable", text2: "Apple sign-in is available in the iOS app." });
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
      if (!credential.identityToken) throw new Error("Apple did not return an identity token.");
      const tokenIdentity = getIdentityFromToken(credential.identityToken);
      const name = [credential.fullName?.givenName, credential.fullName?.familyName]
        .filter(Boolean)
        .join(" ");
      await completeSsoRegistration("apple", {
        email: credential.email ?? tokenIdentity.email,
        name: name || tokenIdentity.name,
        idToken: credential.identityToken,
      });
    } catch (error: any) {
      if (error?.code !== "ERR_REQUEST_CANCELED") {
        Toast.show({ type: "error", text1: "Apple sign-in failed", text2: error?.data?.message ?? error?.message ?? "Please try again." });
      }
    } finally {
      setSsoLoading(null);
    }
  };

  const handleManualContinue = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (data.password !== data.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not match.",
      });
      return;
    }

    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: activeRole.toUpperCase(),
      };
      const response = await register(payload).unwrap();

      Toast.show({
        type: "success",
        text1: "Registration successful",
        text2: response.message ?? "Your account has been created.",
      });

      onContinue?.({ email: data.email, name: data.name });
    } catch (error: any) {
      console.error("Sso Registration error: ", error);
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

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      bounces={false}
    >
      <View className="bg-[#FF5500] pb-10 px-6">
        <View className="mb-4 justify-center items-center">
          <LogoWhite />
        </View>
        <Text className="text-white text-3xl font-bold tracking-tight">
          Start Your Registration
        </Text>
        <Text className="text-white/85 text-sm mt-1.5 font-medium leading-relaxed">
          Use Google or Apple to confirm your email and name in one step.
        </Text>
      </View>

      <View className="flex-1 px-6 pt-8 pb-10 justify-between">
        <View className="gap-5">
          <View className="gap-3">
            <StandardInputField
              label="Name"
              id="name"
              control={control}
              required={true}
              placeholder="Enter your name"
            />

            <StandardInputField
              label="Email"
              id="email"
              type="email"
              control={control}
              required={true}
              placeholder="Enter your email"
            />

            {/* Password */}
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

            {/* Confirm Password */}
            <StandardInputField
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              control={control}
              required={true}
              placeholder="•••••••"
            />

            <TouchableOpacity
              onPress={handleSubmit(handleManualContinue)}
              activeOpacity={0.9}
              disabled={isLoading}
              className="w-full bg-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm mt-1"
            >
              <Text className="text-white text-base font-semibold">
                {isLoading ? "Creating Account..." : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center gap-3">
            <View className="flex-1 h-px bg-neutral-200" />
            <Text className="text-neutral-400 text-xs font-semibold uppercase">
              Or register with
            </Text>
            <View className="flex-1 h-px bg-neutral-200" />
          </View>

          <View className="gap-4">
            <TouchableOpacity
              onPress={() => void handleGoogleContinue()}
              activeOpacity={0.9}
              disabled={isLoading || ssoLoading !== null}
              className="w-full border border-neutral-200 bg-white py-4 rounded-xl items-center justify-center shadow-sm"
            >
              <Text className="text-[#1B2530] text-base font-semibold">
                {ssoLoading === "google" ? "Connecting to Google..." : "Continue with Google"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => void handleAppleContinue()}
              activeOpacity={0.9}
              disabled={isLoading || ssoLoading !== null}
              className="w-full bg-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm"
            >
              <Text className="text-white text-base font-semibold">
                {ssoLoading === "apple" ? "Connecting to Apple..." : "Continue with Apple"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-center items-center mt-10">
          <Text className="text-neutral-800 text-sm font-medium">
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
            <Text className="text-[#1B2530] text-sm font-bold underline">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
