import React from "react";
import { CalendarDays } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import DateTimePicker, {
  useDefaultStyles,
} from "react-native-ui-datepicker";
import { Colors } from "@/constants/Colors";

export type DateRangeValue = {
  from?: Date;
  to?: Date;
};

export function formatDateLabel(value?: Date) {
  if (!value) {
    return "--";
  }

  return value.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function formatDateRange(
  value: DateRangeValue,
  emptyLabel = "Select dates",
) {
  if (!value.from && !value.to) {
    return emptyLabel;
  }

  if (value.from && value.to) {
    return `${formatDateLabel(value.from)} - ${formatDateLabel(value.to)}`;
  }

  if (value.from) {
    return `From ${formatDateLabel(value.from)}`;
  }

  return `Until ${formatDateLabel(value.to)}`;
}

export default function DateRangeCalendar({
  value,
  onChange,
  onClear,
  minDate = new Date(),
  summaryEmptyLabel = "Select dates",
  helperText,
  containerHeight = 300,
}: {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  onClear: () => void;
  minDate?: Date;
  summaryEmptyLabel?: string;
  helperText?: string;
  containerHeight?: number;
}) {
  const calendarStyles = useDefaultStyles();

  return (
    <View className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3">
      <View className="mb-3 flex-row items-center justify-between gap-3">
        <View className="flex-1 flex-row items-center gap-2">
          <CalendarDays size={15} color="#737373" />
          <Text className="flex-1 text-xs font-semibold text-neutral-600">
            {formatDateRange(value, summaryEmptyLabel)}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={onClear}>
          <Text className="text-xs font-bold text-[#FF5500]">Clear</Text>
        </TouchableOpacity>
      </View>

      <DateTimePicker
        mode="range"
        startDate={value.from}
        endDate={value.to}
        onChange={({ startDate, endDate }) =>
          onChange({
            from: startDate ? new Date(startDate as any) : undefined,
            to: endDate ? new Date(endDate as any) : undefined,
          })
        }
        containerStyle={{ width: "100%" }}
        style={{ width: "100%" }}
        className="w-full rounded-2xl bg-neutral-50"
        minDate={minDate}
        firstDayOfWeek={1}
        showOutsideDays
        calendar="gregory"
        containerHeight={containerHeight}
        navigationPosition="around"
        styles={{
          ...calendarStyles,
          header: {
            marginBottom: 12,
          },
          month_selector_label: {
            color: "#111827",
            fontSize: 15,
            fontWeight: "800",
          },
          year_selector_label: {
            color: "#111827",
            fontSize: 15,
            fontWeight: "800",
          },
          button_prev: {
            width: 34,
            height: 34,
            borderRadius: 17,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.common.BRAND_LIGHT,
          },
          button_next: {
            width: 34,
            height: 34,
            borderRadius: 17,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.common.BRAND_LIGHT,
          },
          button_prev_image: {
            tintColor: Colors.common.BRAND,
            width: 15,
            height: 15,
          },
          button_next_image: {
            tintColor: Colors.common.BRAND,
            width: 15,
            height: 15,
          },
          day_cell: {
            minHeight: 44,
          },
          day_label: {
            color: "#262626",
            fontWeight: "600",
          },
          outside_label: {
            color: "#A3A3A3",
          },
          disabled_label: {
            color: "#D4D4D4",
          },
          weekday_label: {
            color: "#8A8A8A",
            fontSize: 11,
            fontWeight: "700",
          },
          selected: {
            backgroundColor: Colors.common.BRAND,
            borderRadius: 12,
          },
          selected_label: {
            color: "#FFFFFF",
            fontWeight: "800",
          },
          range_start: {
            backgroundColor: Colors.common.BRAND,
            borderRadius: 12,
          },
          range_start_label: {
            color: "#FFFFFF",
            fontWeight: "800",
          },
          range_end: {
            backgroundColor: Colors.common.BRAND,
            borderRadius: 12,
          },
          range_end_label: {
            color: "#FFFFFF",
            fontWeight: "800",
          },
          range_middle: {
            backgroundColor: "transparent",
            borderRadius: 0,
          },
          range_middle_label: {
            color: Colors.common.BRAND,
            fontWeight: "700",
          },
          range_fill: {
            backgroundColor: "#FFE4D6",
          },
          range_fill_weekstart: {
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          },
          range_fill_weekend: {
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
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

      {helperText ? (
        <Text className="mt-3 text-xs font-medium text-neutral-500">
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}
