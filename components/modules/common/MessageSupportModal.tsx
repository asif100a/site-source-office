import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, FileText, Images, Info, Trash2, X } from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Image as ExpoImage } from "expo-image";
import { File as ExpoFile } from "expo-file-system";
import { Colors } from "@/constants/Colors";
import { useCreateSupportTicketMutation } from "@/store/api/supportApi";

type SupportAttachment = {
  uri: string;
  name: string;
  type: string;
  size?: number;
};

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

async function appendAttachment(formData: FormData, file: SupportAttachment) {
  if (Platform.OS === "web") {
    const response = await fetch(file.uri);
    const blob = await response.blob();
    formData.append("attachments", blob, file.name);
    return;
  }

  const expoFile = new ExpoFile(file.uri);
  formData.append("attachments", expoFile, file.name);
}

export default function MessageSupportModal({
  showSupportModal,
  setShowSupportModal,
  supportModalState,
  setSupportModalState,
  presentation = "sheet",
  onSubmitted,
}: {
  showSupportModal: boolean;
  setShowSupportModal: React.Dispatch<React.SetStateAction<boolean>>;
  supportModalState: string;
  setSupportModalState: React.Dispatch<
    React.SetStateAction<"form" | "submitted">
  >;
  presentation?: "sheet" | "dialog";
  onSubmitted?: () => void | Promise<void>;
}) {
  const [supportSubject, setSupportSubject] = useState("");
  const [supportDescription, setSupportDescription] = useState("");
  const [attachments, setAttachments] = useState<SupportAttachment[]>([]);
  const [submittedTicketId, setSubmittedTicketId] = useState("");
  const [formError, setFormError] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [subjectY, setSubjectY] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const subjectInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [createSupportTicket, { isLoading: isSubmitting }] =
    useCreateSupportTicketMutation();
  const isDialog = presentation === "dialog";

  const maxCardHeight =
    isKeyboardVisible && Platform.OS === "ios"
      ? Math.max(300, windowHeight - keyboardHeight - insets.top - 16)
      : isDialog
      ? windowHeight * 0.85
      : windowHeight * 0.88;

  useEffect(() => {
    if (!showSupportModal) {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
      return;
    }

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setIsKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [showSupportModal]);

  const handleClose = () => {
    if (isSubmitting) return;
    Keyboard.dismiss();
    setShowSupportModal(false);
  };

  const handleBackdropPress = () => {
    if (isSubmitting) return;
    if (isKeyboardVisible) {
      Keyboard.dismiss();
    } else {
      handleClose();
    }
  };

  const handlePickPhotos = async () => {
    Keyboard.dismiss();
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setFormError("Please allow access to your photo library in device settings.");
        if (Platform.OS !== "web") {
          Alert.alert(
            "Permission Required",
            "Please allow access to your photo library to select photos.",
            [{ text: "OK" }]
          );
        }
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.9,
      });

      if (result.canceled || !result.assets) return;

      const nextAttachments: SupportAttachment[] = result.assets
        .filter((asset) => {
          if (asset.fileSize && asset.fileSize > MAX_ATTACHMENT_SIZE) {
            setFormError("Please select attachments under 10MB.");
            return false;
          }

          return Boolean(asset.uri);
        })
        .map((asset) => {
          const uriParts = asset.uri.split("/");
          const fallbackName = uriParts[uriParts.length - 1] || `photo_${Date.now()}.jpg`;
          const name = asset.fileName || fallbackName;
          const extension = (name.split(".").pop() || "jpg").toLowerCase();
          const type = asset.mimeType || (extension === "png" ? "image/png" : "image/jpeg");

          return {
            uri: asset.uri,
            name,
            type,
            size: asset.fileSize ?? undefined,
          };
        });

      if (nextAttachments.length === 0) return;

      setFormError("");
      setAttachments((current) => {
        const existing = new Set(
          current.map((file) => `${file.name}-${file.size ?? 0}`)
        );
        return [
          ...current,
          ...nextAttachments.filter(
            (file) => !existing.has(`${file.name}-${file.size ?? 0}`)
          ),
        ];
      });
    } catch (error) {
      setFormError("Unable to select photos. Please try again.");
    }
  };

  const handlePickDocuments = async () => {
    Keyboard.dismiss();
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png", "*/*"],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (result.canceled || !result.assets) return;

      const nextAttachments: SupportAttachment[] = result.assets
        .filter((asset) => {
          if (asset.size && asset.size > MAX_ATTACHMENT_SIZE) {
            setFormError("Please select attachments under 10MB.");
            return false;
          }

          return Boolean(asset.uri && asset.name);
        })
        .map((asset) => ({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType ?? "application/octet-stream",
          size: asset.size ?? undefined,
        }));

      if (nextAttachments.length === 0) return;

      setFormError("");
      setAttachments((current) => {
        const existing = new Set(
          current.map((file) => `${file.name}-${file.size ?? 0}`)
        );
        return [
          ...current,
          ...nextAttachments.filter(
            (file) => !existing.has(`${file.name}-${file.size ?? 0}`)
          ),
        ];
      });
    } catch (error) {
      setFormError("Unable to select attachments. Please try again.");
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const subject = supportSubject.trim();
    const description = supportDescription.trim();

    if (!subject || !description) {
      setFormError("Please add a subject and description.");
      return;
    }

    try {
      setFormError("");
      const supportFormData = new FormData();
      supportFormData.append(
        "payload",
        JSON.stringify({
          subject,
          message: description,
        })
      );

      if (attachments.length === 0) {
        supportFormData.append("attachments", JSON.stringify([]));
      }

      for (const attachment of attachments) {
        await appendAttachment(supportFormData, attachment);
      }

      const response = await createSupportTicket(supportFormData).unwrap();
      const ticket =
        response?.data?.data ??
        response?.data ??
        response;
      // console.log("Support ticket submitted: ", ticket);

      setSubmittedTicketId(ticket?.id ?? ticket?._id ?? ticket?.ticketId ?? "");
      setSupportSubject("");
      setSupportDescription("");
      setAttachments([]);
      setSupportModalState("submitted");
      await onSubmitted?.();
    } catch (error) {
      setFormError("Unable to submit your ticket. Please try again.");
      if (Platform.OS !== "web") {
        Alert.alert(
          "Support ticket failed",
          "Unable to submit your ticket. Please try again."
        );
      }
    }
  };

  return (
    <Modal
      animationType={isDialog ? "fade" : "slide"}
      transparent={true}
      visible={showSupportModal}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: isDialog ? "center" : "flex-end",
            alignItems: isDialog ? "center" : undefined,
            paddingHorizontal: isDialog ? 20 : 0,
          }}
        >
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View style={StyleSheet.absoluteFillObject} />
          </TouchableWithoutFeedback>

          {supportModalState === "form" ? (
            <View
              style={{
                maxHeight: maxCardHeight,
                paddingBottom: isKeyboardVisible
                  ? 12
                  : isDialog
                  ? 24
                  : Math.max(24, insets.bottom + 8),
              }}
              className={
                isDialog
                  ? "w-full max-w-[540px] rounded-[28px] border border-neutral-200 bg-white p-6 shadow-2xl"
                  : "w-full bg-white rounded-t-4xl px-6 pt-6 shadow-2xl border-t border-neutral-100"
              }
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-neutral-900 font-extrabold text-lg tracking-tight">
                  Message Support
                </Text>
                <TouchableOpacity
                  onPress={handleClose}
                  disabled={isSubmitting}
                  className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center active:opacity-75"
                >
                  <X size={16} color="#333333" />
                </TouchableOpacity>
              </View>

              <ScrollView
                ref={scrollViewRef}
                style={{ flexShrink: 1 }}
                contentContainerStyle={{ flexGrow: 0, paddingBottom: 4 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
              >
                <View className="gap-5 pr-1">
                  <View className="border border-dashed border-neutral-300 rounded-3xl p-6 bg-neutral-50/50 items-center justify-center">
                    <Text className="text-neutral-400 text-[10px] font-extrabold tracking-wider uppercase mb-1">
                      Upload PDF or Photo
                    </Text>
                    <Text className="text-neutral-400 text-[9px] font-semibold mb-4">
                      JPG - PNG - PDF - MAX 10MB
                    </Text>
                    <View className="flex-row items-center gap-2.5">
                      <TouchableOpacity
                        onPress={handlePickPhotos}
                        disabled={isSubmitting}
                        className="bg-neutral-950 px-4 py-2.5 rounded-full active:opacity-85 shadow-sm disabled:opacity-60 flex-row items-center gap-1.5"
                      >
                        <Images size={14} color="#FFFFFF" />
                        <Text className="text-white text-xs font-extrabold">
                          Gallery / Photos
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handlePickDocuments}
                        disabled={isSubmitting}
                        className="bg-white border border-neutral-200 px-4 py-2.5 rounded-full active:opacity-85 shadow-sm disabled:opacity-60 flex-row items-center gap-1.5"
                      >
                        <FileText size={14} color="#171717" />
                        <Text className="text-neutral-900 text-xs font-extrabold">
                          Browse Files
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {attachments.length > 0 ? (
                    <View className="gap-2">
                      {attachments.map((attachment, index) => {
                        const isImage =
                          attachment.type.startsWith("image/") ||
                          /\.(jpg|jpeg|png|webp|gif|heic)$/i.test(attachment.name);

                        return (
                          <View
                            key={`${attachment.name}-${attachment.size ?? index}`}
                            className="flex-row items-center justify-between rounded-2xl border border-neutral-200 bg-white px-3.5 py-3"
                          >
                            <View className="flex-1 flex-row items-center pr-3">
                              {isImage ? (
                                <ExpoImage
                                  source={{ uri: attachment.uri }}
                                  style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    marginRight: 12,
                                  }}
                                  contentFit="cover"
                                />
                              ) : (
                                <View className="w-9 h-9 rounded-xl bg-red-50 items-center justify-center mr-3">
                                  <FileText size={18} color="#EF4444" />
                                </View>
                              )}
                              <View className="flex-1">
                                <Text
                                  className="text-xs font-bold text-neutral-800"
                                  numberOfLines={1}
                                >
                                  {attachment.name}
                                </Text>
                                {attachment.size ? (
                                  <Text className="mt-0.5 text-[10px] font-semibold text-neutral-400">
                                    {(attachment.size / (1024 * 1024)).toFixed(2)} MB
                                  </Text>
                                ) : null}
                              </View>
                            </View>
                            <TouchableOpacity
                              onPress={() => handleRemoveAttachment(index)}
                              disabled={isSubmitting}
                              className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100 disabled:opacity-60"
                            >
                              <Trash2 size={14} color="#525252" />
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                  ) : null}

                  <View
                    onLayout={(e) => {
                      setSubjectY(e.nativeEvent.layout.y);
                    }}
                  >
                    <Text className="text-neutral-400 text-xs font-bold uppercase mb-2 tracking-wider">
                      Subject
                    </Text>
                    <View className="bg-neutral-50 border border-neutral-200/60 rounded-2xl px-4 py-3">
                      <TextInput
                        ref={subjectInputRef}
                        className="text-neutral-800 text-sm font-semibold py-0"
                        placeholder="Enter your subject"
                        placeholderTextColor="#A3A3A3"
                        value={supportSubject}
                        onChangeText={setSupportSubject}
                        editable={!isSubmitting}
                        returnKeyType="next"
                        onSubmitEditing={() => descriptionInputRef.current?.focus()}
                        blurOnSubmit={false}
                        onFocus={() => {
                          setTimeout(() => {
                            scrollViewRef.current?.scrollTo({
                              y: Math.max(0, subjectY - 12),
                              animated: true,
                            });
                          }, 120);
                        }}
                      />
                    </View>
                  </View>

                  <View>
                    <Text className="text-neutral-400 text-xs font-bold uppercase mb-2 tracking-wider">
                      Description
                    </Text>
                    <View className="bg-neutral-50 border border-neutral-200/60 rounded-2xl px-4 py-3">
                      <TextInput
                        ref={descriptionInputRef}
                        className="text-neutral-800 text-sm font-semibold py-0"
                        placeholder="Describe the issue"
                        placeholderTextColor="#A3A3A3"
                        value={supportDescription}
                        onChangeText={setSupportDescription}
                        editable={!isSubmitting}
                        multiline
                        numberOfLines={4}
                        style={{
                          minHeight: 88,
                          textAlignVertical: "top",
                        }}
                        onFocus={() => {
                          setTimeout(() => {
                            scrollViewRef.current?.scrollToEnd({ animated: true });
                          }, 120);
                        }}
                      />
                    </View>
                  </View>

                  {formError ? (
                    <Text className="text-xs font-semibold text-red-600">
                      {formError}
                    </Text>
                  ) : null}
                </View>
              </ScrollView>

              <View className="pt-3">
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  style={{ backgroundColor: Colors.common.GRAY_DARK }}
                  className="w-full py-4 rounded-2xl items-center justify-center active:opacity-90 disabled:opacity-60"
                >
                  <Text className="text-white font-extrabold text-sm">
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                paddingBottom: isDialog
                  ? 24
                  : Math.max(24, insets.bottom + 8),
              }}
              className={
                isDialog
                  ? "w-full max-w-[460px] rounded-[28px] border border-neutral-200 bg-white p-6 shadow-2xl items-center"
                  : "w-full bg-white rounded-t-4xl px-6 pt-6 shadow-2xl border-t border-neutral-100 items-center"
              }
            >
              <View className="w-20 h-20 bg-green-50 rounded-full items-center justify-center mb-6 border border-green-100">
                <View className="w-14 h-14 bg-green-500 rounded-full items-center justify-center shadow-lg shadow-green-500/25">
                  <Check size={28} color="#FFFFFF" strokeWidth={3} />
                </View>
              </View>

              <Text className="text-neutral-950 font-extrabold text-xl tracking-tight mb-1.5">
                Submitted
              </Text>
              <Text className="text-neutral-400 text-xs font-semibold mb-6">
                Ticket ID: {submittedTicketId ? `#${submittedTicketId}` : "Created"}
              </Text>

              <View className="bg-orange-50/80 border border-orange-100/50 rounded-2xl p-4 flex-row items-center gap-3 w-full mb-8">
                <View className="w-7 h-7 bg-orange-500/10 rounded-full justify-center items-center">
                  <Info size={14} color="#F97316" />
                </View>
                <Text className="flex-1 text-orange-800 text-xs font-semibold leading-relaxed">
                  Our admin team will review your issue and respond shortly.
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleClose}
                style={{ backgroundColor: Colors.common.GRAY_DARK }}
                className="w-full py-4 rounded-2xl items-center justify-center active:opacity-90"
              >
                <Text className="text-white font-extrabold text-sm">
                  Go to dashboard
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
