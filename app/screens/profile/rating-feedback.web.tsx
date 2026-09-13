import { useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { MessageSquareQuote, Star, Sparkles } from "lucide-react-native";
import { ScreenShell } from "./_components";
import ReviewModal from "@/components/modules/common/ReviewModal";
import { Colors } from "@/constants/Colors";
import { useGetMyJobsQuery } from "@/store/api/jobApi";
import {
  useGetReviewSummaryQuery,
  useGetReviewsQuery,
} from "@/store/api/reviewApi";
import { useGetWorkerProfileQuery } from "@/store/api/workerProfileApi";
import { useGetEmployerProfileQuery } from "@/store/api/employerProfileApi";
import type { RootState } from "@/store/store";
import { getRoleFromToken } from "@/utils/authToken";
import type { UserRole } from "@/constants/Routes";

type ReviewItem = {
  id: string;
  rating: number;
  feedback: string;
  givenAt?: string;
  giverAuth?: { profile?: { name?: string; avatar?: string } };
  giver?: { profile?: { name?: string; avatar?: string } };
};

const normalizeRole = (value: unknown): UserRole =>
  value === "employer" ? "employer" : "worker";

const getResponseData = (response: any) => response?.data?.data ?? response?.data;

const getItems = (response: any) => {
  const data = getResponseData(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.reviews)) return data.reviews;
  if (Array.isArray(data?.jobs)) return data.jobs;
  return [];
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recently";

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
  image?: string;
}) {
  return (
    <View className="rounded-2xl border border-neutral-200 bg-white p-4">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-row items-center gap-3">
          {image ? (
            <Image source={{ uri: image }} className="h-11 w-11 rounded-full" />
          ) : (
            <View className="h-11 w-11 items-center justify-center rounded-full bg-neutral-100">
              <Text className="text-sm font-bold text-neutral-500">
                {name.slice(0, 1).toUpperCase()}
              </Text>
            </View>
          )}
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
  const params = useLocalSearchParams<{ origin?: string }>();
  const token = useSelector((state: RootState) => state.auth.token);
  const userRole = normalizeRole(params.origin ?? getRoleFromToken(token ?? ""));
  const isEmployer = userRole === "employer";
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const workerProfileQuery = useGetWorkerProfileQuery(undefined, {
    skip: isEmployer,
  });
  const employerProfileQuery = useGetEmployerProfileQuery(undefined, {
    skip: !isEmployer,
  });
  const activeProfile = getResponseData(
    isEmployer ? employerProfileQuery.data : workerProfileQuery.data,
  );
  const authId = activeProfile?.authId ?? activeProfile?.auth?.id ?? activeProfile?.id;
  const jobsQuery = useGetMyJobsQuery(
    { page: 1, limit: 100, status: "COMPLETED" },
    { skip: !isEmployer },
  );
  const reviewsQuery = useGetReviewsQuery(
    { authId: authId ?? "" },
    { skip: isEmployer || !authId },
  );
  const summaryQuery = useGetReviewSummaryQuery(
    { authId: authId ?? "" },
    { skip: isEmployer || !authId },
  );
  const jobs = getItems(jobsQuery.data);
  const visibleReviews = getItems(reviewsQuery.data) as ReviewItem[];
  const summary = getResponseData(summaryQuery.data);
  const ratingGroups = summary?.ratingGroups ?? {};
  const totalReviews = Number(summary?.totalReviews ?? visibleReviews.length ?? 0);
  const avgRating = Number(summary?.avgRating ?? 0);
  const ratingRows = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: Number(ratingGroups[String(rating)] ?? 0),
  }));
  const jobOptions = useMemo(
    () =>
      jobs
        .filter((job: any) => job?.id ?? job?._id)
        .map((job: any) => ({
          id: String(job.id ?? job._id),
          label: job.title ?? "Completed job",
          description: `${formatDate(job.startDate)} - ${formatDate(job.endDate)}`,
        })),
    [jobs],
  );

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
  };

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
                        {totalReviews} total reviews
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950">
                      {isEmployer
                        ? "Share feedback for completed jobs."
                        : "Track your worker reputation."}
                    </Text>
                    <Text className="max-w-2xl text-sm md:text-base leading-6 text-neutral-600">
                      {isEmployer
                        ? "Choose a completed job and submit feedback for the worker."
                        : "See your overall rating, rating groups, and recent feedback."}
                    </Text>
                  </View>
                </View>

                {isEmployer ? (
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
                ) : null}
              </View>
            </View>

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.1] gap-4">
                <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                  <View className="flex-row items-start gap-5">
                    <View className="w-28 items-center">
                      <View className="flex-row items-end">
                        <Text className="text-4xl font-semibold text-slate-900">
                          {avgRating.toFixed(1)}
                        </Text>
                        <Text className="mb-1 text-sm font-semibold text-neutral-400">
                          /5
                        </Text>
                      </View>
                      <View className="flex-row">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            size={12}
                            color={
                              rating <= Math.round(avgRating)
                                ? "#FBC02D"
                                : "#D1D5DB"
                            }
                            fill={
                              rating <= Math.round(avgRating)
                                ? "#FBC02D"
                                : "transparent"
                            }
                          />
                        ))}
                      </View>
                      <Text className="mt-1 text-xs text-neutral-400">
                        {totalReviews} Reviews
                      </Text>
                    </View>

                    <View className="flex-1 gap-2">
                      {ratingRows.map(({ rating, count }) => (
                        <View key={rating} className="flex-row items-center gap-3">
                          <View className="w-16 flex-row">
                            {Array.from({ length: rating }).map((_, starIndex) => (
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
                              style={{
                                width: `${
                                  totalReviews
                                    ? (count / totalReviews) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </View>
                          <Text className="w-8 text-right text-xs text-neutral-500">
                            {String(count).padStart(2, "0")}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {isEmployer ? (
                  <TouchableOpacity
                    onPress={() => setIsReviewModalOpen(true)}
                    style={{ backgroundColor: Colors.common.GRAY_DARK }}
                    className="h-12 items-center justify-center rounded-xl"
                  >
                    <Text className="min-w-28 text-base font-semibold text-white">
                      Write Review
                    </Text>
                  </TouchableOpacity>
                ) : null}
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
                      key={review.id}
                      name={
                        review.giverAuth?.profile?.name ??
                        review.giver?.profile?.name ??
                        "Reviewer"
                      }
                      date={formatDate(review.givenAt)}
                      rating={Number(review.rating ?? 0)}
                      feedback={review.feedback}
                      image={
                        review.giverAuth?.profile?.avatar ??
                        review.giver?.profile?.avatar
                      }
                    />
                  ))}
                  {!reviewsQuery.isLoading && visibleReviews.length === 0 ? (
                    <View className="rounded-2xl border border-neutral-200 bg-white p-6">
                      <Text className="text-center text-sm font-semibold text-neutral-500">
                        No reviews yet.
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <ReviewModal
        isReviewModalOpen={isReviewModalOpen}
        closeReviewModal={closeReviewModal}
        jobOptions={jobOptions}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewFeedback={reviewFeedback}
        setReviewFeedback={setReviewFeedback}
        onReviewCreated={() => {
          jobsQuery.refetch();
        }}
      />
    </ScreenShell>
  );
}
