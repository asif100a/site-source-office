import React, { useRef, useState } from "react";
import { Clock3 } from "lucide-react-native";
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NativeDateTimePicker from "@react-native-community/datetimepicker";

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
  const webInputRef = useRef<HTMLInputElement | null>(null);
  const timeValue = formatTimeValue(value);

  const handleWebChange = (event: React.FormEvent<HTMLInputElement>) => {
    const nextTime = event.currentTarget.value;

    if (!nextTime) {
      return;
    }

    const [hours, minutes] = nextTime.split(":").map(Number);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return;
    }

    const nextValue = new Date(value);

    nextValue.setHours(hours, minutes, 0, 0);
    onChange(nextValue);
  };

  const openWebTimePicker = () => {
    if (disabled) {
      return;
    }

    const input = webInputRef.current;

    input?.focus();

    try {
      input?.showPicker?.();
    } catch {
      // Some browsers only allow showPicker from direct DOM click/pointer events.
    }
  };

  if (Platform.OS === "web") {
    return (
      <View
        className={`flex-row items-center gap-2 rounded-2xl border border-[#E9E9E9] bg-white px-3 py-2.5 ${
          disabled ? "opacity-50" : ""
        }`}
      >
        <input
          ref={webInputRef}
          type="time"
          value={timeValue}
          onChange={handleWebChange}
          onInput={handleWebChange}
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => {
            event.stopPropagation();
            openWebTimePicker();
          }}
          disabled={disabled}
          aria-label="Select time"
          step={300}
          style={{
            border: "none",
            background: "transparent",
            color: "#202020",
            cursor: disabled ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 700,
            minWidth: 82,
            outline: "none",
            pointerEvents: disabled ? "none" : "auto",
          }}
        />
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            openWebTimePicker();
          }}
          disabled={disabled}
          aria-label="Open time picker"
          style={{
            alignItems: "center",
            background: "transparent",
            border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            display: "flex",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <Clock3 size={15} color="#8A8A8A" />
        </button>
      </View>
    );
  }

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
          {timeValue}
        </Text>
        <Clock3 size={15} color="#8A8A8A" />
      </TouchableOpacity>

      {open ? (
        <NativeDateTimePicker
          value={value}
          mode="time"
          display={Platform.OS === "android" ? "clock" : "spinner"}
          is24Hour
          onChange={(event, selectedTime) => {
            if (Platform.OS === "android") {
              setOpen(false);
            }
            if (selectedTime) {
              onChange(selectedTime);
            }
          }}
        />
      ) : null}
    </>
  );
}
