import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { ChevronRight } from "lucide-react-native";
import { router } from "expo-router";

const FALLBACK_WORKER_IMAGE =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop";

const formatTrade = (trade?: string) => {
  if (!trade) return "";

  return trade
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getWorkerProgress = (jobDetails: any) => {
  const weekCount = Array.isArray(jobDetails?.timeSheetWeeks)
    ? jobDetails.timeSheetWeeks.length
    : 0;

  return weekCount > 0 ? `Week ${weekCount} scheduled` : "Timesheet not started";
};

const mapWorkerAuthToWorker = (workerAuth: any, jobDetails: any) => {
  if (!workerAuth) return null;

  const trades = Array.isArray(workerAuth?.workerProfile?.trades)
    ? workerAuth.workerProfile.trades.map(formatTrade).filter(Boolean)
    : [];

  return {
    id: workerAuth.id ?? workerAuth._id ?? workerAuth.workerAuthId,
    name: workerAuth?.profile?.name ?? workerAuth?.email ?? "Worker",
    image: workerAuth?.profile?.image,
    trade: trades.join(", ") || "Trade not set",
    progress: getWorkerProgress(jobDetails),
  };
};

const getWorkers = (jobDetails: any) => {
  const assignedWorker = mapWorkerAuthToWorker(
    jobDetails?.workerAuth,
    jobDetails,
  );

  if (assignedWorker?.id) {
    return [assignedWorker];
  }

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
        trade:
          auth?.workerProfile?.trades?.map(formatTrade).filter(Boolean).join(", ") ||
          "Trade not set",
        progress: getWorkerProgress(jobDetails),
      };
    })
    .filter((worker: any) => worker.id);

  return acceptedWorkers;
};

export default function EmployerWorkers({
  openWorkerDetails,
  jobDetails,
}: {
  openWorkerDetails: (id: string) => void;
  jobDetails?: any;
}) {
  const workers = getWorkers(jobDetails);

  const handleUpdateTimesheetPress = (workerId: string) => {
    router.push({
      pathname: `/tabs/approvals`,
      params: { origin: "employer" },
    });
  };

  return (
    <View className="mt-4">
      <Text className="text-neutral-900 text-sm font-extrabold mb-3">
        Workers
      </Text>
      {workers.length ? (
        <View className="gap-3">
          {workers.map((worker: any) => (
            <View
              key={worker.id}
              className="bg-white rounded-xl border border-neutral-200/80 px-3 py-3.5"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Image
                    source={{
                      uri: worker.image ?? FALLBACK_WORKER_IMAGE,
                    }}
                    className="w-10 h-10 rounded-full"
                  />
                  <View>
                    <TouchableOpacity
                      key={worker.id}
                      onPress={() => openWorkerDetails(worker.id)}
                      activeOpacity={0.9}
                    >
                      <Text className="text-neutral-900 text-sm font-bold">
                        {worker.name}
                      </Text>
                    </TouchableOpacity>
                    <Text className="text-neutral-400 text-xs mt-0.5">
                      {worker.trade}
                    </Text>
                    <Text className="text-neutral-400 text-xs mt-0.5">
                      {worker.progress}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleUpdateTimesheetPress(worker.id)}
                  className="flex-row items-center gap-1"
                >
                  <Text className="min-w-[100px] text-right text-neutral-500 text-xs font-medium">
                    Update Timesheet
                  </Text>
                  <ChevronRight size={16} color="#737373" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="rounded-xl border border-neutral-200/80 bg-white px-4 py-5">
          <Text className="text-sm font-semibold text-neutral-500">
            No worker assigned yet.
          </Text>
        </View>
      )}
    </View>
  );
}
