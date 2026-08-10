import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import {
  Camera,
  ArrowRight,
  FileText,
  Info,
  Paperclip,
  Sparkles,
  Trash2,
} from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import LogoWhite from "@/assets/icons/LogoWhite";
import { normalizeUserRole, type UserRole } from "@/constants/Routes";
import AuthWebShell from "./_web-shell";
import { Colors } from "@/constants/Colors";

interface DocumentItem {
  id: string;
  name: string;
  size: string;
}

interface RegisterDocumentsScreenProps {
  role?: UserRole;
  onContinue?: (documents: DocumentItem[]) => void;
}

export default function RegisterDocumentsScreenWeb({
  role,
  onContinue,
}: RegisterDocumentsScreenProps) {
  const router = useRouter();
  const activeRole = normalizeUserRole(role);
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: "1", name: "CSCS Gold Card", size: "1.1 MB" },
    { id: "2", name: "IPAF Certificate", size: "1.1 MB" },
    { id: "3", name: "PASMA Certificate", size: "1.1 MB" },
  ]);

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

  const handleContinue = () => {
    if (onContinue) {
      onContinue(documents);
    } else {
      router.push({
        pathname: "/auth",
        params: { step: "register_password", role: activeRole },
      });
    }
  };

  return (
    <View className="flex-1 min-h-0">
      <View className="rounded-[28px] border border-neutral-200 bg-white p-5 md:p-6">
        <View className="mb-6 items-center rounded-[24px] bg-[#FF5500] px-6 py-8">
          <LogoWhite />
          <Text className="mt-6 text-center text-2xl font-black tracking-tight text-white">
            Upload your certifications
          </Text>
          <Text className="mt-2 max-w-md text-center text-sm leading-6 text-white/85">
            Add certificates, cards, or accreditations relevant to the jobs you
            want.
          </Text>
        </View>

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
                JPG • PNG • PDF - MAX 10MB
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
            activeOpacity={0.9}
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-[#1B2530] py-4"
          >
            <Text className="text-base font-semibold text-white">Continue</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
