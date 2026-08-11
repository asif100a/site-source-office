import { useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ArrowRight, MessageSquareQuote, Star, Sparkles } from "lucide-react-native";
import { RatingStars, ScreenShell } from "./_components";
import ReviewModal from "@/components/modules/common/ReviewModal";
import { Colors } from "@/constants/Colors";

const reviewers = [
  {
    name: "Jane Cooper",
    date: "20 Apr 2026",
    rating: 5,
    feedback: "Very professional and always arrived on time",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
  },
  {
    name: "Esther Howard",
    date: "20 Apr 2026",
    rating: 5,
    feedback: "Very professional and always arrived on time",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop",
  },
  {
    name: "Brooklyn Simmons",
    date: "20 Apr 2025",
    rating: 5,
    feedback: "Very professional and always arrived on time",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
  },
  {
    name: "Brooklyn Simmons",
    date: "20 Apr 2025",
    rating: 5,
    feedback: "Very professional and always arrived on time",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
  },
];

function ReviewCard({
  name,
  date,
  rating,
  feedback,
  image,
}: {
  name: string;
  date: string;
  rating: number;
  feedback: string;
  image: string;
}) {
  return (
    <View className="rounded-2xl border border-neutral-200 bg-white p-4">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-row items-center gap-3">
          <Image source={{ uri: image }} className="h-11 w-11 rounded-full" />
          <View>
            <Text className="text-sm font-semibold text-neutral-950">
              {name}
            </Text>
            <Text className="mt-0.5 text-xs font-medium text-neutral-500">
              {date}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <View className="flex-row items-center gap-1">
            <Star size={14} color="#FBC02D" fill="#FBC02D" />
            <Text className="text-sm font-semibold text-neutral-900">{rating}</Text>
          </View>
        </View>
      </View>

      <Text className="mt-4 text-sm leading-6 text-neutral-600">{feedback}</Text>
    </View>
  );
}

export default function RatingFeedbackScreenWeb() {
  const bars = [200, 40, 32, 19, 7];
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [submittedReviews, setSubmittedReviews] = useState<typeof reviewers>([]);

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const submitReview = () => {
    if (!reviewRating || !reviewFeedback.trim()) return;

    setSubmittedReviews((currentReviews) => [
      {
        name: "You",
        date: "Just now",
        rating: reviewRating,
        feedback: reviewFeedback.trim(),
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
      },
      ...currentReviews,
    ]);
    setReviewRating(0);
    setReviewFeedback("");
    setIsReviewModalOpen(false);
  };

  const visibleReviews = useMemo(
    () => [...submittedReviews, ...reviewers],
    [submittedReviews],
  );

  return (
    <ScreenShell title="Rating & Feedback">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
              <View className="flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <View className="max-w-3xl gap-4">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                      <Sparkles size={14} color={Colors.common.BRAND} />
                      <Text className="text-xs font-semibold uppercase tracking-[0px] text-neutral-900">
                        Reviews
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                      <View className="h-2 w-2 rounded-full bg-emerald-500" />
                      <Text className="text-xs font-semibold text-neutral-600">
                        300 total reviews
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950">
                      Track your worker reputation.
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      See the overall rating, inspect individual feedback, and
                      write a new review from the web layout while leaving mobile
                      unchanged.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setIsReviewModalOpen(true)}
                  activeOpacity={0.9}
                  className="flex-row items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3.5"
                >
                  <MessageSquareQuote size={18} color="#FFFFFF" />
                  <Text className="text-sm font-semibold text-white">
                    Write review
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.1] gap-4">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                  <View className="flex-row items-start gap-5">
                    <View className="w-28 items-center">
                      <View className="flex-row items-end">
                        <Text className="text-4xl font-semibold text-slate-900">
                          4.1
                        </Text>
                        <Text className="mb-1 text-sm font-semibold text-neutral-400">
                          /5
                        </Text>
                      </View>
                      <RatingStars size={12} />
                      <Text className="mt-1 text-xs text-neutral-400">
                        300 Reviews
                      </Text>
                    </View>

                    <View className="flex-1 gap-2">
                      {bars.map((value, index) => (
                        <View key={value} className="flex-row items-center gap-3">
                          <View className="w-16 flex-row">
                            {Array.from({ length: 5 - index }).map((_, starIndex) => (
                              <Star
                                key={starIndex}
                                size={8}
                                color="#A6AEB7"
                                fill="#A6AEB7"
                              />
                            ))}
                          </View>
                          <View className="h-1 flex-1 rounded-full bg-neutral-200">
                            <View
                              className="h-1 rounded-full bg-slate-400"
                              style={{ width: `${Math.max(8, 80 - index * 13)}%` }}
                            />
                          </View>
                          <Text className="w-8 text-right text-xs text-neutral-500">
                            {String(value).padStart(2, "0")}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setIsReviewModalOpen(true)}
                  style={{ backgroundColor: Colors.common.GRAY_DARK }}
                  className="h-12 items-center justify-center rounded-xl"
                >
                  <Text className="min-w-28 text-base font-semibold text-white">
                    Write Review
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-1 gap-4">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                  <Text className="text-sm font-semibold uppercase tracking-[0px] text-neutral-500">
                    Recent feedback
                  </Text>
                  <Text className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                    {visibleReviews.length} visible reviews
                  </Text>
                  <Text className="mt-2 text-sm leading-6 text-neutral-600">
                    The newest review stays at the top, followed by recent worker
                    feedback from the profile history.
                  </Text>
                </View>

                <View className="gap-4">
                  {visibleReviews.map((review) => (
                    <ReviewCard
                      key={`${review.name}-${review.date}-${review.feedback}`}
                      name={review.name}
                      date={review.date}
                      rating={review.rating}
                      feedback={review.feedback}
                      image={review.image}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <ReviewModal
        isReviewModalOpen={isReviewModalOpen}
        closeReviewModal={closeReviewModal}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewFeedback={reviewFeedback}
        setReviewFeedback={setReviewFeedback}
        submitReview={submitReview}
      />
    </ScreenShell>
  );
}
