import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { Star } from "lucide-react-native";
import { ScreenShell } from "./_components";
import ReviewModal from "@/components/modules/common/ReviewModal";
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
  giverAuth?: { profile?: { name?: string } };
  giver?: { profile?: { name?: string } };
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

export default function RatingFeedbackScreen() {
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
  const authId =
    getResponseData(
      isEmployer ? employerProfileQuery.data : workerProfileQuery.data,
    )?.authId ??
    getResponseData(
      isEmployer ? employerProfileQuery.data : workerProfileQuery.data,
    )?.auth?.id ??
    getResponseData(
      isEmployer ? employerProfileQuery.data : workerProfileQuery.data,
    )?.id;
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
  const reviews = getItems(reviewsQuery.data) as ReviewItem[];
  const summary = getResponseData(summaryQuery.data);
  // console.log("reviews from the rating feedback screen: ", reviews);
  // console.log("summary from the rating feedback screen: ", summary);
  const ratingGroups = summary?.ratingGroups ?? {};
  const totalReviews = Number(summary?.totalReviews ?? reviews.length ?? 0);
  const avgRating = Number(summary?.avgRating ?? 0);
  const jobOptions = useMemo(
    () =>
      jobs
        .filter((job: any) => job?.id ?? job?._id)
        .map((job: any) => ({
          id: String(job.id ?? job._id),
          label: job.title ?? "Completed job",
          description:
            formatDate(job.startDate) + " - " + formatDate(job.endDate),
        })),
    [jobs],
  );
  const ratingRows = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: Number(ratingGroups[String(rating)] ?? 0),
  }));

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  return (
    <ScreenShell title="Rating & Feedback">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 52 }}
      >
        <View className="flex-row items-center mb-5">
          <View className="w-24 items-center">
            <View className="flex-row items-end">
              <Text className="text-slate-900 text-4xl font-extrabold">
                {avgRating.toFixed(1)}
              </Text>
              <Text className="text-neutral-400 text-sm font-bold mb-1">
                /5
              </Text>
            </View>
            <View className="flex-row">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  size={12}
                  color={rating <= Math.round(avgRating) ? "#FBC02D" : "#D1D5DB"}
                  fill={rating <= Math.round(avgRating) ? "#FBC02D" : "transparent"}
                />
              ))}
            </View>
            <Text className="text-neutral-400 text-xs mt-1">
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
                <View className="flex-1 h-1 bg-neutral-200 rounded-full">
                  <View
                    className="h-1 bg-slate-400 rounded-full"
                    style={{
                      width: `${totalReviews ? (count / totalReviews) * 100 : 0}%`,
                    }}
                  />
                </View>
                <Text className="w-8 text-right text-neutral-500 text-xs">
                  {String(count).padStart(2, "0")}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {isEmployer ? (
          <TouchableOpacity
            onPress={() => setIsReviewModalOpen(true)}
            style={{ backgroundColor: "#1E2933" }}
            className="h-12 rounded-lg items-center justify-center mb-6"
          >
            <Text className="min-w-28 text-white text-base font-semibold">
              Write Review
            </Text>
          </TouchableOpacity>
        ) : null}

        {!isEmployer ? (
          <View className="gap-4">
            {reviewsQuery.isLoading || summaryQuery.isLoading ? (
              <ActivityIndicator color="#1E2933" />
            ) : null}
            {reviews.map((review) => (
              <View
                key={review.id}
                className="rounded-2xl border border-neutral-100 bg-white p-4"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-extrabold text-neutral-950">
                    {review.giverAuth?.profile?.name ??
                      review.giver?.profile?.name ??
                      "Reviewer"}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <Star size={14} color="#FBC02D" fill="#FBC02D" />
                    <Text className="text-sm font-bold text-neutral-900">
                      {Number(review.rating ?? 0).toFixed(1)}
                    </Text>
                  </View>
                </View>
                <Text className="mt-1 text-xs text-neutral-400">
                  {formatDate(review.givenAt)}
                </Text>
                <Text className="mt-3 text-sm leading-6 text-neutral-600">
                  {review.feedback}
                </Text>
              </View>
            ))}
            {!reviewsQuery.isLoading && reviews.length === 0 ? (
              <Text className="rounded-2xl bg-white p-5 text-center text-sm font-semibold text-neutral-500">
                No reviews yet.
              </Text>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      {/* Review Modal */}
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
