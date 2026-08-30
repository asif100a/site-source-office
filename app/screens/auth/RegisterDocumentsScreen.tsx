import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import LogoWhite from "@/assets/icons/LogoWhite";
import { FileText, Trash2, Paperclip, Camera, Info } from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { normalizeUserRole, UserRole } from "@/constants/Routes";

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

export default function RegisterDocumentsScreen({
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
      onContinue();
    } else {
      router.push({
        pathname: "/auth",
        params: { step: "register_password", role: activeRole },
      });
    }
  };

  const handleSkip = () => {
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
      bounces={false}
    >
      {/* Orange Header Section */}
      <View className="bg-[#FF5500] pb-10 px-6">
        <View className="mb-4 justify-center items-center">
          <LogoWhite />
        </View>
        <Text className="text-white text-3xl font-bold tracking-tight">
          Upload Your Certifications
        </Text>
        <Text className="text-white/85 text-sm mt-1.5 font-medium leading-relaxed">
          Add certificates, cards, or accreditations relevant to the jobs you
          want.
        </Text>
      </View>

      {/* Upload Area & Document List */}
      <View className="flex-1 px-6 pt-6 pb-8 justify-between">
        <View className="gap-6">
          <View className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-4 flex-row gap-3 items-start">
            <View className="bg-[#1B2530] rounded-full p-1 items-center justify-center mt-0.5">
              <Info size={12} color="#FFFFFF" />
            </View>
            <Text className="flex-1 text-neutral-700 text-xs font-medium leading-relaxed">
              Upload any relevant construction accreditations or certifications
              to demonstrate your qualifications, compliance, and industry
              standards.
            </Text>
          </View>

          {/* Dashed Upload Box */}
          <View
            className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 items-center"
            style={{ borderStyle: "dashed" }}
          >
            <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-1">
              Upload or Capture
            </Text>
            <Text className="text-neutral-400 text-[10px] font-medium tracking-wide mb-6">
              JPG • PNG • PDF - MAX 10MB
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleUpload}
                activeOpacity={0.8}
                className="bg-[#1B2530] px-4 py-2.5 rounded-full flex-row items-center gap-1.5 shadow-sm"
              >
                <Paperclip size={14} color="#FFFFFF" />
                <Text className="text-white text-xs font-semibold">Upload</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCamera}
                activeOpacity={0.8}
                className="bg-[#1B2530] px-4 py-2.5 rounded-full flex-row items-center gap-1.5 shadow-sm"
              >
                <Camera size={14} color="#FFFFFF" />
                <Text className="text-white text-xs font-semibold">Camera</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Document List */}
          <View className="gap-3">
            {documents.map((doc) => (
              <View
                key={doc.id}
                className="border border-neutral-100 rounded-xl p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View className="bg-red-50 p-2.5 rounded-lg">
                    <FileText size={20} color="#EF4444" />
                  </View>
                  <View>
                    <Text className="text-neutral-800 text-sm font-semibold">
                      {doc.name}
                    </Text>
                    <Text className="text-neutral-400 text-xs mt-0.5 font-medium">
                      {doc.size}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleDelete(doc.id)}
                  className="p-1.5 rounded-full bg-neutral-50 hover:bg-neutral-100"
                  activeOpacity={0.7}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Info Alert Box */}
          <View className="bg-[#FFF5F2] border border-[#FFDCD0] rounded-xl p-4 flex-row gap-3 items-start">
            <View className="bg-[#FF5500] rounded-full p-1 items-center justify-center mt-0.5">
              <Info size={12} color="#FFFFFF" />
            </View>
            <Text className="flex-1 text-[#3C3C3C] text-xs font-medium leading-relaxed">
              Admin will review your documents within 4 hours. You will receive
              a push notification when approved.
            </Text>
          </View>
        </View>

        {/* Footer Actions */}
        <View className="mt-8 gap-4">
          <TouchableOpacity
            onPress={handleContinue}
            activeOpacity={0.9}
            className="w-full bg-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm"
          >
            <Text className="text-white text-base font-semibold">Continue</Text>
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity
            onPress={handleSkip}
            activeOpacity={0.9}
            className="w-full border border-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm mt-4"
          >
            <Text className="text-neutral-800 text-base font-semibold">
              Skip for now
            </Text>
          </TouchableOpacity>

          <Text className="text-neutral-400 text-xs text-center px-4 leading-relaxed font-medium">
            By continuing you agree to our{" "}
            <Text className="text-[#FF5500] underline font-semibold text-xs">
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text className="text-[#FF5500] underline font-semibold text-xs">
              Privacy policy
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
