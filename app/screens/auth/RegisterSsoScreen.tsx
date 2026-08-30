import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import LogoWhite from "@/assets/icons/LogoWhite";
import { useForm } from "react-hook-form";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";

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
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      email: "",
      address: "",
    },
  });

  const handleContinue = (provider: "google" | "apple") => {
    onContinue?.({ provider });
  };

  const handleManualContinue = (data: { name: string; email: string }) => {
    // TODO: handle manual continue
    
    onContinue?.(data);
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

            <TouchableOpacity
              onPress={handleSubmit(handleManualContinue)}
              activeOpacity={0.9}
              className="w-full bg-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm mt-1"
            >
              <Text className="text-white text-base font-semibold">
                Continue
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
