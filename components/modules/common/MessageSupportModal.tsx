import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Check, Info, X } from "lucide-react-native";
import { Colors } from "@/constants/Colors";

export default function MessageSupportModal({
  showSupportModal,
  setShowSupportModal,
  supportModalState,
  setSupportModalState,
  presentation = "sheet",
}: {
  showSupportModal: boolean;
  setShowSupportModal: React.Dispatch<React.SetStateAction<boolean>>;
  supportModalState: string;
  setSupportModalState: React.Dispatch<
    React.SetStateAction<"form" | "submitted">
  >;
  presentation?: "sheet" | "dialog";
}) {
  const [supportSubject, setSupportSubject] = useState("");
  const [supportDescription, setSupportDescription] = useState("");
  const isDialog = presentation === "dialog";

  return (
    <Modal
      animationType={isDialog ? "fade" : "slide"}
      transparent={true}
      visible={showSupportModal}
      onRequestClose={() => setShowSupportModal(false)}
    >
      <View
        className={isDialog ? "flex-1 items-center justify-center px-5" : "flex-1 justify-end"}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        {supportModalState === "form" ? (
          <View
            className={
              isDialog
                ? "w-full max-w-[540px] rounded-[28px] border border-neutral-200 bg-white p-6 shadow-2xl"
                : "bg-white rounded-t-4xl p-6 pb-12 shadow-2xl border-t border-neutral-100"
            }
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-neutral-900 font-extrabold text-lg tracking-tight">
                Message Support
              </Text>
              <TouchableOpacity
                onPress={() => setShowSupportModal(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center active:opacity-75"
              >
                <X size={16} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className={isDialog ? "max-h-[460px] mb-6" : "max-h-112.5 mb-6"}
              showsVerticalScrollIndicator={false}
            >
              <View className="gap-5 pr-1">
                <View className="border border-dashed border-neutral-300 rounded-3xl p-6 bg-neutral-50/50 items-center justify-center">
                  <Text className="text-neutral-400 text-[10px] font-extrabold tracking-wider uppercase mb-1">
                    Upload PDF or Photo
                  </Text>
                  <Text className="text-neutral-400 text-[9px] font-semibold mb-4">
                    JPG - PNG - PDF - MAX 10MB
                  </Text>
                  <TouchableOpacity className="bg-neutral-950 px-5 py-2.5 rounded-full active:opacity-85 shadow-sm">
                    <Text className="text-white text-xs font-extrabold">
                      Upload
                    </Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <Text className="text-neutral-400 text-xs font-bold uppercase mb-2 tracking-wider">
                    Subject
                  </Text>
                  <View className="bg-neutral-50 border border-neutral-200/60 rounded-2xl px-4 py-3">
                    <TextInput
                      className="text-neutral-800 text-sm font-semibold py-0"
                      placeholder="Enter your subject"
                      placeholderTextColor="#A3A3A3"
                      value={supportSubject}
                      onChangeText={setSupportSubject}
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-neutral-400 text-xs font-bold uppercase mb-2 tracking-wider">
                    Description
                  </Text>
                  <View className="bg-neutral-50 border border-neutral-200/60 rounded-2xl px-4 py-3">
                    <TextInput
                      className="text-neutral-800 text-sm font-semibold py-0"
                      placeholder="Describe the issue"
                      placeholderTextColor="#A3A3A3"
                      value={supportDescription}
                      onChangeText={setSupportDescription}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setSupportModalState("submitted")}
              style={{ backgroundColor: Colors.common.GRAY_DARK }}
              className="w-full py-4 rounded-2xl items-center justify-center active:opacity-90 mb-3"
            >
              <Text className="text-white font-extrabold text-sm">Submit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            className={
              isDialog
                ? "w-full max-w-[460px] rounded-[28px] border border-neutral-200 bg-white p-6 shadow-2xl items-center"
                : "bg-white rounded-t-4xl p-6 pb-12 shadow-2xl border-t border-neutral-100 items-center"
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
              Ticket ID: #SUP-2045
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
              onPress={() => setShowSupportModal(false)}
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
    </Modal>
  );
}
