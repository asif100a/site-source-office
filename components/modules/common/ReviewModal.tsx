import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Pressable,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import React from "react";
import { Star, X } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { useCreateReviewMutation } from "@/store/api/reviewApi";

export default function ReviewModal({
  isReviewModalOpen,
  closeReviewModal,
  jobId,
  reviewRating,
  setReviewRating,
  reviewFeedback,
  setReviewFeedback,
}: {
  isReviewModalOpen: boolean;
  closeReviewModal: () => void;
  jobId?: string;
  reviewRating: number;
  setReviewRating: React.Dispatch<React.SetStateAction<number>>;
  reviewFeedback: string;
  setReviewFeedback: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [createReview, { isLoading: isSubmitting }] =
    useCreateReviewMutation();

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    closeReviewModal();
  };

  const canSubmit =
    Boolean(jobId && reviewRating && reviewFeedback.trim()) && !isSubmitting;

  const handleSubmit = async () => {
    if (!jobId || !reviewRating || !reviewFeedback.trim() || isSubmitting) {
      return;
    }

    try {
      await createReview({
        jobId,
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
      closeReviewModal();
    } catch (error) {
      console.error("error creating review: ", error);
      Toast.show({
        type: "error",
        text1: "Review failed",
        text2: "Unable to submit your review. Please try again.",
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

            <Text className="text-neutral-500 text-xs font-bold uppercase mb-2 tracking-wider">
              Your Rating
            </Text>
            {!jobId ? (
              <Text className="text-neutral-400 text-xs font-medium mb-3">
                Unable to find this completed job.
              </Text>
            ) : null}

            <View className="flex-row items-center justify-center gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((rating) => {
                const isActive = jobId ? rating <= reviewRating : false;

                return (
                  <TouchableOpacity
                    key={rating}
                    disabled={!jobId || isSubmitting}
                    onPress={() => setReviewRating(rating)}
                    className={`p-1 ${
                      jobId && !isSubmitting
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
                editable={Boolean(jobId) && !isSubmitting}
                className={`flex-1 text-neutral-900 text-sm leading-5 ${
                  jobId && !isSubmitting ? "" : "opacity-40"
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
