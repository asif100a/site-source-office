import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Pressable,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ChevronDown, Star, X } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { useCreateReviewMutation } from "@/store/api/reviewApi";

export type ReviewJobOption = {
  id: string;
  label: string;
  description?: string;
};

export default function ReviewModal({
  isReviewModalOpen,
  closeReviewModal,
  jobId,
  jobOptions = [],
  reviewRating,
  setReviewRating,
  reviewFeedback,
  setReviewFeedback,
  onReviewCreated,
}: {
  isReviewModalOpen: boolean;
  closeReviewModal: () => void;
  jobId?: string;
  jobOptions?: ReviewJobOption[];
  reviewRating: number;
  setReviewRating: React.Dispatch<React.SetStateAction<number>>;
  reviewFeedback: string;
  setReviewFeedback: React.Dispatch<React.SetStateAction<string>>;
  onReviewCreated?: () => void | Promise<void>;
}) {
  const [selectedJobId, setSelectedJobId] = useState("");
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();
  const shouldShowJobPicker = !jobId;
  const selectedJob = jobOptions.find((job) => job.id === selectedJobId);
  const effectiveJobId = jobId ?? selectedJobId;

  useEffect(() => {
    if (!isReviewModalOpen) {
      setIsJobDropdownOpen(false);
      setSelectedJobId("");
    }
  }, [isReviewModalOpen]);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setIsJobDropdownOpen(false);
    closeReviewModal();
  };

  const canSubmit =
    Boolean(effectiveJobId && reviewRating && reviewFeedback.trim()) &&
    !isSubmitting;

  const handleSubmit = async () => {
    if (
      !effectiveJobId ||
      !reviewRating ||
      !reviewFeedback.trim() ||
      isSubmitting
    ) {
      return;
    }

    try {
      await createReview({
        jobId: effectiveJobId,
        rating: reviewRating,
        feedback: reviewFeedback.trim(),
      }).unwrap();

      Toast.show({
        type: "success",
        text1: "Review submitted",
        text2: "Thanks for sharing your feedback.",
      });

      setReviewRating(0);
      setReviewFeedback("");
      setSelectedJobId("");
      setIsJobDropdownOpen(false);
      await onReviewCreated?.();
      closeReviewModal();
    } catch (error: any) {
      console.error("error creating review: ", error);
      Toast.show({
        type: "error",
        text1: "Review failed",
        text2:
          error?.message ??
          error?.data?.message ??
          "Unable to submit your review. Please try again.",
      });
    }
  };

  return (
    <Modal
      visible={isReviewModalOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <Pressable
          onPress={handleClose}
          disabled={isSubmitting}
          className="flex-1 bg-neutral-500/50 justify-center px-5"
        >
          <View
            className="bg-white rounded-2xl p-5"
            onStartShouldSetResponder={() => true}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-neutral-950 text-lg font-extrabold">
                Write Review
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                disabled={isSubmitting}
                className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center active:opacity-75"
              >
                <X size={16} color="#333333" />
              </TouchableOpacity>
            </View>

            {shouldShowJobPicker ? (
              <>
                <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Completed Job
                </Text>
                <View className="relative z-20 mb-5">
                  <TouchableOpacity
                    onPress={() => setIsJobDropdownOpen((current) => !current)}
                    disabled={isSubmitting}
                    className="flex-row items-center justify-between rounded-2xl border border-neutral-200/80 bg-white px-4 py-3.5 active:opacity-85"
                  >
                    <View className="flex-1 pr-3">
                      <Text
                        className={`text-sm font-semibold ${
                          selectedJob ? "text-neutral-900" : "text-neutral-400"
                        }`}
                      >
                        {selectedJob?.label ?? "Select a completed job"}
                      </Text>
                      {selectedJob?.description ? (
                        <Text className="mt-1 text-[11px] font-medium text-neutral-500">
                          {selectedJob.description}
                        </Text>
                      ) : null}
                    </View>
                    <ChevronDown size={18} color="#737373" />
                  </TouchableOpacity>

                  {isJobDropdownOpen ? (
                    <View className="mt-2 max-h-56 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
                      <ScrollView showsVerticalScrollIndicator={false}>
                        {jobOptions.length === 0 ? (
                          <View className="px-4 py-3.5">
                            <Text className="text-sm font-semibold text-neutral-400">
                              No jobs found
                            </Text>
                          </View>
                        ) : null}

                        {jobOptions.map((job) => {
                          const isSelected = selectedJobId === job.id;

                          return (
                            <TouchableOpacity
                              key={job.id}
                              onPress={() => {
                                setSelectedJobId(job.id);
                                setIsJobDropdownOpen(false);
                              }}
                              className={`px-4 py-3.5 active:bg-neutral-50 ${
                                isSelected ? "bg-neutral-100" : "bg-white"
                              }`}
                            >
                              <Text className="text-sm font-semibold text-neutral-900">
                                {job.label}
                              </Text>
                              {job.description ? (
                                <Text className="mt-1 text-xs font-medium text-neutral-500">
                                  {job.description}
                                </Text>
                              ) : null}
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  ) : null}
                </View>
              </>
            ) : null}

            <Text className="text-neutral-500 text-xs font-bold uppercase mb-2 tracking-wider">
              Your Rating
            </Text>
            {!effectiveJobId ? (
              <Text className="text-neutral-400 text-xs font-medium mb-3">
                {shouldShowJobPicker
                  ? "Pick a completed job first, then choose your stars."
                  : "Unable to find this completed job."}
              </Text>
            ) : null}

            <View className="flex-row items-center justify-center gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((rating) => {
                const isActive = effectiveJobId
                  ? rating <= reviewRating
                  : false;

                return (
                  <TouchableOpacity
                    key={rating}
                    disabled={!effectiveJobId || isSubmitting}
                    onPress={() => setReviewRating(rating)}
                    className={`p-1 ${
                      effectiveJobId && !isSubmitting
                        ? "active:opacity-75"
                        : "opacity-40"
                    }`}
                  >
                    <Star
                      size={38}
                      color={isActive ? "#FBC02D" : "#D1D5DB"}
                      fill={isActive ? "#FBC02D" : "transparent"}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="text-neutral-500 text-xs font-bold uppercase mb-2 tracking-wider">
              Feedback
            </Text>
            <View className="bg-white border border-neutral-200/80 rounded-2xl px-4 py-3 min-h-[130px] mb-5">
              <TextInput
                value={reviewFeedback}
                onChangeText={setReviewFeedback}
                placeholder="Write your feedback..."
                placeholderTextColor="#A3A3A3"
                multiline
                textAlignVertical="top"
                editable={Boolean(effectiveJobId) && !isSubmitting}
                className={`flex-1 text-neutral-900 text-sm leading-5 ${
                  effectiveJobId && !isSubmitting ? "" : "opacity-40"
                }`}
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleClose}
                disabled={isSubmitting}
                className="flex-1 h-12 rounded-lg border border-neutral-200 items-center justify-center active:opacity-80"
              >
                <Text className="text-neutral-800 text-sm font-extrabold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => void handleSubmit()}
                disabled={!canSubmit}
                style={{
                  backgroundColor: canSubmit ? "#1E2933" : "#CBD5E1",
                }}
                className="flex-1 h-12 rounded-lg items-center justify-center active:opacity-90"
              >
                <Text className="text-white text-sm font-extrabold">
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
