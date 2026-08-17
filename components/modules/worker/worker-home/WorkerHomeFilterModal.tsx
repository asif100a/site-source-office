import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CalendarDays,
  ChevronDown,
  X,
} from "lucide-react-native";

import DateTimePicker from "react-native-ui-datepicker";
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@/components/ui/slider";
import { Colors } from "@/constants/Colors";
import {
  WORKER_HOME_TRADE_OPTIONS,
  type WorkerHomeDateRange,
} from "@/constants/workerHome";

type WorkerHomeFilterModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedTrade: string;
  onSelectedTradeChange: (trade: string) => void;
  maxDistanceMiles: number;
  onMaxDistanceMilesChange: (value: number) => void;
  minRatePerDay: number;
  onMinRatePerDayChange: (value: number) => void;
  dateRange: WorkerHomeDateRange;
  onDateRangeChange: (value: WorkerHomeDateRange) => void;
  resultCount: number;
  onReset: () => void;
};

type OpenPanel = "trade" | "dateRange" | null;

function formatDateLabel(value?: Date) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(value);
}

function formatDateRange(value: WorkerHomeDateRange) {
  if (!value.from && !value.to) {
    return "Select dates";
  }

  if (value.from && value.to) {
    return `${formatDateLabel(value.from)} - ${formatDateLabel(value.to)}`;
  }

  if (value.from) {
    return `From ${formatDateLabel(value.from)}`;
  }

  return `Until ${formatDateLabel(value.to)}`;
}

