import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import CommonHeader from "@/components/modules/common/CommonHeader";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import CompletedJobDetails from "@/components/modules/common/completed-jobs/CompletedJobDetails";
import CompletedEmployerContact from "@/components/modules/common/completed-jobs/CompletedEmployerContact";
import CompletedToggleChips from "@/components/modules/common/completed-jobs/CompletedToggleChips";
import CompletedSchedule from "@/components/modules/common/completed-jobs/CompletedSchedule";
import CompletedWorkSummary from "@/components/modules/common/completed-jobs/CompletedWorkSummary";
import StandardButton from "@/components/standard_ui/buttons/StandardButton";
import ReviewModal from "@/components/modules/common/ReviewModal";
import { Colors } from "@/constants/Colors";
import { Headphones } from "lucide-react-native";
import MessageSupportModal from "@/components/modules/common/MessageSupportModal";
import { useGetSingleJobQuery } from "@/store/api/jobApi";
import { getSingleJobData } from "@/utils/workerJobs";
import { mapSingleJobToActiveJobDetails } from "@/utils/activeJobDetails";

export default function CompletedJobDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();
  const jobId = Array.isArray(id) ? id[0] : id;
  const singleJobQuery = useGetSingleJobQuery(jobId ?? "", {
    skip: !jobId,
  });
  const rawJob = getSingleJobData(singleJobQuery.data);
  const jobDetails = rawJob ? mapSingleJobToActiveJobDetails(rawJob) : null;

  const [activeSubTab, setActiveSubTab] = useState<"schedule" | "summary">(
    "schedule",
  );

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [submittedReviews, setSubmittedReviews] = useState([]);
  // Support Modal State
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportModalState, setSupportModalState] = useState<
    "form" | "submitted"
  >("form");

  const handleNavigateBack = () => {
    router.back();
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const submitReview = () => {
    if (!reviewRating || !reviewFeedback.trim()) return;

    setSubmittedReviews(
      (currentReviews) =>
        [
          {
            name: "You",
            date: "Just now",
            rating: reviewRating,
            feedback: reviewFeedback.trim(),
            image:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
          },
          ...currentReviews,
        ] as any,
    );
    setReviewRating(0);
    setReviewFeedback("");
    setIsReviewModalOpen(false);
  };

  return (
    <ScreenWrapper>
      <CommonHeader
        headerTitle="Completed Jobs"
        withBackButton
        onPress={handleNavigateBack}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-12">
          {singleJobQuery.isLoading ? (
            <View className="items-center rounded-2xl bg-white px-5 py-8">
              <Text className="text-sm font-semibold text-neutral-500">
                Loading completed job...
              </Text>
            </View>
          ) : singleJobQuery.isError || !jobDetails ? (
            <View className="items-center rounded-2xl bg-red-50 px-5 py-8">
              <Text className="text-center text-sm font-semibold text-red-700">
                Unable to load this completed job. Please try again.
              </Text>
            </View>
          ) : (
            <>
              {/* Job Details */}
              <CompletedJobDetails jobDetails={jobDetails} />

              {/* Employer Contact */}
              <CompletedEmployerContact jobDetails={jobDetails} />

              {/* Toggle Chips */}
              <CompletedToggleChips
                activeSubTab={activeSubTab}
                setActiveSubTab={setActiveSubTab}
              />

              {activeSubTab === "schedule" && (
                <CompletedSchedule jobDetails={jobDetails} />
              )}

              {activeSubTab === "summary" && (
                <CompletedWorkSummary jobDetails={rawJob} />
              )}

              <StandardButton
                text="Write review"
                style={{
                  backgroundColor: "#000000",
                  marginTop: 20,
                }}
                buttonTextStyle={{
                  minWidth: 120,
                }}
                onPress={() => setIsReviewModalOpen(true)}
              />
            </>
          )}
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

      {/* Review Modal */}
      <ReviewModal
        isReviewModalOpen={isReviewModalOpen}
        closeReviewModal={closeReviewModal}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewFeedback={reviewFeedback}
        setReviewFeedback={setReviewFeedback}
        submitReview={submitReview}
      />
    </ScreenWrapper>
  );
}
