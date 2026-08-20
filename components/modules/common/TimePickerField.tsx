import React, { useState } from "react";
import { Clock3, X } from "lucide-react-native";
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker, {
  useDefaultStyles,
} from "react-native-ui-datepicker";
import { Colors } from "@/constants/Colors";

export function formatTimeValue(value: Date) {
  return value.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function createTimeValue(hours: number, minutes: number) {
  const value = new Date();
  value.setHours(hours, minutes, 0, 0);
  return value;
}

export default function TimePickerField({
  value,
  onChange,
  disabled = false,
}: {
  value: Date;
  onChange: (value: Date) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const timePickerStyles = useDefaultStyles();

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={disabled}
        onPress={() => setOpen(true)}
        className={`flex-row items-center gap-2 rounded-2xl border border-[#E9E9E9] bg-white px-3 py-2.5 ${
          disabled ? "opacity-50" : ""
        }`}
      >
        <Text className="text-[13px] font-bold text-[#202020]">
          {formatTimeValue(value)}
        </Text>
        <Clock3 size={15} color="#8A8A8A" />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          onPress={() => setOpen(false)}
          className="flex-1 items-center justify-center px-5"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="w-full max-w-[360px] rounded-[28px] bg-white p-5"
          >
            <View className="mb-4 flex-row items-center justify-between">
              <View>
                <Text className="text-[11px] font-bold uppercase tracking-[1.2px] text-neutral-500">
                  Time
                </Text>
                <Text className="mt-1 text-lg font-bold text-neutral-950">
                  Select a time
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpen(false)}
                className="h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
              >
                <X size={18} color="#202020" />
              </TouchableOpacity>
            </View>

            <DateTimePicker
              mode="single"
              date={value}
              timePicker
              initialView="time"
              hideHeader
              hideWeekdays
              onChange={({ date }) => {
                if (date) {
                  onChange(new Date(date as any));
                }
              }}
              containerStyle={{ width: "100%" }}
              style={{ width: "100%" }}
              className="w-full rounded-2xl bg-neutral-50"
              styles={{
                ...timePickerStyles,
                selected: {
                  backgroundColor: Colors.common.BRAND,
                  borderRadius: 12,
                },
                selected_label: {
                  color: "#FFFFFF",
                  fontWeight: "800",
                },
                today: {
                  borderColor: Colors.common.BRAND,
                  borderWidth: 1,
                },
                today_label: {
                  color: Colors.common.BRAND,
                  fontWeight: "800",
                },
              }}
            />

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setOpen(false)}
              className="mt-4 items-center justify-center rounded-[18px] py-3.5"
              style={{ backgroundColor: Colors.common.BRAND }}
            >
              <Text className="text-sm font-bold text-white">Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
