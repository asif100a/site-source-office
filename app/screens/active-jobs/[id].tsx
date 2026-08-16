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

  const [activeSubTab, setActiveSubTab] = useState<
    "schedule" | "timesheet" | "policy"
  >("schedule");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportModalState, setSupportModalState] = useState<
    "form" | "submitted"
  >("form");

  const jobDetails = {
    title: "Labourer",
    company: "Tech Innovators Inc.",
    statusBadge: "Day 3 of 20",
    location: "Shoreditch - 1.2 mi away",
    team: "2 developers, 1 designer",
    duration: "12 Jun - 1 month",
    contactName: "James Hartley",
    contactTitle: "Director - Hartley Construction",
    contactEmail: "olivia@untitledui.com",
    contactPhone: "+44 723 456 7891",
    startDate: "3 Jun 2026",
    endDate: "28 Jun 2026",
    hours: "07:30 - 17:00",
    daysPerWeek: "5 Days",
    nextInvoice: "Friday 7 Jun",
  };

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

        {employerJobStatus === "active" && (
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
        )}
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
        scheduleStartDate={jobDetails.startDate}
      />
    </ScreenWrapper>
  );
}
