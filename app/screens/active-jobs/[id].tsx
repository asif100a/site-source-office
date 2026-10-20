import { useState } from "react";
import {
  Alert,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Headphones, MessageCircle } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import CommonHeader from "@/components/modules/common/CommonHeader";
import EmployerJobDetails from "@/components/modules/employer/active-jobs/EmployerJobDetails";
import EmployerWorkers from "@/components/modules/employer/active-jobs/EmployerWorkers";
import ProjectSchedule from "@/components/modules/employer/active-jobs/ProjectSchedule";
import EmployerUpcomingJobDetails from "@/components/modules/employer/active-jobs/EmployerUpcomingJobDetails";
import EmployerUpcomingApplicants from "@/components/modules/employer/active-jobs/EmployerUpcomingApplicants";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import WorkerJobDetails from "@/components/modules/worker/active-jobs/WorkerJobDetails";
import WorkerEmployerContact from "@/components/modules/worker/active-jobs/WorkerEmployerContact";
import WorkerToggleChips from "@/components/modules/worker/active-jobs/WorkerToggleChips";
import WorkerProjectSchedule from "@/components/modules/worker/active-jobs/WorkerProjectSchedule";
import WorkerWorkSummary from "@/components/modules/worker/active-jobs/WorkerWorkSummary";
import WorkerWorkPolicy from "@/components/modules/worker/active-jobs/WorkerWorkPolicy";
import MessageSupportModal from "@/components/modules/common/MessageSupportModal";
import RequestApprovalModal from "@/components/modules/worker/active-jobs/RequestApprovalModal";
import {
  useChangeCompletionStatusMutation,
  useGetSingleJobQuery,
} from "@/store/api/jobApi";
import { getSingleJobData } from "@/utils/workerJobs";
import Toast from "react-native-toast-message";

