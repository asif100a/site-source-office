import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  Camera,
  FileText,
  Info,
  Paperclip,
  Sparkles,
  Trash2,
} from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { normalizeUserRole, type UserRole } from "@/constants/Routes";
import AuthWebShell from "./_web-shell";
import { Colors } from "@/constants/Colors";
import { useUpdateWorkerProfileMutation } from "@/store/api/workerProfileApi";
import type { RootState } from "@/store/store";
import Toast from "react-native-toast-message";
import { buildWorkerProfileCertificatesFormData } from "@/utils/workerProfileFormData";

interface DocumentItem {
  id: string;
  name: string;
  size: string;
}

interface RegisterDocumentsScreenProps {
  role?: UserRole;
  onContinue?: () => void;
  onBackPress?: () => void;
}

export default function RegisterDocumentsScreenWeb({
  role,
  onContinue,
  onBackPress,
}: RegisterDocumentsScreenProps) {
  const router = useRouter();
  const activeRole = normalizeUserRole(role);
  const authToken = useSelector((state: RootState) => state.auth.token);
  const [updateWorkerProfile, { isLoading: isUpdatingProfile }] =
    useUpdateWorkerProfileMutation();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const handleUpload = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const newDoc: DocumentItem = {
          id: Date.now().toString(),
          name: asset.name,
          size: asset.size
            ? `${(asset.size / (1024 * 1024)).toFixed(1)} MB`
            : "1.0 MB",
        };
        setDocuments((prev) => [...prev, newDoc]);
      }
    } catch (err) {
      console.log("Error picking document:", err);
    }
  };

  const handleCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera permission is required to capture photos.",
        );
        return;
      }

      const res = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const filename = asset.uri.split("/").pop() || "camera_photo.jpg";
        const newDoc: DocumentItem = {
          id: Date.now().toString(),
          name: filename,
          size: "1.2 MB",
        };
        setDocuments((prev) => [...prev, newDoc]);
      }
    } catch (err) {
      console.log("Error launching camera:", err);
    }
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    router.push({
      pathname: "/auth",
      params: { step: "register_general", role: activeRole },
    });
  };

  const redirectToLogin = () => {
    router.replace({
      pathname: "/auth",
      params: { step: "login", role: activeRole },
    });
  };

  const goToNextStep = () => {
    if (onContinue) {
      onContinue();
    } else {
      router.push({
        pathname: "/auth",
        params: { step: "register_password", role: activeRole },
      });
    }
  };

  const handleContinue = async () => {
    if (!documents.length) {
      goToNextStep();
      return;
    }

    if (!authToken) {
      Toast.show({
        type: "error",
        text1: "Login required",
        text2: "Please log in again before updating your certificates.",
      });
      redirectToLogin();
      return;
    }

    try {
      const formData = buildWorkerProfileCertificatesFormData({
        certificates: documents.map((document) => document.name),
      });

      await updateWorkerProfile(formData).unwrap();

      Toast.show({
        type: "success",
        text1: "Certificates updated",
        text2: "Your certificates have been saved.",
      });

      goToNextStep();
    } catch (error: any) {
      console.error("Update worker certificates failed:", error);

      if (error?.status === 401) {
        Toast.show({
          type: "error",
          text1: "Session expired",
          text2: "Please log in again before updating your certificates.",
        });
        redirectToLogin();
        return;
      }

      Toast.show({
        type: "error",
        text1: "Unable to update certificates",
        text2: error?.data?.message ?? "Please try again in a moment.",
      });
    }
  };

  const handleSkip = () => {
    if (onContinue) {
      onContinue();
    }
  }

  return (
    <AuthWebShell
      eyebrow="Documents"
      title="Upload your certifications"
      subtitle="Add certificates, cards, or accreditations relevant to the jobs you want."
      onBackPress={handleBack}
    >
      <View className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <View className="gap-4">
          <View className="flex-row items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <View className="mt-0.5 rounded-full bg-[#1B2530] p-1">
              <Info size={12} color="#FFFFFF" />
            </View>
            <Text className="flex-1 text-xs leading-5 text-neutral-700">
              Upload any relevant construction accreditations or
              certifications to demonstrate your qualifications, compliance,
              and industry standards.
            </Text>
          </View>

          <View
            className="items-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-6"
            style={{ borderStyle: "dashed" }}
          >
            <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Upload or capture
            </Text>
            <Text className="mb-6 text-[10px] font-medium tracking-wide text-neutral-400">
              JPG / PNG / PDF - MAX 10MB
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleUpload}
                activeOpacity={0.8}
                className="flex-row items-center gap-1.5 rounded-full bg-[#1B2530] px-4 py-2.5"
              >
                <Paperclip size={14} color="#FFFFFF" />
                <Text className="text-xs font-semibold text-white">
                  Upload
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCamera}
                activeOpacity={0.8}
                className="flex-row items-center gap-1.5 rounded-full bg-[#1B2530] px-4 py-2.5"
              >
                <Camera size={14} color="#FFFFFF" />
                <Text className="text-xs font-semibold text-white">
                  Camera
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="gap-4">
          <View className="rounded-2xl border border-neutral-200 bg-white p-4">
            <View className="flex-row items-center gap-2">
              <Sparkles size={16} color={Colors.common.BRAND} />
              <Text className="text-sm font-semibold text-neutral-900">
                Uploaded documents
              </Text>
            </View>
            <View className="mt-4 gap-3">
              {documents.map((doc) => (
                <View
                  key={doc.id}
                  className="flex-row items-center justify-between rounded-2xl border border-neutral-100 bg-white px-4 py-4"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="rounded-lg bg-red-50 p-2.5">
                      <FileText size={20} color="#EF4444" />
                    </View>
                    <View>
                      <Text className="text-sm font-semibold text-neutral-800">
                        {doc.name}
                      </Text>
                      <Text className="mt-0.5 text-xs font-medium text-neutral-400">
                        {doc.size}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDelete(doc.id)}
                    activeOpacity={0.7}
                    className="rounded-full bg-neutral-50 p-2"
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View className="rounded-2xl border border-[#FFDCD0] bg-[#FFF5F2] p-4">
            <View className="flex-row items-start gap-3">
              <View className="mt-0.5 rounded-full bg-[#FF5500] p-1">
                <Info size={12} color="#FFFFFF" />
              </View>
              <Text className="flex-1 text-xs leading-5 text-[#3C3C3C]">
                Admin will review your documents within 2-4 hours. You will
                receive a push notification when approved.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-6 gap-4">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={isUpdatingProfile}
          activeOpacity={0.9}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
        >
          <Text className="text-base font-semibold text-white">
            {isUpdatingProfile ? "Updating..." : "Continue"}
          </Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Skip Button */}
          <TouchableOpacity
            onPress={handleSkip}
            activeOpacity={0.9}
            className="w-full border border-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm mt-4"
          >
            <Text className="text-neutral-800 text-base font-semibold">Skip for now</Text>
          </TouchableOpacity>
      </View>
    </AuthWebShell>
  );
}
