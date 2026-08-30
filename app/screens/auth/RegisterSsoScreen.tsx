import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import LogoWhite from "@/assets/icons/LogoWhite";
import { useForm } from "react-hook-form";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import Toast from "react-native-toast-message";
import { normalizeUserRole } from "@/constants/Routes";
import { useRegisterMutation } from "@/store/api/authApi";

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
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleContinue = (provider: "google" | "apple") => {
    onContinue?.({ provider });
  };

  const handleManualContinue = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (data.password !== data.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match.'
      });
      return;
    }

    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: activeRole.toUpperCase(),
      }
      console.log("Sso Registration payload: ", payload);
      return;
      const response = await register(payload).unwrap();
      console.log("Sso Registration response: ", response);

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
              onPress={() => handleContinue("google")}
              activeOpacity={0.9}
              className="w-full border border-neutral-200 bg-white py-4 rounded-xl items-center justify-center shadow-sm"
            >
              <Text className="text-[#1B2530] text-base font-semibold">
                Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleContinue("apple")}
              activeOpacity={0.9}
              className="w-full bg-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm"
            >
              <Text className="text-white text-base font-semibold">
                Continue with Apple
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