function FilterBody({
  isWeb,
  onClose,
  onReset,
  selectedTrade,
  onSelectedTradeChange,
  maxDistanceMiles,
  onMaxDistanceMilesChange,
  minRatePerDay,
  onMinRatePerDayChange,
  dateRange,
  onDateRangeChange,
  resultCount,
}: Omit<WorkerHomeFilterModalProps, "visible"> & { isWeb: boolean }) {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [isAdjustingRange, setIsAdjustingRange] = useState(false);

  return (
    <View
      className={`bg-white ${
        isWeb
          ? "w-full max-w-[760px] overflow-hidden rounded-[32px] border border-neutral-200/80 shadow-2xl"
          : "rounded-t-[28px] px-5 pb-6 pt-3"
      }`}
      style={isWeb ? ({ maxHeight: "88vh" } as any) : undefined}
    >
      {isWeb ? (
        <View className="flex-row items-start justify-between border-b border-neutral-200/80 px-6 py-5">
          <View>
            <Text className="text-2xl font-bold text-neutral-950">
              Filter jobs
            </Text>
            <Text className="mt-1 text-sm text-neutral-500">
              Narrow the list without leaving the page
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={onReset}
              className="rounded-full bg-neutral-100 px-3 py-2"
            >
              <Text className="text-sm font-bold text-neutral-700">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              className="rounded-full bg-neutral-100 px-3 py-2"
            >
              <X size={16} color="#404040" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-neutral-200" />
      )}

      <ScrollView
        scrollEnabled={!isAdjustingRange}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isWeb ? 0 : 8 }}
        style={isWeb ? ({ maxHeight: "calc(88vh - 180px)" } as any) : undefined}
      >
        <View className={isWeb ? "px-6 py-5" : ""}>
          {!isWeb ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-[22px] font-bold text-neutral-950">
                Filter jobs
              </Text>
              <TouchableOpacity onPress={onReset}>
                <Text
                  className="text-sm font-bold"
                  style={{ color: Colors.common.BRAND }}
                >
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="text-sm font-semibold uppercase tracking-[1px] text-neutral-400">
                Quick filters
              </Text>
              <Text className="text-sm font-semibold text-neutral-500">
                {resultCount} results
              </Text>
            </View>
          )}

          <View className="mt-5">
            <Text className="mb-3 text-xs font-bold uppercase tracking-[1px] text-neutral-400">
              Trade
            </Text>
            <TouchableOpacity
              onPress={() =>
                setOpenPanel((current) => (current === "trade" ? null : "trade"))
              }
              className="flex-row items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3.5"
            >
              <Text className="flex-1 text-sm font-medium text-[#222222]">
                {selectedTrade || "Select trade / skill"}
              </Text>
              <ChevronDown
                size={18}
                color="#999999"
                style={{
                  transform: [
                    { rotate: openPanel === "trade" ? "180deg" : "0deg" },
                  ],
                }}
              />
            </TouchableOpacity>

            {openPanel === "trade" ? (
              <View className="mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    onSelectedTradeChange("");
                    setOpenPanel(null);
                  }}
                  className={`min-h-[48px] justify-center px-4 ${
                    selectedTrade === "" ? "bg-[#FFF5F2]" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selectedTrade === ""
                        ? "font-bold text-[#FF5500]"
                        : "font-medium text-neutral-800"
                    }`}
                  >
                    All trades
                  </Text>
                </TouchableOpacity>
                {WORKER_HOME_TRADE_OPTIONS.map((trade) => {
                  const selected = selectedTrade === trade;

                  return (
                    <TouchableOpacity
                      key={trade}
                      activeOpacity={0.8}
                      onPress={() => {
                        onSelectedTradeChange(trade);
                        setOpenPanel(null);
                      }}
                      className={`min-h-[48px] justify-center px-4 ${
                        selected ? "bg-[#FFF5F2]" : "bg-white"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          selected
                            ? "font-bold text-[#FF5500]"
                            : "font-medium text-neutral-800"
                        }`}
                      >
                        {trade}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          <View className="mt-5">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-xs font-bold uppercase tracking-[1px] text-neutral-400">
                Distance
              </Text>
              <Text className="text-sm font-bold text-neutral-900">
                {maxDistanceMiles} mi
              </Text>
            </View>
            <View
              className="px-3 py-3"
              onTouchStart={() => setIsAdjustingRange(true)}
              onTouchEnd={() => setIsAdjustingRange(false)}
              onTouchCancel={() => setIsAdjustingRange(false)}
            >
              <Slider
                value={maxDistanceMiles}
                minValue={1}
                maxValue={5}
                step={1}
                onChange={onMaxDistanceMilesChange}
                onChangeEnd={() => setIsAdjustingRange(false)}
              >
                <SliderTrack className="h-1.5 rounded-full bg-neutral-700">
                  <SliderFilledTrack className="rounded-full bg-[#FF5A1F]" />
                </SliderTrack>
                <SliderThumb className="h-5 w-5 border-[#FF5A1F] bg-[#FF5A1F]" />
              </Slider>
            </View>
          </View>

          <View className="mt-6">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-xs font-bold uppercase tracking-[1px] text-neutral-400">
                Min rate
              </Text>
              <Text className="text-sm font-bold text-neutral-900">
                GBP {minRatePerDay}/day
              </Text>
            </View>
            <View
              className="px-3 py-3"
              onTouchStart={() => setIsAdjustingRange(true)}
              onTouchEnd={() => setIsAdjustingRange(false)}
              onTouchCancel={() => setIsAdjustingRange(false)}
            >
              <Slider
                value={minRatePerDay}
                minValue={120}
                maxValue={300}
                step={10}
                onChange={onMinRatePerDayChange}
                onChangeEnd={() => setIsAdjustingRange(false)}
              >
                <SliderTrack className="h-1.5 rounded-full bg-neutral-700">
                  <SliderFilledTrack className="rounded-full bg-[#FF5A1F]" />
                </SliderTrack>
                <SliderThumb className="h-5 w-5 border-[#FF5A1F] bg-[#FF5A1F]" />
              </Slider>
            </View>
          </View>

          <View className="mt-6">
            <Text className="mb-3 text-xs font-bold uppercase tracking-[1px] text-neutral-400">
              Date range
            </Text>
            <TouchableOpacity
              onPress={() =>
                setOpenPanel((current) =>
                  current === "dateRange" ? null : "dateRange",
                )
              }
              className="flex-row items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3.5"
            >
              <View className="flex-1">
                <Text className="text-sm font-semibold text-neutral-800">
                  {formatDateRange(dateRange)}
                </Text>
                <Text className="mt-0.5 text-[10px] font-medium text-neutral-400">
                  Use the calendar to pick a start and end date
                </Text>
              </View>
              <View className="ml-3 h-9 w-9 items-center justify-center rounded-full bg-neutral-100">
                <CalendarDays size={16} color="#404040" />
              </View>
            </TouchableOpacity>

            {openPanel === "dateRange" ? (
              <View className="mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
                <DateTimePicker
                  mode="range"
                  startDate={dateRange.from}
                  endDate={dateRange.to}
                  onChange={({ startDate, endDate }) =>
                    onDateRangeChange({
                      from: startDate ? new Date(startDate as any) : undefined,
                      to: endDate ? new Date(endDate as any) : undefined,
                    })
                  }
                  containerStyle={{ width: "100%" }}
                  style={{ width: "100%" }}
                  className="w-full rounded-2xl bg-neutral-50"
                  minDate={new Date()}
                  firstDayOfWeek={1}
                  showOutsideDays
                />

                <View className="mt-3 flex-row items-center justify-between">
                  <Text className="text-xs font-medium text-neutral-500">
                    Select one date or drag across multiple dates.
                  </Text>
                  <TouchableOpacity
                    onPress={() => onDateRangeChange({})}
                    className="rounded-full bg-neutral-100 px-3 py-2"
                  >
                    <Text className="text-xs font-bold text-neutral-700">
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <View className={isWeb ? "border-t border-neutral-200/80 px-6 py-5" : ""}>
        <TouchableOpacity
          onPress={onClose}
          className={`rounded-2xl bg-[#111111] py-4 ${
            isWeb ? "" : "mt-2 mb-10"
          }`}
        >
          <Text className="text-center text-sm font-bold text-white">
            Show {resultCount} {resultCount === 1 ? "job" : "jobs"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function WorkerHomeFilterModal({
  visible,
  onClose,
  selectedTrade,
  onSelectedTradeChange,
  maxDistanceMiles,
  onMaxDistanceMilesChange,
  minRatePerDay,
  onMinRatePerDayChange,
  dateRange,
  onDateRangeChange,
  resultCount,
  onReset,
}: WorkerHomeFilterModalProps) {
  if (!visible) {
    return null;
  }

  const isWeb = Platform.OS === "web";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        className={`flex-1 ${
          isWeb ? "items-center justify-center px-6 py-8" : "justify-end"
        }`}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      >
        <Pressable className="absolute inset-0" onPress={onClose} />

        <FilterBody
          isWeb={isWeb}
          onClose={onClose}
          onReset={onReset}
          selectedTrade={selectedTrade}
          onSelectedTradeChange={onSelectedTradeChange}
          maxDistanceMiles={maxDistanceMiles}
          onMaxDistanceMilesChange={onMaxDistanceMilesChange}
          minRatePerDay={minRatePerDay}
          onMinRatePerDayChange={onMinRatePerDayChange}
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          resultCount={resultCount}
        />
      </View>
    </Modal>
  );
}
