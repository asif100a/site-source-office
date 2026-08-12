import React from "react";
import { View } from "react-native";
import LabourerCard from "@/components/card/LabourerCard";

export type WorkerJobItem = {
  id: string;
  title: string;
  company: string;
  payRate: string;
  tag: string;
  location: string;
  team: string;
  duration: string;
  time: string;
};

export default function VerticalJobListings({
  handleViewDetails,
  handleApply,
  favoriteJobIds = [],
  onToggleFavorite,
  jobs,
}: {
  handleViewDetails: (id: string) => void;
  handleApply: () => void;
  favoriteJobIds?: string[];
  onToggleFavorite?: (id: string) => void;
  jobs?: WorkerJobItem[];
}) {
  const source =
    jobs ?? [
      {
        id: "3",
        title: "Labourer",
        company: "Tech Innovators Inc.",
        payRate: "80",
        tag: "Market Rate",
        location: "Shoreditch • 1.2 mi away",
        team: "2 developers, 1 designer",
        duration: "12 Jun • 1 month",
        time: "2 hours ago",
      },
      {
        id: "5",
        title: "Graphic Designer",
        company: "Creative Studios",
        payRate: "60",
        tag: "Competitive Rate",
        location: "Soho • 2.5 mi away",
        team: "1 designer",
        duration: "15 Jun • 2 weeks",
        time: "4 hours ago",
      },
    ];

  return (
    <View className="gap-4">
      {source.map((job) => (
        <LabourerCard
          key={job.id}
          job={job}
          handleViewDetails={handleViewDetails}
          handleApply={handleApply}
          isFavorite={favoriteJobIds.includes(job.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </View>
  );
}
