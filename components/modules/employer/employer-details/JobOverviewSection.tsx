import { Colors } from "@/constants/Colors";
import { EmployerJobDetails } from "@/types";
import { Clock } from "lucide-react-native";
import { Text, View } from "react-native";

const JOB_OVERVIEW_FIELDS = [
  { label: "Trade", valueKey: "tradeCount" },
  { label: "Employment", valueKey: "employmentType" },
  { label: "Duration", valueKey: "jobDuration" },
] as const;

export default function JobOverviewSection({ jobDetails }: { jobDetails: EmployerJobDetails }) {
  return (
    <View className="mb-6 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="flex-1 text-base font-extrabold text-neutral-900">Job overview</Text>

        <View className="flex-row items-center gap-1.5">
          <Clock size={14} color="#A3A3A3" />
          <Text className="text-xs font-medium text-neutral-400">{jobDetails.time}</Text>
        </View>
      </View>

      {JOB_OVERVIEW_FIELDS.map((field) => (
        <View
          key={field.label}
          className="flex-1 flex-row items-center justify-between border-b border-neutral-50 py-2 last:border-b-0"
        >
          <Text className="flex-1 text-sm font-semibold text-neutral-500">{field.label}</Text>
          <Text className="min-w-20 text-sm font-extrabold text-neutral-900" style={{ textAlign: "right" }}>
            {jobDetails[field.valueKey]}
          </Text>
        </View>
      ))}

      <View className="flex-row items-center justify-between py-2">
        <Text className="text-sm font-semibold text-neutral-500">Rate</Text>

        <View className="items-end gap-2">
          <Text className="text-sm font-extrabold text-neutral-900">£{jobDetails.payRate}</Text>
          {/* <View
            style={{ backgroundColor: Colors.common.BRAND_LIGHT }}
            className="rounded px-2 py-0.5"
          >
            <Text
              style={{ color: Colors.common.BRAND }}
              className="text-[9px] font-extrabold"
            >
              {jobDetails.tag}
            </Text>
          </View> */}
        </View>
      </View>
    </View>
  );
}