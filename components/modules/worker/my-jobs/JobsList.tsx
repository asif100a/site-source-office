import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Briefcase, Calendar, MapPin, Users } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import VerticalOfferListings from "@/components/modules/worker/offers/VerticalOfferListings";
import type { WorkerJobItem } from "@/components/modules/worker/offers/VerticalJobListings";

type WorkerMyJobStatus = "confirmed" | "completed";

type WorkerMyJobItem = {
  id: string;
  title: string;
  company: string;
  statusBadge: string;
  location: string;
  team: string;
  duration: string;
  status: WorkerMyJobStatus;
};

const OFFER_JOBS: WorkerJobItem[] = [
  {
    id: "offer-1",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    payRate: "80",
    tag: "Offer",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "22 Aug - 1 month",
    time: "2 hours ago",
  },
  {
    id: "offer-2",
    title: "Groundworker",
    company: "Cityline Projects",
    payRate: "95",
    tag: "Offer",
    location: "Hackney - 3.4 mi away",
    team: "1 foreman, 4 workers",
    duration: "24 Aug - 2 weeks",
    time: "1 hour ago",
  },
  {
    id: "offer-3",
    title: "Painter",
    company: "Studio Form",
    payRate: "90",
    tag: "Offer",
    location: "Soho - 2.5 mi away",
    team: "1 painter",
    duration: "26 Aug - 10 days",
    time: "Just now",
  },
];

const CONFIRMED_JOBS: WorkerMyJobItem[] = [
  {
    id: "job-confirmed-1",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    statusBadge: "Starts 22 Aug",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "22 Aug - 1 month",
    status: "confirmed",
  },
  {
    id: "job-confirmed-2",
    title: "Groundworker",
    company: "Cityline Projects",
    statusBadge: "Starts 24 Aug",
    location: "Hackney - 3.4 mi away",
    team: "1 foreman, 4 workers",
    duration: "24 Aug - 2 weeks",
    status: "confirmed",
  },
  {
    id: "job-confirmed-3",
    title: "Electrician",
    company: "Northside Logistics",
    statusBadge: "Starts 26 Aug",
    location: "Camden - 6.1 mi away",
    team: "1 supervisor, 2 electricians",
    duration: "26 Aug - 1 month",
    status: "confirmed",
  },
];

const COMPLETED_JOBS: WorkerMyJobItem[] = [
  {
    id: "job-completed-1",
    title: "Labourer",
    company: "Tech Innovators Inc.",
    statusBadge: "Completed",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jul - 12 Aug",
    status: "completed",
  },
  {
    id: "job-completed-2",
    title: "Groundworker",
    company: "Cityline Projects",
    statusBadge: "Completed",
    location: "Hackney - 3.4 mi away",
    team: "1 foreman, 4 workers",
    duration: "15 Jul - 10 Aug",
    status: "completed",
  },
  {
    id: "job-completed-3",
    title: "Painter",
    company: "Studio Form",
    statusBadge: "Completed",
    location: "Soho - 2.5 mi away",
    team: "1 painter",
    duration: "20 Jul - 8 Aug",
    status: "completed",
  },
];

export default function JobsList({
  handleOpenJobDetails,
  activeTab,
}: {
  handleOpenJobDetails: (id: string, status: string) => void;
  activeTab: string;
}) {
  if (activeTab === "Job Offers") {
    return (
      <VerticalOfferListings
        offers={OFFER_JOBS}
        handleViewDetails={(id) => handleOpenJobDetails(id, "offer")}
        handleAcceptOffer={(id) => handleOpenJobDetails(id, "confirmed")}
      />
    );
  }

  const jobs =
    activeTab === "Completed" ? COMPLETED_JOBS : CONFIRMED_JOBS;

  return (
    <View className="gap-4">
      {jobs.map((job) => (
        <TouchableOpacity
          key={job.id}
          onPress={() => handleOpenJobDetails(job.id, job.status)}
          activeOpacity={0.9}
          className="rounded-xl border border-neutral-100/80 bg-white p-5"
        >
          <View className="mb-4 flex-row items-start justify-between">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                <Briefcase size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text className="text-base font-extrabold text-neutral-950">
                  {job.title}
                </Text>
                <Text className="text-xs font-semibold text-neutral-500">
                  {job.company}
                </Text>
              </View>
            </View>

            <View className="items-end">
              <View
                style={
                  job.status === "completed"
                    ? { backgroundColor: "#E0F2FE" }
                    : { backgroundColor: Colors.common.BRAND_LIGHT }
                }
                className="rounded-full px-2.5 py-1"
              >
                <Text
                  style={
                    job.status === "completed"
                      ? { color: "#0284C7" }
                      : { color: Colors.common.BRAND }
                  }
                  className="text-[10px] font-extrabold"
                >
                  {job.statusBadge}
                </Text>
              </View>
            </View>
          </View>

          <View className="gap-2.5 border-t border-neutral-50 pt-3">
            <View className="flex-row items-center gap-2">
              <MapPin size={15} color="#858585" />
              <Text className="text-xs font-semibold text-neutral-500">
                {job.location}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Users size={15} color="#858585" />
              <Text className="text-xs font-semibold text-neutral-500">
                {job.team}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Calendar size={15} color="#858585" />
              <Text className="text-xs font-semibold text-neutral-500">
                {job.duration}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
