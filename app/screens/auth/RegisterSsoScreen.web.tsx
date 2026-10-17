import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react-native";
import Toast from "react-native-toast-message";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import { normalizeUserRole } from "@/constants/Routes";
import { useGoogleLoginMutation, useRegisterMutation } from "@/store/api/authApi";
import { passwordSchema } from "@/zod/authSchema";
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

WebBrowser.maybeCompleteAuthSession();

const googleClientIds = {
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

export default function RegisterSsoScreenWeb({
  onContinue,
  onLoginPress,
  onBackPress,
}: RegisterSsoScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const activeRole = normalizeUserRole(params.role);
  const [register, { isLoading }] = useRegisterMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const [ssoLoading, setSsoLoading] = useState(false);
  const [googleRequest, , promptGoogle] = Google.useIdTokenAuthRequest({
    ...googleClientIds,
    scopes: ["openid", "profile", "email"],
  });
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

  const handleGoogleContinue = async () => {
    if (!googleClientIds.webClientId) {
      Toast.show({ type: "error", text1: "Google sign-in is not configured", text2: "Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to .env." });
      return;
    }
    if (!googleRequest) return;

    setSsoLoading(true);
    try {
      const result = await promptGoogle();
      if (result.type !== "success") return;
      const token = result.params.id_token;
      if (!token) throw new Error("Google did not return an identity token.");
      const identity = getIdentityFromToken(token);
      if (!identity.email) throw new Error("Google did not return an email address.");
      const response = await googleLogin({
        name: identity.name || identity.email.split("@")[0],
        email: identity.email,
        role: activeRole.toUpperCase(),
        image: identity.picture,
        fcmToken: "",
        idToken: token,
      }).unwrap();
      const user = response.data?.user;
      onContinue?.({
        provider: "google",
        email: user?.email ?? identity.email,
        name: user?.name ?? identity.name,
      });
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Google sign-in failed", text2: error?.data?.message ?? error?.message ?? "Please try again." });
    } finally {
      setSsoLoading(false);
    }
  };

  const handleAppleContinue = () => {
    Toast.show({
      type: "error",
      text1: "Apple web sign-in needs server setup",
      text2: "Configure an Apple web OAuth callback on the backend before enabling this button.",
    });
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
      const response = await register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: activeRole.toUpperCase(),
      }).unwrap();

      Toast.show({
        type: "success",
        text1: "Registration successful",
        text2: response.message ?? "Your account has been created.",
      });

      onContinue?.({ email: data.email, name: data.name });
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
          rules={{
            validate: (value: string) => {
              const result = passwordSchema.safeParse(value);
              return result.success || result.error.errors[0]?.message;
            },
          }}
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
          onPress={() => void handleGoogleContinue()}
          activeOpacity={0.9}
          disabled={isLoading || ssoLoading || !googleRequest}
          className="items-center justify-center rounded-2xl border border-neutral-200 bg-white py-4"
        >
          <Text className="text-base font-semibold text-[#1B2530]">
            {ssoLoading ? "Connecting to Google..." : "Continue with Google"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAppleContinue}
          activeOpacity={0.9}
          disabled={isLoading || ssoLoading}
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
