import {
  View,
  TextInput,
  Platform,
  Pressable,
  TextStyle,
  ViewStyle,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import type { Dispatch, SetStateAction } from "react";

export default function StandardDateInput({
  label = "Text",
  date,
  onDateChange,
  placeholder = "dd/mm/yyyy",
  required = false,
  readonly = false,
  errorMessage = "",
  inputStyle = {},
  inputContainerStyle,
}: {
  label?: string;
  date: Date | null;
  onDateChange: Dispatch<SetStateAction<Date | null>>;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  errorMessage?: string;
  inputStyle?: TextStyle;
  inputContainerStyle?: ViewStyle;
}) {
  const [show, setShow] = useState<boolean>(false);

  const parsedDate =
    date instanceof Date
      ? date
      : typeof date === "string" && date
        ? new Date(date)
        : null;

  const validDate =
    parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null;

  const [tempDate, setTempDate] = useState<Date>(validDate || new Date());

  const formatDate = (rawDate: Date | null) => {
    if (!rawDate) return "";
    const day = String(rawDate.getDate()).padStart(2, "0");
    const month = String(rawDate.getMonth() + 1).padStart(2, "0");
    const year = rawDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const showPicker = () => {
    if (readonly) return;
    setTempDate(validDate || new Date());
    setShow(true);
  };

  const handleAndroidChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (event.type === "set" && selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const handleIosDone = () => {
    onDateChange(tempDate);
    setShow(false);
  };

  const handleIosCancel = () => {
    setShow(false);
  };

  return (
    <View className="mb-4" style={{ ...inputContainerStyle }}>
      {label && (
        <View className="flex-row">
          <Text
            className="text-base font-medium mb-1.5"
            style={{ color: readonly ? "#999" : "#333" }}
            accessibilityLabel={label}
          >
            {label}
          </Text>
          {required && <Text className="text-red-500"> *</Text>}
        </View>
      )}

      <Pressable
        onPress={showPicker}
        className="w-full h-[50px] border border-[#e8e8e8] rounded-xl px-4 flex-row items-center justify-between bg-white active:opacity-80"
        style={inputStyle as any}
      >
        <TextInput
          pointerEvents="none"
          className="flex-1 text-[#333333] text-sm p-0"
          placeholder={placeholder}
          value={formatDate(validDate)}
          editable={false}
          placeholderTextColor="#B7B7C0"
        />
        <Calendar size={18} color="#737373" />
      </Pressable>

      {errorMessage && (
        <Text className="text-red-500 text-xs mt-1">{errorMessage}</Text>
      )}

      {/* iOS Modal Picker */}
      {Platform.OS === "ios" ? (
        <Modal
          visible={show}
          transparent
          animationType="fade"
          onRequestClose={handleIosCancel}
        >
          <View className="flex-1 justify-end bg-black/45">
            <Pressable className="flex-1" onPress={handleIosCancel} />
            <View className="bg-white rounded-t-3xl pt-3 pb-8 px-5 border-t border-neutral-100 shadow-xl">
              <View className="flex-row items-center justify-between pb-3 border-b border-neutral-200/80">
                <TouchableOpacity
                  onPress={handleIosCancel}
                  activeOpacity={0.7}
                  className="py-1 px-2"
                >
                  <Text className="text-sm font-semibold text-neutral-500">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <Text className="text-base font-bold text-neutral-900">
                  {label || "Select Date"}
                </Text>

                <TouchableOpacity
                  onPress={handleIosDone}
                  activeOpacity={0.7}
                  className="py-1 px-2"
                >
                  <Text className="text-sm font-bold text-[#FF5500]">
                    Done
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="items-center justify-center pt-2">
                <DateTimePicker
                  testID="dateTimePicker"
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onChange={(_, selectedDate) => {
                    if (selectedDate) setTempDate(selectedDate);
                  }}
                  textColor="#111827"
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={validDate || new Date()}
            mode="date"
            display="default"
            onChange={handleAndroidChange}
          />
        )
      )}
    </View>
  );
}
