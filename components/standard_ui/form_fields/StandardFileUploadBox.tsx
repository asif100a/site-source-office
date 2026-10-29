import { View, TouchableOpacity, Alert, Text } from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";

// ─── Types ────────────────────────────────────────────────────────────────────
export type UploadedFile = {
  uri: string;
  name: string;
  type: string;
  size?: number;
};

export type FileUploadMode = "image" | "pdf" | "both";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isImage = (type: string) => type.startsWith("image/");

// ─── Component ────────────────────────────────────────────────────────────────
export default function StandardFileUploadBox({
  file,
  setFile,
  label,
  mode = "image",
  title,
  description,
  maxFileSize = 10,
  readonly = false,
  errorMessage = "",
  optional = false,
  asterisk = false,
  onCustomUpload,
}: {
  file: UploadedFile | null;
  setFile: (file: UploadedFile | null) => void;
  label?: string;
  mode?: FileUploadMode;
  title?: string;
  description?: string;
  maxFileSize?: number;
  readonly?: boolean;
  errorMessage?: string;
  optional?: boolean;
  asterisk?: boolean;
  onCustomUpload?: () => void;
}) {
  const MAX_FILE_SIZE_BYTES = maxFileSize * 1024 * 1024;

  // ── Derived defaults based on mode ──────────────────────────────────────────
  const defaultTitle =
    mode === "pdf"
      ? "Upload PDF"
      : mode === "both"
        ? "Upload Image or PDF"
        : "Upload Image";

  const defaultDescription =
    mode === "pdf"
      ? `PDF (max ${maxFileSize}MB)`
      : mode === "both"
        ? `PNG, JPG or PDF (max ${maxFileSize}MB)`
        : `PNG or JPG (max ${maxFileSize}MB)`;

  const resolvedTitle = title ?? defaultTitle;
  const resolvedDescription = description ?? defaultDescription;

  // ── Camera picker ────────────────────────────────────────────────────────────
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow camera access in device settings to take a photo.",
          [{ text: "OK" }],
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (result.canceled || !result.assets || !result.assets[0]) return;

      const asset = result.assets[0];

      if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE_BYTES) {
        Alert.alert(
          "File Too Large",
          `Please select a file under ${maxFileSize}MB.`,
          [{ text: "OK" }],
        );
        return;
      }

      const uriParts = asset.uri.split(".");
      const extension = uriParts[uriParts.length - 1].toLowerCase();
      const mimeType = extension === "png" ? "image/png" : "image/jpeg";
      const fileName = asset.fileName ?? `photo_${Date.now()}.${extension}`;

      setFile({
        uri: asset.uri,
        name: fileName,
        type: mimeType,
        size: asset.fileSize,
      });
    } catch (error) {
      Alert.alert("Camera Error", "Unable to open camera. Please try again.");
    }
  };

  // ── Image picker ─────────────────────────────────────────────────────────────
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library in device settings.",
        [{ text: "OK" }],
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
      allowsMultipleSelection: false,
    });

    if (result.canceled || !result.assets || !result.assets[0]) return;

    const asset = result.assets[0];

    if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE_BYTES) {
      Alert.alert(
        "File Too Large",
        `Please select a file under ${maxFileSize}MB.`,
        [{ text: "OK" }],
      );
      return;
    }

    const uriParts = asset.uri.split(".");
    const extension = uriParts[uriParts.length - 1].toLowerCase();
    const mimeType = extension === "png" ? "image/png" : "image/jpeg";
    const fileName = asset.fileName ?? `upload_${Date.now()}.${extension}`;

    setFile({
      uri: asset.uri,
      name: fileName,
      type: mimeType,
      size: asset.fileSize,
    });
  };

  // ── PDF / Document picker ────────────────────────────────────────────────────
  const handlePickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || !result.assets[0]) return;

    const asset = result.assets[0];

    if (asset.size && asset.size > MAX_FILE_SIZE_BYTES) {
      Alert.alert(
        "File Too Large",
        `Please select a file under ${maxFileSize}MB.`,
        [{ text: "OK" }],
      );
      return;
    }

    setFile({
      uri: asset.uri,
      name: asset.name,
      type: "application/pdf",
      size: asset.size ?? undefined,
    });
  };

  // ── Upload handler — branches by mode ────────────────────────────────────────
  const handleUpload = async () => {
    if (onCustomUpload) {
      onCustomUpload();
      return;
    }

    if (mode === "image") {
      Alert.alert("Profile Photo", "Choose an option", [
        { text: "Take Photo Now", onPress: handleTakePhoto },
        { text: "Choose from Camera Roll", onPress: handlePickImage },
        { text: "Cancel", style: "cancel" },
      ]);
    } else if (mode === "pdf") {
      await handlePickPdf();
    } else {
      // "both" — let user choose via action sheet
      Alert.alert("Upload File", "Choose a source", [
        { text: "Take Photo Now", onPress: handleTakePhoto },
        { text: "Photo Library", onPress: handlePickImage },
        { text: "PDF Document", onPress: handlePickPdf },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handleRemoveFile = () => {
    if (readonly) return;
    setFile(null);
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <View className={`mb-4`}>
      {label && (
        <Text className={`text-sm mb-2`} style={{ color: Colors.common.BLACK }}>
          {label} {optional && `(Optional)`}
          {asterisk && <Text style={{color: '#ef4444'}}>*</Text>}
        </Text>
      )}

      {file ? (
        // ── Preview state ──────────────────────────────────────────────────────
        <View
          className={`border-2 border-[${Colors.common.BORDER}] rounded-lg overflow-hidden bg-white`}
        >
          {isImage(file.type) ? (
            // ── Image thumbnail with ✕ overlay ─────────────────────────────
            <View className={`relative`}>
              <Image
                source={{ uri: file.uri }}
                style={{
                  height: 192,
                  width: "100%",
                }}
                contentFit="cover"
              />
              <TouchableOpacity
                onPress={handleRemoveFile}
                className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 items-center justify-center`}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text className={`text-red-500 text-sm leading-none`}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // ── PDF icon card — no thumbnail available for PDFs ────────────
            <View
              className={`relative h-28 items-center justify-center bg-red-500/10`}
            >
              <Ionicons
                name="document-text-outline"
                size={40}
                color="#ef4444"
              />
              <Text className={`text-red-400 text-xs mt-1 font-medium`}>
                PDF
              </Text>
              <TouchableOpacity
                onPress={handleRemoveFile}
                className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 items-center justify-center`}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text className={`text-red-500 text-sm leading-none`}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* File info + replace button */}
          <View className={`flex-row items-center justify-className px-4 py-3`}>
            <View className={`flex-1 mr-3`}>
              <Text
                className={`text-xs font-medium`}
                style={{ color: "black" }}
                numberOfLines={1}
              >
                {file.name}
              </Text>
              {file.size && (
                <Text
                  className={`text-xs mt-0.5`}
                  style={{ color: "rgb(0 0 0 / 0.5)" }}
                >
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </Text>
              )}
            </View>
            <TouchableOpacity
              activeOpacity={0.4}
              onPress={() => (readonly ? {} : handleUpload())}
              className={`px-3 py-1.5 rounded-md border border-black/30`}
            >
              <Text
                className={`text-xs`}
                style={{ color: Colors.common.BLACK }}
              >
                Replace
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // ── Empty / Upload state ───────────────────────────────────────────
        <>
          <TouchableOpacity
            onPress={() => (readonly ? {} : handleUpload())}
            className={`rounded-lg py-8 items-center bg-white`}
            activeOpacity={0.7}
            style={{
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: Colors.common.BORDER,
            }}
          >
            <Text className={`text-3xl mb-2.5`}>
              {mode === "pdf" ? "📄" : mode === "both" ? "📎" : "📤"}
            </Text>
            <Text
              className={`text-black text-lg font-medium mb-1.5`}
              style={{ color: Colors.common.BLACK }}
            >
              {resolvedTitle}
            </Text>
            <Text
              className={`text-black/80 text-xs text-center`}
              style={{ color: "rgb(0 0 0 / 0.8)" }}
            >
              {resolvedDescription}
            </Text>
          </TouchableOpacity>
          {errorMessage && (
            <Text className={`text-red-500 text-xs mt-1`}>{errorMessage}</Text>
          )}
        </>
      )}
    </View>
  );
}
