import { View, Text, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react-native";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import { Colors } from "@/constants/Colors";
import { EXPERIENCES, TRADES } from "@/assets/data";

type FilterFieldId =
  | "project"
  | "jobPosting"
  | "tradeSkill"
  | "experience"
  | "radius"
  | "availableTime";

type SelectOption = {
  label: string;
  value: string;
};

const TRADE_OPTIONS = [
  { label: "All trades", value: "all" },
  ...TRADES,
];

const EXPERIENCE_OPTIONS = [
  { label: "All experience", value: "all" },
  ...EXPERIENCES,
];

const PROJECT_OPTIONS = [
  { label: "Hoxton Street Refurb", value: "hoxton-refurb" },
  { label: "Shoreditch Office Fit-out", value: "shoreditch-office" },
  { label: "Camden Retail Build", value: "camden-retail" },
];

const JOB_POSTING_OPTIONS = [
  { label: "Labourer - Hoxton", value: "labourer-hoxton" },
  { label: "Carpenter - First fix", value: "carpenter-first-fix" },
  { label: "Electrician - Site setup", value: "electrician-site-setup" },
];

const RADIUS_OPTIONS = [
  { label: "All radius", value: "all" },
  { label: "1 - 10 miles", value: "1-10" },
  { label: "11 - 20 miles", value: "11-20" },
  { label: "21 - 50 miles", value: "21-50" },
];

const TIME_OPTIONS = [
  { label: "8 am - 5 pm", value: "8-5" },
  { label: "9 am - 6 pm", value: "9-6" },
  { label: "Night shift", value: "night" },
];

function FilterSelectField({
  label,
  id,
  control,
  options,
  placeholder,
  openField,
  setOpenField,
}: {
  label: string;
  id: FilterFieldId;
  control: Control<any>;
  options: SelectOption[];
  placeholder: string;
  openField: FilterFieldId | null;
  setOpenField: React.Dispatch<React.SetStateAction<FilterFieldId | null>>;
}) {
  const isOpen = openField === id;

  return (
    <Controller
      control={control}
      name={id}
      render={({ field: { onChange, value } }) => {
        const selectedLabel =
          options.find((option) => option.value === value)?.label ?? placeholder;

        return (
          <View className="mb-5">
            <Text className="text-sm font-semibold text-[#333] mb-2">
              {label}
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setOpenField(isOpen ? null : id)}
              className="h-[50px] rounded-xl border border-[#e8e8e8] px-4 flex-row items-center justify-between bg-white"
            >
              <Text className="text-sm text-[#222] font-medium">
                {selectedLabel}
              </Text>
              <ChevronDown size={18} color="#999999" />
            </TouchableOpacity>

            {isOpen ? (
              <View className="mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                {options.map((option) => {
                  const selected = option.value === value;

                  return (
                    <TouchableOpacity
                      key={option.value}
                      activeOpacity={0.8}
                      onPress={() => {
                        onChange(option.value);
                        setOpenField(null);
                      }}
                      className={`min-h-[48px] px-4 justify-center ${
                        selected ? "bg-[#FFF5F2]" : "bg-white"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          selected
                            ? "text-[#FF5500] font-bold"
                            : "text-neutral-800 font-medium"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
        );
      }}
    />
  );
}

export default function SearchWorkerModal({
  showFilters,
  setShowFilters,
  control,
}: {
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  control: any;
}) {
  const [openField, setOpenField] = useState<FilterFieldId | null>(null);

  const closeModal = () => {
    setOpenField(null);
    setShowFilters(false);
  };

  return (
    <Modal
      visible={showFilters}
      transparent
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View className="bg-white rounded-t-[32px] p-6 pb-12 shadow-2xl border-t border-neutral-100">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-neutral-900 font-extrabold text-lg tracking-tight">
              FILTERS
            </Text>
            <TouchableOpacity
              onPress={closeModal}
              className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center active:opacity-75"
            >
              <X size={16} color="#333333" />
            </TouchableOpacity>
          </View>

          <View className="gap-3 mb-8">
            {/* <FilterSelectField
              label="Project"
              id="project"
              control={control}
              options={PROJECT_OPTIONS}
              placeholder="Select project"
              openField={openField}
              setOpenField={setOpenField}
            />

            <FilterSelectField
              label="Job posting"
              id="jobPosting"
              control={control}
              options={JOB_POSTING_OPTIONS}
              placeholder="Select job posting"
              openField={openField}
              setOpenField={setOpenField}
            /> */}

            <FilterSelectField
              label="Trade / Skill"
              id="tradeSkill"
              control={control}
              options={TRADE_OPTIONS}
              placeholder="All trades"
              openField={openField}
              setOpenField={setOpenField}
            />

            {/* <FilterSelectField
              label="Experience"
              id="experience"
              control={control}
              options={EXPERIENCE_OPTIONS}
              placeholder="All experience"
              openField={openField}
              setOpenField={setOpenField}
            /> */}

            <FilterSelectField
              label="Radius"
              id="radius"
              control={control}
              options={RADIUS_OPTIONS}
              placeholder="All radius"
              openField={openField}
              setOpenField={setOpenField}
            />
{/* 
            <FilterSelectField
              label="Available time"
              id="availableTime"
              control={control}
              options={TIME_OPTIONS}
              placeholder="8 am - 5 pm"
              openField={openField}
              setOpenField={setOpenField}
            /> */}
          </View>

          <TouchableOpacity
            onPress={closeModal}
            style={{ backgroundColor: Colors.common.GRAY_DARK }}
            className="w-full py-4 rounded-xl items-center justify-center active:opacity-90"
          >
            <Text className="text-white font-extrabold text-sm">
              Apply Filter
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
