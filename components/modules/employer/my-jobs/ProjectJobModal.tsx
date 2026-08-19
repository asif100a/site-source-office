import { View, Text, Modal, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { ModalFrame, ModalHeader, ProjectInput, TradeSkillDropdown } from "./_ui";
import { CalendarDays } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import { ProjectCard, ProjectJobDateRange, ProjectJobForm } from "@/types";
import { formatProjectJobDateRange } from "@/app/tabs/(employer-tabs)/my-jobs";

export default function ProjectJobModal({
  visible,
  project,
  jobForm,
  setJobForm,
  dateRange,
  setDateRange,
  onClose,
  onCreate,
}: {
  visible: boolean;
  project?: ProjectCard;
  jobForm: ProjectJobForm;
  setJobForm: React.Dispatch<React.SetStateAction<ProjectJobForm>>;
  dateRange: ProjectJobDateRange;
  setDateRange: React.Dispatch<React.SetStateAction<ProjectJobDateRange>>;
  onClose: () => void;
  onCreate: () => void;
}) {
  const [tradeMenuOpen, setTradeMenuOpen] = useState(false);
  const calendarStyles = useDefaultStyles();

  if (!project) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <ModalFrame onClose={onClose}>
        <ModalHeader title="Create job posting" onClose={onClose} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="mb-4 text-xs font-semibold text-neutral-500">
            {project.name} &gt; Job
          </Text>

          <View className="gap-4">
            <TradeSkillDropdown
              value={jobForm.tradeSkill}
              open={tradeMenuOpen}
              setOpen={setTradeMenuOpen}
              onSelect={(tradeSkill) =>
                setJobForm((current) => ({ ...current, tradeSkill }))
              }
            />

            <View>
              <View className="mb-2 flex-row items-center gap-2">
                <CalendarDays size={15} color="#737373" />
                <Text className="text-xs font-bold uppercase tracking-[0.8px] text-neutral-500">
                  Days required
                </Text>
              </View>
              <View className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3">
                <View className="mb-3 flex-row items-center justify-between gap-3">
                  <Text className="flex-1 text-xs font-semibold text-neutral-600">
                    {formatProjectJobDateRange(dateRange)}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setDateRange({})}
                  >
                    <Text className="text-xs font-bold text-[#FF5500]">
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>

                <DateTimePicker
                  mode="range"
                  startDate={dateRange.from}
                  endDate={dateRange.to}
                  onChange={({ startDate, endDate }) =>
                    setDateRange({
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
                  calendar="gregory"
                  containerHeight={300}
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
                    selected_label: { color: "#FFFFFF", fontWeight: "800" },
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
              </View>
            </View>

            <ProjectInput
              label="Hourly rate"
              placeholder="24"
              value={jobForm.hourlyRate}
              onChangeText={(hourlyRate) =>
                setJobForm((current) => ({ ...current, hourlyRate }))
              }
              keyboardType="numeric"
            />
            <ProjectInput
              label="Work brief"
              placeholder="Describe the work needed"
              value={jobForm.workBrief}
              onChangeText={(workBrief) =>
                setJobForm((current) => ({ ...current, workBrief }))
              }
              multiline
            />
          </View>
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onCreate}
          className="mt-6 items-center justify-center rounded-2xl py-4 mb-6"
          style={{ backgroundColor: Colors.common.GRAY_DARK }}
        >
          <Text className="text-sm font-extrabold text-white">Post job</Text>
        </TouchableOpacity>
      </ModalFrame>
    </Modal>
  );
}