function EmployerCompletionRequestCard({
  jobId,
  status,
  onUpdated,
}: {
  jobId: string;
  status?: string;
  onUpdated: () => void | Promise<void>;
}) {
  const [changeCompletionStatus, { isLoading }] =
    useChangeCompletionStatusMutation();

  if (!status) return null;

  const updateCompletionStatus = async (nextStatus: "COMPLETED" | "REJECTED") => {
    if (!jobId) {
      Toast.show({
        type: "error",
        text1: "Job unavailable",
        text2: "Unable to find this job."
      });
      return;
    }

    try {
      const response = await changeCompletionStatus({ jobId, status: nextStatus }).unwrap();
      console.log("changeCompletionStatus response: ", response);
      await onUpdated();
      Toast.show({
        type: "success",
        text1: "Completion request updated",
        text2: nextStatus === "COMPLETED"
          ? "The job completion request has been approved."
          : "The job completion request has been rejected."
      });
    } catch (error) {
      console.error("error updating completion status: ", error);
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: "Unable to update this completion request. Please try again."
      });
    }
  };

  return (
    <View className="mt-4 rounded-2xl border border-neutral-200/80 bg-white p-4">
      <View className="mb-4 flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <Text className="text-neutral-900 text-base font-extrabold">
            Completion Request
          </Text>
          <Text className="mt-1 text-xs font-semibold text-neutral-500">
            Worker requested to complete this job.
          </Text>
        </View>
        <View className="rounded-full bg-orange-50 px-3 py-1">
          <Text
            style={{ color: Colors.common.BRAND }}
            className="text-[10px] font-extrabold"
          >
            {status}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => void updateCompletionStatus("COMPLETED")}
          disabled={isLoading || status === "COMPLETED"}
          style={{ backgroundColor: Colors.common.BRAND }}
          className="flex-1 items-center rounded-xl px-4 py-3 disabled:opacity-60"
        >
          <Text className="text-xs font-extrabold text-white">
            {isLoading ? "Updating..." : "Approve"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => void updateCompletionStatus("REJECTED")}
          disabled={isLoading || status === "REJECTED"}
          className="flex-1 items-center rounded-xl border border-neutral-200 bg-white px-4 py-3 disabled:opacity-60"
        >
          <Text className="text-xs font-extrabold text-neutral-700">
            Reject
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ActiveJobDetailScreen() {
  const router = useRouter();
  const { id, origin, status } = useLocalSearchParams<{
    id?: string;
    origin?: string;
    status?: string;
  }>();
  const originRoute = Array.isArray(origin) ? origin[0] : origin;
  const statusRoute = Array.isArray(status) ? status[0] : status;
  const employerJobStatus = statusRoute === "upcoming" ? "upcoming" : "active";
  const jobId = Array.isArray(id) ? id[0] : id;
  const singleJobQuery = useGetSingleJobQuery(jobId ?? "", {
    skip: !jobId,
  });

  const [activeSubTab, setActiveSubTab] = useState<
    "schedule" | "timesheet" | "policy"
  >("schedule");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportModalState, setSupportModalState] = useState<
    "form" | "submitted"
  >("form");

  const jobDetails = getSingleJobData(singleJobQuery.data);
  console.log("jobDetails from the active job details screen: ", jobDetails);

  const openWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
    });
  };

  const handleNavigateBack = () => {
    router.back();
  };

  const refreshJob = async () => {
    if (!jobId) return;

    await singleJobQuery.refetch();
  };

  if (originRoute === "employer") {
    if (singleJobQuery.isLoading) {
      return (
        <ScreenWrapper>
          <CommonHeader
            headerTitle={
              statusRoute === "upcoming" ? "Upcoming Job" : "Active Job"
            }
            withBackButton
            onPress={handleNavigateBack}
          />
          <View className="flex-1 items-center justify-center px-5">
            <Text className="text-sm font-semibold text-neutral-500">
              Loading job details...
            </Text>
          </View>
        </ScreenWrapper>
      );
    }

    if (singleJobQuery.isError || !jobDetails) {
      return (
        <ScreenWrapper>
          <CommonHeader
            headerTitle={
              statusRoute === "upcoming" ? "Upcoming Job" : "Active Job"
            }
            withBackButton
            onPress={handleNavigateBack}
          />
          <View className="flex-1 items-center justify-center px-5">
            <Text className="text-center text-sm font-semibold text-red-700">
              Unable to load this job. Please try again.
            </Text>
          </View>
        </ScreenWrapper>
      );
    }

    return (
      <ScreenWrapper>
        <CommonHeader
          headerTitle={
            statusRoute === "upcoming" ? "Upcoming Jobs" : "Active Jobs"
          }
          withBackButton
          onPress={handleNavigateBack}
        />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={singleJobQuery.isFetching}
              onRefresh={() => void refreshJob()}
            />
          }
        >
          <View className="px-4 pt-4">
            {employerJobStatus === "active" ? (
              <>
                <EmployerJobDetails jobDetails={jobDetails} />

                {/* EMPLOYER_WORKERS */}
                <EmployerWorkers
                  openWorkerDetails={openWorkerDetails}
                  jobDetails={jobDetails}
                />

                {/* Project Schedule */}
                <ProjectSchedule jobDetails={jobDetails} />

                <EmployerCompletionRequestCard
                  jobId={jobId ?? ""}
                  status={jobDetails?.jobCompletion?.status}
                  onUpdated={refreshJob}
                />
              </>
            ) : (
              <>
                {/* Employer Upcoming Job Details */}
                <EmployerUpcomingJobDetails />

                {/* Employer Upcoming Applicants */}
                <EmployerUpcomingApplicants
                  openWorkerDetails={openWorkerDetails}
                />
              </>
            )}
          </View>
        </ScrollView>

        {/* {employerJobStatus === "active" && (
          <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-4 py-4 pb-14 flex-row gap-3">
            <TouchableOpacity
              style={{ backgroundColor: Colors.common.GRAY_DARK }}
              className="flex-1 py-4 rounded-xl items-center justify-center active:opacity-90"
            >
              <Text className="text-white text-sm font-semibold">
                Cancel Job
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 py-4 rounded-xl border border-neutral-200 bg-white items-center justify-center active:opacity-75">
              <Text className="text-neutral-700 text-sm font-medium">
                Dispute
              </Text>
            </TouchableOpacity>
          </View>
        )} */}
      </ScreenWrapper>
    );
  }

  if (singleJobQuery.isLoading) {
    return (
      <ScreenWrapper>
        <CommonHeader
          headerTitle={"Active Job"}
          withBackButton
          onPress={handleNavigateBack}
        />
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-sm font-semibold text-neutral-500">
            Loading active job...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (singleJobQuery.isError) {
    return (
      <ScreenWrapper>
        <CommonHeader
          headerTitle={"Active Job"}
          withBackButton
          onPress={handleNavigateBack}
        />
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-center text-sm font-semibold text-red-700">
            Unable to load this active job. Please try again.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!jobDetails) {
    return (
      <ScreenWrapper>
        <CommonHeader
          headerTitle={"Active Job"}
          withBackButton
          onPress={handleNavigateBack}
        />
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-center text-sm font-semibold text-neutral-500">
            Active job details are not available.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <CommonHeader
        headerTitle={"Active Job"}
        withBackButton
        onPress={handleNavigateBack}
      />

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/screens/chats/chats",
            params: { jobId, origin: originRoute === "employer" ? "employer" : "worker" },
          })
        }
        className="mx-5 mt-3 flex-row items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3"
      >
        <MessageCircle size={17} color="#C2410C" />
        <Text className="text-sm font-bold text-orange-700">Send message</Text>
      </TouchableOpacity>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={singleJobQuery.isFetching}
            onRefresh={() => void refreshJob()}
          />
        }
      >
        <View className="px-5 pt-4 pb-20">
          <WorkerJobDetails jobDetails={jobDetails} />

          {/* Employer Contact */}
          <WorkerEmployerContact jobDetails={jobDetails} />

          {/* Worker Toggle Chips */}
          <WorkerToggleChips
            activeSubTab={activeSubTab}
            setActiveSubTab={setActiveSubTab}
          />

          {/* Worker Project Schedule */}
          {activeSubTab === "schedule" && (
            <WorkerProjectSchedule jobDetails={jobDetails} />
          )}

          {/* Worker Work Summary */}
          {activeSubTab === "timesheet" && (
            <WorkerWorkSummary
              setShowApprovalModal={setShowApprovalModal}
              jobId={jobId ?? ""}
              onCompletionRequested={() => {
                void refreshJob();
              }}
              isAppliedForJobCompletion={Boolean(jobDetails?.jobCompletion?.status)}
            />
          )}

          {/* Worker Work Policy */}
          {activeSubTab === "policy" && <WorkerWorkPolicy />}
        </View>
      </ScrollView>

      {/* <TouchableOpacity
        onPress={() => {
          setSupportModalState("form");
          setShowSupportModal(true);
        }}
        style={{ backgroundColor: Colors.common.BRAND }}
        className="absolute bottom-16 right-6 w-14 h-14 rounded-full items-center justify-center active:opacity-90 z-20"
      >
        <Headphones size={24} color="#FFFFFF" />
      </TouchableOpacity> */}

      {/* Message Support Modal */}
      {/* <MessageSupportModal
        showSupportModal={showSupportModal}
        setShowSupportModal={setShowSupportModal}
        supportModalState={supportModalState}
        setSupportModalState={setSupportModalState}
      /> */}

      {/* Request Approval Modal */}
      <RequestApprovalModal
        showApprovalModal={showApprovalModal}
        setShowApprovalModal={setShowApprovalModal}
        jobId={jobId ?? ""}
        timeSheetWeeks={jobDetails.timeSheetWeeks ?? []}
      />
    </ScreenWrapper>
  );
}
