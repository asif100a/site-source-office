import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useForm } from "react-hook-form";
import { ShieldCheck, Sparkles } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import { ScreenShell } from "./_components";

type ChangePasswordFormValues = {
  previousPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const PASSWORD_RULES = [
  "Use at least 8 characters",
  "Mix uppercase, lowercase, numbers, and symbols",
  "Avoid reusing a password from another account",
];

export default function ChangePasswordScreenWeb() {
  const { control } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      previousPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  return (
    <ScreenShell
      title="Change Password"
      footer={
        <View className="border-t border-neutral-200 bg-neutral-50 px-6 pb-6 pt-4 md:px-10 xl:px-12">
          <View className="mx-auto w-full max-w-7xl">
            <TouchableOpacity
              style={{ backgroundColor: Colors.common.GRAY_DARK }}
              className="h-14 items-center justify-center rounded-xl active:opacity-90"
            >
              <Text className="text-sm font-extrabold text-white">
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
          <View className="mx-auto w-full max-w-7xl">
            <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
              <View className="flex-col gap-6 lg:flex-row lg:items-start">
                <View className="flex-[1.1] gap-6">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                      <Sparkles size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-900">
                        Security
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        Keep your account protected
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950">
                      Update your password.
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      Choose a strong password and keep it unique to this account.
                      The mobile screen stays the same while web gets this wider
                      form layout.
                    </Text>
                  </View>

                  <View className="rounded-2xl bg-neutral-50 p-4">
                    <View className="flex-row items-center gap-3">
                      <View className="h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                        <ShieldCheck size={18} color={Colors.common.BRAND} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-neutral-900">
                          Password guidance
                        </Text>
                        <Text className="mt-1 text-sm leading-6 text-neutral-600">
                          A stronger password gives the profile more protection
                          across web and mobile.
                        </Text>
                      </View>
                    </View>

                    <View className="mt-4 gap-2">
                      {PASSWORD_RULES.map((rule) => (
                        <View key={rule} className="flex-row items-start gap-2">
                          <View className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-400" />
                          <Text className="flex-1 text-sm leading-6 text-neutral-600">
                            {rule}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                <View className="hidden h-px w-full bg-neutral-200 lg:block lg:h-auto lg:w-px" />

                <View className="flex-[1.8]">
                  <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                    <View className="gap-5">
                      <StandardInputField<ChangePasswordFormValues>
                        label="Previous Password"
                        id="previousPassword"
                        type="password"
                        control={control}
                        placeholder="Enter your previous password"
                        textInputProps={{
                          className: "text-sm font-semibold text-neutral-900",
                        }}
                      />

                      <StandardInputField<ChangePasswordFormValues>
                        label="New Password"
                        id="newPassword"
                        type="password"
                        control={control}
                        placeholder="Enter your new password"
                        textInputProps={{
                          className: "text-sm font-semibold text-neutral-900",
                        }}
                      />

                      <StandardInputField<ChangePasswordFormValues>
                        label="Confirm Password"
                        id="confirmPassword"
                        type="password"
                        control={control}
                        placeholder="Confirm your new password"
                        textInputProps={{
                          className: "text-sm font-semibold text-neutral-900",
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
