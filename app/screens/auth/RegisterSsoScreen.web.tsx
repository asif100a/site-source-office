import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ArrowRight, Sparkles } from "lucide-react-native";
import LogoWhite from "@/assets/icons/LogoWhite";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import AuthWebShell from "./_web-shell";

interface RegisterSsoScreenProps {
  onContinue?: (data: {
    provider?: "google" | "apple";
    name?: string;
    email?: string;
  }) => void;
  onLoginPress?: () => void;
}

export default function RegisterSsoScreenWeb({
  onContinue,
  onLoginPress,
}: RegisterSsoScreenProps) {
  const router = useRouter();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const handleContinue = (provider: "google" | "apple") => {
    onContinue?.({ provider });
  };

  const handleManualContinue = (data: { name: string; email: string }) => {
    onContinue?.(data);
  };

  return (
    <View className="flex-1 min-h-0">
      <View className="rounded-[28px] border border-neutral-200 bg-white p-5 md:p-6">
        <View className="mb-6 items-center rounded-[24px] bg-[#FF5500] px-6 py-8">
          <LogoWhite />
          <Text className="mt-6 text-center text-2xl font-black tracking-tight text-white">
            Start your application
          </Text>
          <Text className="mt-2 max-w-md text-center text-sm leading-6 text-white/85">
            Use Google or Apple to confirm your email and name in one step.
          </Text>
        </View>

        <View className="gap-5">
          <StandardInputField
            label="Name"
            id="name"
            control={control}
            required
            placeholder="Enter your name"
          />

          <StandardInputField
            label="Email Address"
            id="email"
            type="email"
            control={control}
            required
            placeholder="Enter your email"
          />

          <TouchableOpacity
            onPress={handleSubmit(handleManualContinue)}
            activeOpacity={0.9}
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
          >
            <Text className="text-base font-semibold text-white">Continue</Text>
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
            onPress={() => handleContinue("google")}
            activeOpacity={0.9}
            className="items-center justify-center rounded-2xl border border-neutral-200 bg-white py-4"
          >
            <Text className="text-base font-semibold text-[#1B2530]">
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleContinue("apple")}
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
            <Text className="text-sm font-bold text-[#1B2530] underline">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
