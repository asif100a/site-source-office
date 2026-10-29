import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Calendar,
  CalendarDays,
  ChevronDown,
  X,
} from "lucide-react-native";

import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@/components/ui/slider";
import { Colors } from "@/constants/Colors";
import {
  WORKER_HOME_TRADE_OPTIONS,
} from "@/constants/workerHome";
import DateRangeCalendar, {
  DateRangeValue,
  formatDateRange,
} from "@/components/modules/common/DateRangeCalendar";

export type WorkerHomeFilterModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedTrade: string;
  onSelectedTradeChange: (trade: string) => void;
  maxDistanceMiles: number;
  onMaxDistanceMilesChange: (value: number) => void;
  minRatePerDay: number;
  onMinRatePerDayChange: (value: number) => void;
  resultCount: number;
  onReset: () => void;
  startDateRange?: DateRangeValue;
  onStartDateRangeChange?: (range: DateRangeValue) => void;
  endDateRange?: DateRangeValue;
  onEndDateRangeChange?: (range: DateRangeValue) => void;
  minPrice?: number | null;
  onMinPriceChange?: (price: number | null) => void;
  maxPrice?: number | null;
  onMaxPriceChange?: (price: number | null) => void;
};

type OpenPanel = "trade" | "startDate" | "endDate" | null;

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
  resultCount,
  startDateRange,
  onStartDateRangeChange,
  endDateRange,
  onEndDateRangeChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
}: Omit<WorkerHomeFilterModalProps, "visible"> & { isWeb: boolean }) {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [isAdjustingRange, setIsAdjustingRange] = useState(false);

  return (
    <View
      className={`bg-white ${
        isWeb
          ? "w-full max-w-[760px] overflow-hidden rounded-[32px] border border-neutral-200/80 shadow-2xl"
          : "rounded-t-[28px] px-5 pb-6 pt-3 max-h-[90%]"
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
            <View className="px-3 py-1">
              <Slider
                value={maxDistanceMiles}
                minValue={1}
                maxValue={50}
                step={1}
                onChange={onMaxDistanceMilesChange}
                onChangeStart={() => setIsAdjustingRange(true)}
                onChangeEnd={() => setIsAdjustingRange(false)}
              >
                <SliderTrack className="h-1.5 rounded-full bg-neutral-700">
                  <SliderFilledTrack className="rounded-full bg-[#FF5A1F]" />
                </SliderTrack>
                <SliderThumb className="h-5 w-5 border-[#FF5A1F] bg-[#FF5A1F]" />
              </Slider>
            </View>
          </View>

          {/* Job Dates filter section */}
          {onStartDateRangeChange || onEndDateRangeChange ? (
            <View className="mt-6">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-xs font-bold uppercase tracking-[1px] text-neutral-400">
                  Job Dates
                </Text>
                {startDateRange?.from || endDateRange?.from ? (
                  <TouchableOpacity
                    onPress={() => {
                      onStartDateRangeChange?.({});
                      onEndDateRangeChange?.({});
                    }}
                  >
                    <Text className="text-xs font-bold text-[#FF5500]">
                      Clear all dates
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              <Text className="text-[11px] font-medium text-neutral-500 mb-3">
                The jobs that come up start / finish within these timeframes.
              </Text>

              {/* Start Date Timeframe Card */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  setOpenPanel((current) =>
                    current === "startDate" ? null : "startDate",
                  )
                }
                className={`rounded-2xl border p-3.5 flex-row items-center justify-between ${
                  openPanel === "startDate"
                    ? "border-[#FF5500] bg-orange-50/20"
                    : startDateRange?.from
                    ? "border-orange-200 bg-orange-50/10"
                    : "border-neutral-200 bg-white"
                }`}
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View
                    className={`w-9 h-9 rounded-xl items-center justify-center ${
                      startDateRange?.from ? "bg-[#FF5500]" : "bg-neutral-100"
                    }`}
                  >
                    <Calendar
                      size={18}
                      color={startDateRange?.from ? "#FFFFFF" : "#737373"}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Starts between
                    </Text>
                    <Text
                      className={`text-sm font-semibold mt-0.5 ${
                        startDateRange?.from
                          ? "text-[#FF5500]"
                          : "text-neutral-800"
                      }`}
                    >
                      {formatDateRange(startDateRange ?? {}, "Any start date")}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  {startDateRange?.from ? (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        onStartDateRangeChange?.({});
                      }}
                      className="px-2 py-1 rounded-lg bg-neutral-100 active:opacity-75"
                    >
                      <Text className="text-xs font-bold text-neutral-600">
                        Clear
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                  <ChevronDown
                    size={18}
                    color="#999999"
                    style={{
                      transform: [
                        {
                          rotate:
                            openPanel === "startDate" ? "180deg" : "0deg",
                        },
                      ],
                    }}
                  />
                </View>
              </TouchableOpacity>

              {openPanel === "startDate" && onStartDateRangeChange ? (
                <View className="mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2">
                  <DateRangeCalendar
                    value={startDateRange ?? {}}
                    onChange={(val) => onStartDateRangeChange(val)}
                    onClear={() => onStartDateRangeChange({})}
                    summaryEmptyLabel="Select start date window"
                    helperText="Jobs starting within this timeframe will be shown."
                    minDate={new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)}
                  />
                </View>
              ) : null}

              {/* Finish Date Timeframe Card */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  setOpenPanel((current) =>
                    current === "endDate" ? null : "endDate",
                  )
                }
                className={`mt-2.5 rounded-2xl border p-3.5 flex-row items-center justify-between ${
                  openPanel === "endDate"
                    ? "border-[#FF5500] bg-orange-50/20"
                    : endDateRange?.from
                    ? "border-orange-200 bg-orange-50/10"
                    : "border-neutral-200 bg-white"
                }`}
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View
                    className={`w-9 h-9 rounded-xl items-center justify-center ${
                      endDateRange?.from ? "bg-[#FF5500]" : "bg-neutral-100"
                    }`}
                  >
                    <CalendarDays
                      size={18}
                      color={endDateRange?.from ? "#FFFFFF" : "#737373"}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Finishes between
                    </Text>
                    <Text
                      className={`text-sm font-semibold mt-0.5 ${
                        endDateRange?.from
                          ? "text-[#FF5500]"
                          : "text-neutral-800"
                      }`}
                    >
                      {formatDateRange(endDateRange ?? {}, "Any finish date")}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  {endDateRange?.from ? (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        onEndDateRangeChange?.({});
                      }}
                      className="px-2 py-1 rounded-lg bg-neutral-100 active:opacity-75"
                    >
                      <Text className="text-xs font-bold text-neutral-600">
                        Clear
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                  <ChevronDown
                    size={18}
                    color="#999999"
                    style={{
                      transform: [
                        { rotate: openPanel === "endDate" ? "180deg" : "0deg" },
                      ],
                    }}
                  />
                </View>
              </TouchableOpacity>

              {openPanel === "endDate" && onEndDateRangeChange ? (
                <View className="mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2">
                  <DateRangeCalendar
                    value={endDateRange ?? {}}
                    onChange={(val) => onEndDateRangeChange(val)}
                    onClear={() => onEndDateRangeChange({})}
                    summaryEmptyLabel="Select finish date window"
                    helperText="Jobs finishing within this timeframe will be shown."
                    minDate={new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)}
                  />
                </View>
              ) : null}
            </View>
          ) : null}

          {/* Rate / Price (£) filter section */}
          {onMinPriceChange || onMaxPriceChange ? (
            <View className="mt-6">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-xs font-bold uppercase tracking-[1px] text-neutral-400">
                  Rate / Price (£)
                </Text>
                {minPrice != null || maxPrice != null ? (
                  <TouchableOpacity
                    onPress={() => {
                      onMinPriceChange?.(null);
                      onMaxPriceChange?.(null);
                    }}
                  >
                    <Text className="text-xs font-bold text-[#FF5500]">
                      Clear
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <Text className="text-sm font-bold text-neutral-900 mb-3">
                {minPrice != null && maxPrice != null
                  ? `£${minPrice} - £${maxPrice}/hr`
                  : minPrice != null
                  ? `From £${minPrice}/hr`
                  : maxPrice != null
                  ? `Up to £${maxPrice}/hr`
                  : "Any rate"}
              </Text>

              <View className="flex-row items-center gap-3">
                <View className="flex-1">
                  <Text className="text-[11px] font-semibold text-neutral-500 mb-1">
                    Min (£/hr)
                  </Text>
                  <View className="flex-row items-center rounded-xl border border-neutral-200 bg-white px-3 py-2.5">
                    <Text className="text-neutral-500 font-bold text-sm mr-1">
                      £
                    </Text>
                    <TextInput
                      className="flex-1 text-sm font-semibold text-neutral-900 py-0"
                      placeholder="Min"
                      placeholderTextColor="#A3A3A3"
                      keyboardType="numeric"
                      value={minPrice != null ? String(minPrice) : ""}
                      onChangeText={(text) => {
                        const val = text.replace(/[^0-9]/g, "");
                        onMinPriceChange?.(val ? Number(val) : null);
                      }}
                    />
                  </View>
                </View>

                <Text className="text-neutral-300 font-bold mt-5">—</Text>

                <View className="flex-1">
                  <Text className="text-[11px] font-semibold text-neutral-500 mb-1">
                    Max (£/hr)
                  </Text>
                  <View className="flex-row items-center rounded-xl border border-neutral-200 bg-white px-3 py-2.5">
                    <Text className="text-neutral-500 font-bold text-sm mr-1">
                      £
                    </Text>
                    <TextInput
                      className="flex-1 text-sm font-semibold text-neutral-900 py-0"
                      placeholder="Max"
                      placeholderTextColor="#A3A3A3"
                      keyboardType="numeric"
                      value={maxPrice != null ? String(maxPrice) : ""}
                      onChangeText={(text) => {
                        const val = text.replace(/[^0-9]/g, "");
                        onMaxPriceChange?.(val ? Number(val) : null);
                      }}
                    />
                  </View>
                </View>
              </View>

              <View className="mt-3 flex-row flex-wrap gap-2">
                {[
                  { label: "Any", min: null, max: null },
                  { label: "£15+", min: 15, max: null },
                  { label: "£20+", min: 20, max: null },
                  { label: "£25+", min: 25, max: null },
                  { label: "£30+", min: 30, max: null },
                  { label: "£40+", min: 40, max: null },
                  { label: "£50+", min: 50, max: null },
                ].map((preset) => {
                  const isSelected =
                    preset.min === minPrice &&
                    (preset.max === maxPrice ||
                      (preset.max === null && maxPrice == null));

                  return (
                    <TouchableOpacity
                      key={preset.label}
                      activeOpacity={0.8}
                      onPress={() => {
                        onMinPriceChange?.(preset.min);
                        onMaxPriceChange?.(preset.max);
                      }}
                      className={`rounded-full px-3.5 py-1.5 border ${
                        isSelected
                          ? "bg-[#FFF5F2] border-[#FF5500]"
                          : "bg-neutral-50 border-neutral-200"
                      }`}
                    >
                      <Text
                        className={`text-xs ${
                          isSelected
                            ? "font-bold text-[#FF5500]"
                            : "font-medium text-neutral-700"
                        }`}
                      >
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : null}
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
  resultCount,
  onReset,
  startDateRange,
  onStartDateRangeChange,
  endDateRange,
  onEndDateRangeChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
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
          resultCount={resultCount}
          startDateRange={startDateRange}
          onStartDateRangeChange={onStartDateRangeChange}
          endDateRange={endDateRange}
          onEndDateRangeChange={onEndDateRangeChange}
          minPrice={minPrice}
          onMinPriceChange={onMinPriceChange}
          maxPrice={maxPrice}
          onMaxPriceChange={onMaxPriceChange}
        />
      </View>
    </Modal>
  );
}
