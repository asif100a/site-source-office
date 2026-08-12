import React from "react";
import { ScrollView, Text, View } from "react-native";
import LabourerCard from "@/components/card/LabourerCard";
import { Colors } from "@/constants/Colors";
import type { WorkerJobItem } from "@/components/modules/worker/offers/VerticalJobListings";

const MOCK_JOBS: WorkerJobItem[] = [
  {
    id: "3",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    payRate: "120",
    tag: "Market Rate",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    time: "2 hours ago",
  },
  {
    id: "4",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    payRate: "80",
    tag: "Market Rate",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    time: "2 hours ago",
  },
  {
    id: "5",
    title: "Graphic Designer",
    company: "Creative Studios",
    payRate: "90",
    tag: "Competitive Rate",
    location: "Soho - 2.5 mi away",
    team: "1 designer",
    duration: "15 Jun - 2 weeks",
    time: "4 hours ago",
  },
];

export default function SearchEmployerListView({
  handleViewDetails,
  onOpenDetails,
}: {
  handleViewDetails: (id: string) => void;
  onOpenDetails?: (job: WorkerJobItem) => void;
}) {
  return (
    <ScrollView
      className="flex-1 bg-neutral-50 px-5 pt-2"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="my-4 flex-row items-center justify-between">
        <Text className="text-base font-extrabold tracking-tight text-neutral-900">
          Search Result
        </Text>
        <Text
          style={{ color: Colors.common.BRAND }}
          className="text-xs font-extrabold"
        >
          28 Results
        </Text>
      </View>

      <View className="gap-4">
        {MOCK_JOBS.map((job) => (
          <LabourerCard
            key={job.id}
            job={job}
            handleViewDetails={handleViewDetails}
            handleApply={handleViewDetails}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </View>
    </ScrollView>
  );
}
