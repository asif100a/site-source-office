import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Headphones } from "lucide-react-native";
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
import { useGetSingleJobQuery } from "@/store/api/jobApi";
import { getSingleJobData } from "@/utils/workerJobs";
import {
  DEFAULT_ACTIVE_JOB_DETAILS,
  mapSingleJobToActiveJobDetails,
} from "@/utils/activeJobDetails";

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
  console.log("singleJobQuery from the active job screen: ", singleJobQuery);

  const [activeSubTab, setActiveSubTab] = useState<
    "schedule" | "timesheet" | "policy"
  >("schedule");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportModalState, setSupportModalState] = useState<
    "form" | "submitted"
  >("form");

  const singleJob = getSingleJobData(singleJobQuery.data);
  const jobDetails = singleJob
    ? mapSingleJobToActiveJobDetails(singleJob)
    : DEFAULT_ACTIVE_JOB_DETAILS;

  const openWorkerDetails = (workerId: string) => {
    router.push({
      pathname: "/screens/worker-details/[id]",
      params: { id: workerId, origin: "employer" },
    });
  };

  const handleNavigateBack = () => {
    router.back();
  };

  if (originRoute === "employer") {
    return (
      <ScreenWrapper>
        <CommonHeader
          headerTitle={
            statusRoute === "upcoming" ? "Upcoming Job" : "Active Job"
          }
          withBackButton
          onPress={handleNavigateBack}
        />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View className="px-4 pt-4">
            {employerJobStatus === "active" ? (
              <>
                <EmployerJobDetails />

                {/* EMPLOYER_WORKERS */}
                <EmployerWorkers openWorkerDetails={openWorkerDetails} />

                {/* Project Schedule */}
                <ProjectSchedule />
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

  return (
    <ScreenWrapper>
      <CommonHeader
        headerTitle={"Active Job"}
        withBackButton
        onPress={handleNavigateBack}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
            <WorkerWorkSummary setShowApprovalModal={setShowApprovalModal} />
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
        scheduleStartDate={singleJob?.startDate ?? jobDetails.startDate}
        scheduleEndDate={singleJob?.endDate ?? jobDetails.endDate}
      />
    </ScreenWrapper>
  );
}
