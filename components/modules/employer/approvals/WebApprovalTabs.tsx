import { ApprovalTab } from "@/types";
import { Text, TouchableOpacity, View } from "react-native";

export default function WebApprovalTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: ApprovalTab;
  setActiveTab: React.Dispatch<React.SetStateAction<ApprovalTab>>;
}) {
  return (
    <View className="rounded-2xl bg-neutral-100 p-1">
      <View className="flex-row">
        {[
          { id: "timesheets" as const, label: "Approve Timesheet" },
          { id: "requests" as const, label: "Approve Job Request" },
        ].map((tab) => {
          const active = activeTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.9}
              className={`flex-1 rounded-[14px] px-4 py-3 ${
                active ? "bg-white" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-center text-sm font-bold ${
                  active ? "text-neutral-950" : "text-neutral-500"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}