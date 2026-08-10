import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useForm } from "react-hook-form";
import { ChevronDown } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import StandardInputField from "@/components/standard_ui/form_fields/StandardInputField";
import StandardFileUploadBox, {
  UploadedFile,
} from "@/components/standard_ui/form_fields/StandardFileUploadBox";
import {
  Avatar,
  FileChip,
  profilePhoto,
  ScreenShell,
} from "./_components";

type EditProfileFormValues = {
  fullName: string;
  email: string;
};

export default function EditProfileScreenWeb() {
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

  return (
    <ScreenShell
      title="Profile"
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
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
          <View className="mx-auto w-full max-w-7xl">
            <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
              <View className="flex-col gap-6 lg:flex-row lg:items-start">
                <View className="flex-[1.15] gap-6">
                  <View className="flex-row items-center justify-between gap-4">
                    <View className="flex-row items-center gap-3">
                      <Avatar uri={profilePhoto} size={52} />
                      <View>
                        <Text className="text-base font-extrabold text-neutral-950">
                          Wade Warren
                        </Text>
                        <Text className="text-sm text-neutral-500">
                          tan@gmail.com
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="rounded-2xl bg-neutral-50 p-4">
                    <Text className="text-sm font-semibold text-neutral-900">
                      Update your public profile
                    </Text>
                    <Text className="mt-1 text-sm leading-6 text-neutral-600">
                      Keep your name, contact details, skills, and documents
                      current so your worker profile stays accurate.
                    </Text>
                  </View>
                </View>

                <View className="hidden h-px w-full bg-neutral-200 lg:block lg:h-auto lg:w-px" />

                <View className="flex-[2]">
                  <View className="gap-5">
                    <StandardInputField<EditProfileFormValues>
                      label="Full Name"
                      id="fullName"
                      control={control}
                      placeholder="Enter Your Full Name"
                      textInputProps={{
                        className: "text-sm font-semibold text-neutral-900",
                      }}
                    />

                    <StandardInputField<EditProfileFormValues>
                      label="Email Address"
                      id="email"
                      type="email"
                      control={control}
                      placeholder="Enter Your Email"
                      textInputProps={{
                        className: "text-sm font-semibold text-neutral-900",
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

                    <View className="mb-1">
                      <Text className="mb-2 text-xs font-semibold text-neutral-500">
                        Trade / Skill
                      </Text>
                      <View className="flex-row h-14 items-center justify-between rounded-xl border border-neutral-200 bg-white px-4">
                        <Text className="text-sm font-semibold text-neutral-400">
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

                    <View className="gap-2">
                      <Text className="text-xs font-semibold text-neutral-500">
                        Uploaded files
                      </Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                          gap: 10,
                          paddingRight: 20,
                        }}
                      >
                        <FileChip />
                        <FileChip />
                        <FileChip />
                      </ScrollView>
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
