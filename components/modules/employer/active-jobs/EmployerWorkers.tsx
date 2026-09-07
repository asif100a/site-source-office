import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { ChevronRight } from "lucide-react-native";

const DEFAULT_EMPLOYER_WORKERS = [
  { id: "1", name: "James Hartley", progress: "Day 3 of 20" },
  { id: "2", name: "James Hartley", progress: "Day 3 of 20" },
  { id: "3", name: "James Hartley", progress: "Day 3 of 20" },
];

const getWorkers = (jobDetails: any) => {
  const applications = Array.isArray(jobDetails?.jobApplications)
    ? jobDetails.jobApplications
    : [];
  const acceptedWorkers = applications
    .filter((application: any) => application?.status === "ACCEPTED")
    .map((application: any) => {
      const auth = application?.auth;

      return {
        id: auth?.id ?? application?.authId ?? application?.id,
        name: auth?.profile?.name ?? "Worker",
        image: auth?.profile?.image,
        progress: `Week ${jobDetails?.timeSheetWeeks?.length ?? 0} scheduled`,
      };
    });

  return acceptedWorkers.length ? acceptedWorkers : DEFAULT_EMPLOYER_WORKERS;
};

export default function EmployerWorkers({
  openWorkerDetails,
  jobDetails,
}: {
  openWorkerDetails: (id: string) => void;
  jobDetails?: any;
}) {
  const workers = getWorkers(jobDetails);

  return (
    <View className="mt-4">
      <Text className="text-neutral-900 text-sm font-extrabold mb-3">
        Workers
      </Text>
      <View className="gap-3">
        {workers.map((worker) => (
          <TouchableOpacity
            key={worker.id}
            onPress={() => openWorkerDetails(worker.id)}
            activeOpacity={0.9}
            className="bg-white rounded-xl border border-neutral-200/80 px-3 py-3.5"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Image
                  source={{
                    uri:
                      worker.image ??
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
                  }}
                  className="w-10 h-10 rounded-full"
                />
                <View>
                  <Text className="text-neutral-900 text-sm font-bold">
                    {worker.name}
                  </Text>
                  <Text className="text-neutral-400 text-xs mt-0.5">
                    {worker.progress}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-1">
                <Text className="min-w-[100px] text-right text-neutral-500 text-xs font-medium">
                  Update Timesheet
                </Text>
                <ChevronRight size={16} color="#737373" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
