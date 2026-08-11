import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ProgressImg from "@/assets/images/auth/progress.png";
import { ArrowRight, Sparkles } from "lucide-react-native";
import AuthWebShell from "./_web-shell";

interface ReviewScreenProps {
  onBackToLogin: () => void;
}

export default function ReviewScreenWeb({ onBackToLogin }: ReviewScreenProps) {
  return (
    <AuthWebShell
      eyebrow="Application review"
      title="Application under review"
      subtitle="Your account is under review by our team. You'll be notified as soon as it's approved, and then you can log in."
      footer={
        <View className="flex-row items-center gap-2 rounded-2xl bg-neutral-50 px-4 py-3">
          <Sparkles size={16} color="#FF5500" />
          <Text className="text-xs font-semibold text-neutral-600">
            Review typically completes shortly after submission
          </Text>
        </View>
      }
    >
      <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
        <View className="flex items-center justify-center py-8">
          <Image
            source={ProgressImg}
            style={{ width: 160, height: 160, resizeMode: "contain" }}
          />
          <Text className="mt-8 text-center text-[26px] font-semibold tracking-tight text-[#1B2530]">
            Application under review
          </Text>
          <Text className="mt-4 max-w-xl text-center text-sm leading-6 text-neutral-500">
            Your account is under review by our team. You'll be notified as
            soon as it's approved, and then you can log in.
          </Text>
        </View>

        <TouchableOpacity
          onPress={onBackToLogin}
          activeOpacity={0.7}
          className="mx-auto flex-row items-center gap-2 py-2"
        >
          <Text className="text-sm font-semibold text-neutral-600 underline">
            Back to login
          </Text>
          <ArrowRight size={16} color="#52525B" />
        </TouchableOpacity>
      </View>
    </AuthWebShell>
  );
}
