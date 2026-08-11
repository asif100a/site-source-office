import React, { useEffect, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import WalletImg from "@/assets/images/auth/money-bag.png";
import ProgressImg from "@/assets/images/auth/progress.png";
import CheckmarkImg from "@/assets/images/auth/checkmark.png";
import { ShieldCheck, Sparkles } from "lucide-react-native";
import AuthWebShell from "./_web-shell";

interface CompletePayrollScreenProps {
  onComplete: () => void;
}

type SubStep = "initial" | "review" | "completed";

export default function CompletePayrollScreenWeb({
  onComplete,
}: CompletePayrollScreenProps) {
  const [subStep, setSubStep] = useState<SubStep>("initial");

  useEffect(() => {
    if (subStep === "review") {
      const timer = setTimeout(() => {
        setSubStep("completed");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [subStep]);

  if (subStep === "review") {
    return (
      <AuthWebShell
        eyebrow="Payroll setup"
        title="Application under review"
        subtitle="Your account is under review by our team. You'll be notified as soon as it's approved."
      >
        <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
          <View className="flex items-center justify-center py-10">
            <Image
              source={ProgressImg}
              style={{ width: 160, height: 160, resizeMode: "contain" }}
            />
            <Text className="mt-6 text-center text-[26px] font-semibold tracking-tight text-[#1B2530]">
              Application under review
            </Text>
            <Text className="mt-3 max-w-xl text-center text-sm leading-6 text-neutral-500">
              Your account is under review by our team. You'll be notified as
              soon as it's approved, and then you can log in.
            </Text>
          </View>
        </View>
      </AuthWebShell>
    );
  }

  const isCompleted = subStep === "completed";

  return (
    <AuthWebShell
      eyebrow="Payroll partner"
      title="Complete employment partner profile"
      subtitle="Connect your payroll partner to continue."
      footer={
        <View className="flex-row items-center gap-2 rounded-2xl bg-neutral-50 px-4 py-3">
          <Sparkles size={16} color="#FF5500" />
          <Text className="text-xs font-semibold text-neutral-600">
            Secure setup before dashboard access
          </Text>
        </View>
      }
    >
      <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
        <View className="">
          <View className="flex items-center justify-center rounded-[24px] bg-neutral-50 p-6 mb-6">
            <Image
              source={WalletImg}
              style={{ width: 160, height: 160, resizeMode: "contain" }}
            />
            <View className="mt-6 rounded-full bg-orange-50 px-3 py-1.5">
              <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-900">
                Payroll
              </Text>
            </View>
          </View>

          <View className="gap-4">
            <View className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-5">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                  <ShieldCheck size={18} color="#FF5500" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-neutral-900">
                    Connect your payroll partner
                  </Text>
                  <Text className="mt-1 text-sm leading-6 text-neutral-600">
                    Finish this step to activate payroll and continue to review.
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setSubStep("review")}
              activeOpacity={0.9}
              className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
            >
              <Text className="text-base font-semibold text-white">
                {isCompleted ? "Connect payroll" : "Complete employment partner profile"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={isCompleted}
          transparent
          animationType="fade"
          onRequestClose={() => {}}
        >
          <View className="flex-1 items-center justify-center bg-neutral-500/60 px-6">
            <View className="w-full max-w-xl rounded-[32px] bg-white p-8 items-center">
              <Image
                source={CheckmarkImg}
                style={{ width: 90, height: 90, resizeMode: "contain" }}
              />

              <Text className="mt-6 text-2xl font-semibold tracking-tight text-[#1B2530]">
                Profile completed
              </Text>
              <Text className="mt-3 max-w-md text-center text-sm leading-6 text-neutral-500">
                Congratulations, your profile is complete. You can now start
                searching for jobs.
              </Text>

              <TouchableOpacity
                onPress={onComplete}
                activeOpacity={0.9}
                className="mt-8 w-full rounded-2xl bg-[#1B2530] py-4 items-center justify-center"
              >
                <Text className="text-base font-semibold text-white">
                  Go to dashboard
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </AuthWebShell>
  );
}
