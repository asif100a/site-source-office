import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useForm } from "react-hook-form";
import { ChevronDown } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import StandardFileUploadBox, {
  UploadedFile,
} from "@/components/standard_ui/form_fields/StandardFileUploadBox";
import { Avatar, FileChip, profilePhoto, ScreenShell } from "./_components";
import { useLocalSearchParams } from "expo-router";

type EditProfileFormValues = {
  fullName: string;
  email: string;
};

export default function EditProfileScreen() {
  const [profileImageFile, setProfileImageFile] = useState<UploadedFile | null>(
    null,
  );
  const [certificate, setCertificate] = useState<UploadedFile | null>(null);
  const { control } = useForm<EditProfileFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const { origin } = useLocalSearchParams();

  return (
    <ScreenShell
      title="Profile"
      footer={
        <View className="px-5 pb-16 pt-4 bg-neutral-50">
          <TouchableOpacity
            style={{ backgroundColor: "#1E2933" }}
            className="h-14 rounded-lg items-center justify-center"
          >
            <Text className="text-white font-extrabold text-sm">
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 24 }}
      >
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center gap-3">
            <Avatar uri={profilePhoto} size={44} />
            <View>
              <Text className="text-slate-900 text-base font-extrabold">
                Wade Warren
              </Text>
              <Text className="text-neutral-500 text-sm">tan@gmail.com</Text>
            </View>
          </View>
        </View>

        <StandardInputField<EditProfileFormValues>
          label="Full Name"
          id="fullName"
          control={control}
          placeholder="Enter Your Full Name"
          textInputProps={{
            className: "text-neutral-900 text-sm font-semibold",
          }}
        />

        <StandardInputField<EditProfileFormValues>
          label="Email Address"
          id="email"
          type="email"
          control={control}
          placeholder="Enter Your Email"
          textInputProps={{
            className: "text-neutral-900 text-sm font-semibold",
          }}
        />

        <StandardFileUploadBox
          label="Profile Image"
          file={profileImageFile}
          setFile={setProfileImageFile}
          mode="image"
          title="Upload Profile Image"
          description="JPG or PNG (max 10MB)"
          optional
        />

        {origin === "worker" && (
          <>
            <View className="mb-5">
              <Text className="text-neutral-500 text-xs font-semibold mb-2">
                Trade / Skill
              </Text>
              <View className="h-14 rounded-xl bg-white border border-neutral-200 px-4 flex-row items-center justify-between">
                <Text className="text-neutral-400 text-sm font-semibold">
                  Groundworker
                </Text>
                <ChevronDown size={17} color="#171717" />
              </View>
            </View>

            <StandardFileUploadBox
              label="Upload Certificate"
              file={certificate}
              setFile={setCertificate}
              mode="both"
              title="Upload Certificate"
              description="PDF, PNG, JPG or other files (max 10MB)"
              optional
            />
          </>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingRight: 20 }}
        >
          <FileChip />
          <FileChip />
          <FileChip />
        </ScrollView>
      </ScrollView>
    </ScreenShell>
  );
}
