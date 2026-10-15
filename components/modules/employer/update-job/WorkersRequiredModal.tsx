import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";
import { ChevronDown, Minus, Plus, X } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import type { Dispatch, SetStateAction } from "react";

type TradeOption = {
  label: string;
  value: string;
};

type WorkersRequiredModalProps = {
  showWorkersModal: boolean;
  closeWorkersModal: () => void;
  selectedTrade: string;
  setSelectedTrade: Dispatch<SetStateAction<string>>;
  workersNeeded: number;
  setWorkersNeeded: Dispatch<SetStateAction<number>>;
  publishWorkers: () => void;
  TRADE_OPTIONS: TradeOption[];
};

export default function WorkersRequiredModal({
    showWorkersModal,
    closeWorkersModal,
    selectedTrade,
    setSelectedTrade,
    workersNeeded,
    setWorkersNeeded,
    publishWorkers,
    TRADE_OPTIONS
}: WorkersRequiredModalProps) {
  return (
    <Modal
      visible={showWorkersModal}
      transparent
      animationType="fade"
      onRequestClose={closeWorkersModal}
    >
      <View className="flex-1 bg-neutral-500/45 justify-end">
        <View className="bg-neutral-100 rounded-t-[28px] px-5 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-neutral-900 text-lg font-extrabold">
              Workers required
            </Text>
            <TouchableOpacity
              onPress={closeWorkersModal}
              className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center"
            >
              <X size={16} color="#111827" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-[#333] text-sm font-semibold mb-2">
              Trade / Skill
            </Text>
            <TouchableOpacity
              onPress={() => {
                const currentIndex = TRADE_OPTIONS.findIndex(
                  (item) => item.value === selectedTrade,
                );
                const nextIndex = (currentIndex + 1) % TRADE_OPTIONS.length;
                setSelectedTrade(TRADE_OPTIONS[nextIndex].value);
              }}
              className="h-[52px] rounded-xl border border-[#e8e8e8] px-4 flex-row items-center justify-between"
            >
              <Text className="text-sm text-[#222]">
                {TRADE_OPTIONS.find((item) => item.value === selectedTrade)
                  ?.label ?? "Groundworker"}
              </Text>
              <ChevronDown size={18} color="#999999" />
            </TouchableOpacity>
          </View>

          <View className="gap-3 mb-5">
            <View>
              <Text className="text-[#333] text-sm font-semibold mb-2">
                Groundworker
              </Text>
              <View className="h-[52px] rounded-xl border border-[#e8e8e8] px-4 flex-row items-center justify-between">
                <Text className="text-sm text-[#222]">{workersNeeded}</Text>
                <View className="flex-row items-center gap-3">
                  <TouchableOpacity
                    onPress={() =>
                      setWorkersNeeded((value) => Math.max(1, value - 1))
                    }
                    className="w-7 h-7 rounded-full items-center justify-center bg-neutral-100"
                  >
                    <Minus size={16} color="#111827" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setWorkersNeeded((value) => value + 1)}
                    className="w-7 h-7 rounded-full items-center justify-center bg-neutral-900"
                  >
                    <Plus size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View>
              <Text className="text-[#333] text-sm font-semibold mb-2">
                Groundworker
              </Text>
              <View className="h-[52px] rounded-xl border border-[#e8e8e8] px-4 flex-row items-center justify-between">
                <Text className="text-sm text-[#222]">2</Text>
                <View className="flex-row items-center gap-3">
                  <TouchableOpacity className="w-7 h-7 rounded-full items-center justify-center bg-neutral-100">
                    <Minus size={16} color="#111827" />
                  </TouchableOpacity>
                  <TouchableOpacity className="w-7 h-7 rounded-full items-center justify-center bg-neutral-900">
                    <Plus size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={publishWorkers}
            style={{ backgroundColor: Colors.common.GRAY_DARK }}
            className="w-full py-4 rounded-2xl items-center justify-center active:opacity-90 shadow-sm"
          >
            <Text className="text-white font-extrabold text-sm">Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
