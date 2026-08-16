import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import type { WorkerHomeStartFilter } from "@/constants/workerHome";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";

const TRADE_OPTIONS = [
  "Labourer",
  "Groundworker",
  "Carpenter",
  "Scaffolder",
  "Bricklayer",
  "Plant op",
];

const START_OPTIONS: WorkerHomeStartFilter[] = [
  "Tomorrow",
  "This week",
  "Anytime",
];

function ToggleChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mr-2 mb-2 rounded-full border px-4 py-2.5"
      style={{
        backgroundColor: active ? "#111111" : "#FFFFFF",
        borderColor: active ? "#111111" : "#E5E7EB",
      }}
    >
      <Text
        className="text-xs font-semibold"
        style={{ color: active ? "#FFFFFF" : "#4B5563" }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

type WorkerHomeFilterModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedTrades: string[];
  onToggleTrade: (trade: string) => void;
  maxDistanceMiles: number;
  onMaxDistanceMilesChange: (value: number) => void;
  minRatePerDay: number;
  onMinRatePerDayChange: (value: number) => void;
  startFilter: WorkerHomeStartFilter;
  onStartFilterChange: (value: WorkerHomeStartFilter) => void;
  resultCount: number;
  onReset: () => void;
};

export default function WorkerHomeFilterModal({
  visible,
  onClose,
  selectedTrades,
  onToggleTrade,
  maxDistanceMiles,
  onMaxDistanceMilesChange,
  minRatePerDay,
  onMinRatePerDayChange,
  startFilter,
  onStartFilterChange,
  resultCount,
  onReset,
}: WorkerHomeFilterModalProps) {
  const [isAdjustingRange, setIsAdjustingRange] = useState(false);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end" style={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}>
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="rounded-t-[28px] bg-white px-5 pb-6 pt-3">
          <View className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-neutral-200" />

          <View className="flex-row items-center justify-between">
            <Text className="text-[22px] font-extrabold text-neutral-950">
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

          <ScrollView
            scrollEnabled={!isAdjustingRange}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <View className="mt-5">
              <Text className="mb-3 text-xs font-extrabold uppercase tracking-[1px] text-neutral-400">
                Trade
              </Text>
              <View className="-mr-2 flex-row flex-wrap">
                {TRADE_OPTIONS.map((trade) => (
                  <ToggleChip
                    key={trade}
                    label={trade}
                    active={selectedTrades.includes(trade)}
                    onPress={() => onToggleTrade(trade)}
                  />
                ))}
              </View>
            </View>

            <View className="mt-5">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-xs font-extrabold uppercase tracking-[1px] text-neutral-400">
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
                <Text className="text-xs font-extrabold uppercase tracking-[1px] text-neutral-400">
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
              <Text className="mb-3 text-xs font-extrabold uppercase tracking-[1px] text-neutral-400">
                Start
              </Text>
              <View className="flex-row flex-wrap">
                {START_OPTIONS.map((option) => {
                  const active = startFilter === option;

                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => onStartFilterChange(option)}
                      className="mb-2 mr-2 flex-1 rounded-full border px-4 py-3"
                      style={{
                        backgroundColor: active ? "#111111" : "#FFFFFF",
                        borderColor: active ? "#111111" : "#E5E7EB",
                        minWidth: "30%",
                      }}
                    >
                      <Text
                        className="text-center text-sm font-semibold"
                        style={{ color: active ? "#FFFFFF" : "#4B5563" }}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            onPress={onClose}
            className="mt-2 rounded-2xl bg-[#111111] py-4 mb-10"
          >
            <Text className="text-center text-sm font-extrabold text-white">
              Show {resultCount} {resultCount === 1 ? "job" : "jobs"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
