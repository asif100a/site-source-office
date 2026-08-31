import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import { ScreenShell } from "./_components";
import { useChangePasswordMutation } from "@/store/api/authApi";
import { passwordSchema } from "@/zod/authSchema";

type ChangePasswordFormValues = {
  previousPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      previousPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSave = async (data: ChangePasswordFormValues) => {
    const passwordValidation = passwordSchema.safeParse(data.newPassword);

    if (!passwordValidation.success) {
      setError(
        passwordValidation.error.errors[0]?.message ?? "Invalid password.",
      );
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await changePassword({
        oldPassword: data.previousPassword,
        newPassword: data.newPassword,
      }).unwrap();

      if (response.success || response?.data?.success) {
        setError("");
        reset();
        Toast.show({
          type: "success",
          text1: "Password updated",
          text2:
            response?.message ?? "Your password has been changed successfully.",
        });
        router.back();
      }
    } catch (apiError: any) {
      const message =
        apiError?.data?.message ??
        apiError?.message ??
        "Unable to change your password right now.";

      setError(message);
      Toast.show({
        type: "error",
        text1: "Change password failed",
        text2: message,
      });
    }
  };

  return (
    <ScreenShell
      title="Change Password"
      footer={
        <View className="px-5 pb-16 pt-4 bg-neutral-50">
          <TouchableOpacity
            onPress={handleSubmit(handleSave)}
            disabled={isLoading}
            style={{ backgroundColor: "#1E2933" }}
            className="h-14 rounded-lg items-center justify-center"
          >
            <Text className="text-white font-extrabold text-sm">
              {isLoading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <StandardInputField<ChangePasswordFormValues>
          label="Previous Password"
          id="previousPassword"
          type="password"
          control={control}
          required
          placeholder="Enter your previous password"
          textInputProps={{
            className: "text-neutral-900 text-sm font-semibold",
          }}
        />

        <StandardInputField<ChangePasswordFormValues>
          label="New Password"
          id="newPassword"
          type="password"
          control={control}
          required
          rules={{
            validate: (value: string) => {
              const result = passwordSchema.safeParse(value);
              return result.success || result.error.errors[0]?.message;
            },
          }}
          placeholder="Enter your new password"
          textInputProps={{
            className: "text-neutral-900 text-sm font-semibold",
          }}
        />

        <StandardInputField<ChangePasswordFormValues>
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          control={control}
          required
          placeholder="Confirm your new password"
          textInputProps={{
            className: "text-neutral-900 text-sm font-semibold",
          }}
        />

        {error ? (
          <Text className="text-sm font-medium text-[#D92D20]">{error}</Text>
        ) : null}
      </ScrollView>
    </ScreenShell>
  );
}
