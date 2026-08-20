import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ArrowRight, Check } from "lucide-react-native";
import Toast from "react-native-toast-message";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import {
  getDashboardRouteForRole,
  normalizeUserRole,
  type UserRole,
} from "@/constants/Routes";
import AuthWebShell from "./_web-shell";

interface RegisterPasswordScreenProps {
  role?: UserRole;
  onComplete?: (password: string) => void;
  onBackPress?: () => void;
}

export default function RegisterPasswordScreenWeb({
  role,
  onComplete,
  onBackPress,
}: RegisterPasswordScreenProps) {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const activeRole = normalizeUserRole(role);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    router.push({
      pathname: "/auth",
      params: { step: "register_documents", role: activeRole },
    });
  };

  const onSubmit = (data: any) => {
    if (data.password !== data.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not match.",
      });
      return;
    }

    if (onComplete) {
      onComplete(data.password);
    } else {
      router.replace(getDashboardRouteForRole(activeRole));
    }
  };

  return (
    <AuthWebShell
      eyebrow="Final step"
      title="Create your password"
      subtitle="Use a strong password so your account stays protected."
      onBackPress={handleBack}
    >
      <View className="grid gap-5 lg:grid-cols-2">
        <View className="lg:col-span-2">
          <StandardInputField
            label="Password"
            id="password"
            type="password"
            control={control}
            required
            placeholder="Enter your password"
          />
        </View>

        <View className="lg:col-span-2">
          <StandardInputField
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            control={control}
            required
            placeholder="Confirm your password"
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setRememberMe((current) => !current)}
        activeOpacity={0.8}
        className="mt-2 flex-row items-center gap-3 py-2"
      >
        <View
          className={`h-5 w-5 items-center justify-center rounded-md border ${
            rememberMe
              ? "border-[#FF5500] bg-[#FF5500]"
              : "border-neutral-300 bg-[#FCFCFC]"
          }`}
        >
          {rememberMe ? <Check size={12} color="#FFFFFF" strokeWidth={3} /> : null}
        </View>
        <Text className="text-sm font-medium text-neutral-700">
          Remember me
        </Text>
      </TouchableOpacity>

      <View className="mt-6 gap-4">
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.9}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
        >
          <Text className="text-base font-semibold text-white">
            Save password
          </Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </AuthWebShell>
  );
}
