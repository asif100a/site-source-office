import { useState } from "react";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Headphones,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react-native";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import MessageSupportModal from "@/components/modules/common/MessageSupportModal";

type CompletedTab = "schedule" | "summary";

type JobDetails = {
  title: string;
  company: string;
  statusBadge: string;
  location: string;
  team: string;
  duration: string;
  startDate: string;
  endDate: string;
  hours: string;
  daysPerWeek: string;
  nextInvoice: string;
};

type ReviewItem = {
  id: string;
  name: string;
  date: string;
  rating: number;
  feedback: string;
};

const JOB_DETAILS: JobDetails = {
  title: "Labourer",
  company: "Tech Innovators Inc.",
  statusBadge: "Day 20 of 20",
  location: "Shoreditch - 1.2 mi away",
  team: "2 developers, 1 designer",
  duration: "12 Jun - 1 month",
  startDate: "3 Jun 2026",
  endDate: "28 Jun 2026",
  hours: "07:30 - 17:00",
  daysPerWeek: "5 Days",
  nextInvoice: "Friday 7 Jun",
};

const WORK_SUMMARY_ROWS = [
  { week: "Week 1", dates: "12th - 16th July", status: "Completed" },
  { week: "Week 2", dates: "19th - 23rd July", status: "Approved" },
  { week: "Week 3", dates: "26th - 30th July", status: "Approved" },
  { week: "Week 4", dates: "2nd - 6th August", status: "Approved" },
];

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "review-1",
    name: "Jane Cooper",
    date: "20 Apr 2026",
    rating: 5,
    feedback: "Clear brief, good communication, and everything on site was ready on time.",
  },
  {
    id: "review-2",
    name: "Esther Howard",
    date: "14 Apr 2026",
    rating: 5,
    feedback: "Well managed job with quick support whenever site details changed.",
  },
];

function SectionTitle({
  title,
  detail,
}: {
  title: string;
  detail?: string;
}) {
  return (
    <View className="mb-3 flex-row items-center justify-between gap-4">
      <Text className="text-base font-extrabold text-neutral-900">{title}</Text>
      {detail ? (
        <Text className="text-xs font-medium text-neutral-400">{detail}</Text>
      ) : null}
    </View>
  );
}

function Hero({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <View className="rounded-[28px] border border-neutral-200 bg-white p-6 md:p-8">
      <View className="flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <View className="max-w-3xl gap-4">
          <View className="flex-row flex-wrap items-center gap-2">
            <View className="flex-row items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
              <Sparkles size={14} color={Colors.common.BRAND} />
              <Text className="text-xs font-bold uppercase tracking-[0px] text-neutral-900">
                Completed job
              </Text>
            </View>
            <View className="flex-row items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
              <View className="h-2 w-2 rounded-full bg-emerald-500" />
              <Text className="text-xs font-semibold text-emerald-700">
                Finished successfully
              </Text>
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-3xl font-black tracking-tight text-neutral-950 md:text-4xl">
              Completed Jobs
            </Text>
            <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
              Review the finished role, check the recorded schedule, and leave feedback
              from a web layout while the mobile screen stays untouched.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.88}
          className="flex-row items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5"
        >
          <ArrowLeft size={18} color="#111827" />
          <Text className="text-sm font-semibold text-neutral-900">Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function JobSummaryCard() {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <View className="mb-4 flex-row items-start justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <Briefcase size={22} color="#FFFFFF" />
          </View>
          <View>
            <Text className="text-base font-extrabold text-neutral-950">
              {JOB_DETAILS.title}
            </Text>
            <Text className="text-xs font-semibold text-neutral-500">
              {JOB_DETAILS.company}
            </Text>
          </View>
        </View>

        <View className="rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1">
          <Text className="text-[10px] font-bold text-emerald-600">
            {JOB_DETAILS.statusBadge}
          </Text>
        </View>
      </View>

      <View className="gap-2.5 border-t border-neutral-100 pt-3">
        <View className="flex-row items-center gap-2">
          <MapPin size={14} color="#C81E1E" />
          <Text className="text-xs text-neutral-500">{JOB_DETAILS.location}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Users size={14} color="#737373" />
          <Text className="text-xs text-neutral-500">{JOB_DETAILS.team}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Calendar size={14} color="#737373" />
          <Text className="text-xs text-neutral-500">{JOB_DETAILS.duration}</Text>
        </View>
      </View>
    </View>
  );
}

function TabSwitch({
  activeTab,
  setActiveTab,
}: {
  activeTab: CompletedTab;
  setActiveTab: (tab: CompletedTab) => void;
}) {
  const tabs = [
    { key: "schedule" as const, label: "Schedule" },
    { key: "summary" as const, label: "Work Summary" },
  ];

  return (
    <View className="flex-row flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.88}
            className={`rounded-lg px-4 py-2 ${
              isActive ? "bg-neutral-900" : "border border-neutral-200 bg-white"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                isActive ? "text-white" : "text-neutral-500"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function ScheduleCard() {
  const rows = [
    { label: "Start Date", value: JOB_DETAILS.startDate },
    { label: "End date", value: JOB_DETAILS.endDate },
    { label: "Hours", value: JOB_DETAILS.hours },
    { label: "Per Week", value: JOB_DETAILS.daysPerWeek },
    { label: "Next invoice", value: JOB_DETAILS.nextInvoice },
  ];

  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Project Schedule" />
      <View className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white">
        {rows.map((item, index) => (
          <View
            key={item.label}
            className={`flex-row items-center justify-between px-4 py-4 ${
              index < rows.length - 1 ? "border-b border-neutral-50" : ""
            }`}
          >
            <Text className="text-sm font-semibold text-neutral-400">
              {item.label}
            </Text>
            <Text className="text-sm font-extrabold text-neutral-800">
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function WorkSummaryCard() {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Work Summary" />
      <View className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
        {WORK_SUMMARY_ROWS.map((item, index) => (
          <View
            key={`${item.week}-${index}`}
            className={`flex-row items-center justify-between p-4 ${
              index < WORK_SUMMARY_ROWS.length - 1 ? "border-b border-neutral-50" : ""
            }`}
          >
            <View>
              <Text className="text-sm font-extrabold text-neutral-800">
                {item.week}
              </Text>
              <Text className="mt-0.5 text-xs font-semibold text-neutral-400">
                {item.dates}
              </Text>
            </View>

            <View
              className={`rounded-full px-3 py-1 ${
                item.status === "Approved" ? "bg-green-50" : "bg-neutral-100"
              }`}
            >
              <Text
                className={`text-[10px] font-extrabold ${
                  item.status === "Approved" ? "text-green-600" : "text-neutral-500"
                }`}
              >
                {item.status}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function RatingOverviewCard({
  reviewCount,
  onWriteReview,
}: {
  reviewCount: number;
  onWriteReview: () => void;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Rating & Feedback" />
      <View className="flex-row items-center gap-4">
        <View className="items-center">
          <Text className="text-4xl font-extrabold text-neutral-900">5.0</Text>
          <Text className="text-xs text-neutral-400">/5</Text>
          <View className="mt-2 flex-row gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} size={16} color="#FBBF24" fill="#FBBF24" />
            ))}
          </View>
          <Text className="mt-2 text-xs text-neutral-400">
            {reviewCount} reviews
          </Text>
        </View>

        <View className="flex-1 gap-2">
          {[96, 18, 7, 3, 1].map((value, index) => (
            <View
              key={`${value}-${index}`}
              className="flex-row items-center gap-2"
            >
              <Text className="w-4 text-right text-xs text-neutral-400">
                {5 - index}
              </Text>
              <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <View
                  className="h-full rounded-full bg-slate-500"
                  style={{ width: `${Math.max(12, value)}%` }}
                />
              </View>
              <Text className="w-8 text-right text-xs text-neutral-400">
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        onPress={onWriteReview}
        style={{ backgroundColor: Colors.common.GRAY_DARK }}
        className="mt-4 w-full items-center justify-center rounded-xl py-4 active:opacity-90"
      >
        <Text className="text-sm font-extrabold text-white">Write Review</Text>
      </TouchableOpacity>
    </View>
  );
}

function ReviewComposerCard({
  reviewRating,
  setReviewRating,
  reviewFeedback,
  setReviewFeedback,
  onSubmit,
  onCancel,
}: {
  reviewRating: number;
  setReviewRating: (value: number) => void;
  reviewFeedback: string;
  setReviewFeedback: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Write Review" />

      <View className="mb-4 mt-2 flex-row items-center justify-center gap-2">
        {Array.from({ length: 5 }).map((_, index) => {
          const value = index + 1;
          const isActive = value <= reviewRating;

          return (
            <TouchableOpacity
              key={value}
              onPress={() => setReviewRating(value)}
              className="p-1"
              activeOpacity={0.85}
            >
              <Star
                size={40}
                color={isActive ? "#FDBA3F" : "#D1D5DB"}
                fill={isActive ? "#FDBA3F" : "transparent"}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="min-h-[220px] rounded-2xl border border-neutral-200/80 bg-white px-4 py-3">
        <TextInput
          value={reviewFeedback}
          onChangeText={setReviewFeedback}
          placeholder="Share your feedback about this completed job"
          placeholderTextColor="#6B7280"
          multiline
          textAlignVertical="top"
          className="flex-1 text-sm leading-6 text-neutral-900"
        />
      </View>

      <View className="mt-5 flex-row gap-3">
        <TouchableOpacity
          onPress={onSubmit}
          disabled={!reviewRating || !reviewFeedback.trim()}
          style={{
            backgroundColor:
              reviewRating && reviewFeedback.trim()
                ? Colors.common.GRAY_DARK
                : "#CBD5E1",
          }}
          className="flex-1 items-center justify-center rounded-2xl py-4 active:opacity-90"
        >
          <Text className="text-sm font-extrabold text-white">Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onCancel}
          className="flex-1 items-center justify-center rounded-2xl border border-neutral-200 bg-white py-4 active:opacity-75"
        >
          <Text className="text-sm font-extrabold text-neutral-900">Discard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ReviewsCard({
  reviews,
}: {
  reviews: ReviewItem[];
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Reviews" detail={`${reviews.length} entries`} />
      <View className="gap-3">
        {reviews.map((item) => (
          <View
            key={item.id}
            className="rounded-2xl border border-neutral-200/80 bg-white p-4"
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 flex-row items-center gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-neutral-100">
                  <Text className="text-xs font-bold text-neutral-700">
                    {item.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-neutral-900">
                    {item.name}
                  </Text>
                  <View className="mt-1 flex-row items-center gap-1">
                    <Star size={13} color="#FBBF24" fill="#FBBF24" />
                    <Text className="text-xs font-bold text-neutral-900">
                      {item.rating.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-xs text-neutral-400">{item.date}</Text>
            </View>

            <Text className="mt-3 text-sm leading-6 text-neutral-600">
              {item.feedback}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ActionCard({
  onSupport,
  onBack,
}: {
  onSupport: () => void;
  onBack: () => void;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <Text className="text-sm font-bold uppercase tracking-[0px] text-neutral-500">
        Quick actions
      </Text>
      <Text className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
        Follow up after completion
      </Text>
      <Text className="mt-2 text-sm leading-6 text-neutral-600">
        Leave feedback, contact support, or return to the previous job list from
        this desktop action panel.
      </Text>

      <View className="mt-5 gap-3">
        <TouchableOpacity
          onPress={onSupport}
          style={{ backgroundColor: Colors.common.GRAY_DARK }}
          className="items-center justify-center rounded-2xl py-4 active:opacity-90"
        >
          <Text className="text-sm font-semibold text-white">Message Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onBack}
          className="items-center justify-center rounded-2xl border border-neutral-200 bg-white py-4 active:opacity-75"
        >
          <Text className="text-sm font-medium text-neutral-700">Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CompletedJobDetailWebScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CompletedTab>("schedule");
  const [showReviewComposer, setShowReviewComposer] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportModalState, setSupportModalState] = useState<"form" | "submitted">(
    "form",
  );

  const handleBack = () => {
    router.back();
  };

  const handleSubmitReview = () => {
    if (!reviewRating || !reviewFeedback.trim()) {
      return;
    }

    setReviews((current) => [
      {
        id: `review-${current.length + 1}`,
        name: "You",
        date: "Just now",
        rating: reviewRating,
        feedback: reviewFeedback.trim(),
      },
      ...current,
    ]);
    setReviewRating(0);
    setReviewFeedback("");
    setShowReviewComposer(false);
  };

  const handleOpenSupport = () => {
    setSupportModalState("form");
    setShowSupportModal(true);
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 64 }}
      >
        <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
          <View className="mx-auto w-full max-w-7xl gap-6">
            <Hero onBack={handleBack} />

            <View className="flex-col gap-6 xl:flex-row">
              <View className="flex-[1.45] gap-4">
                <JobSummaryCard />

                <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                  <SectionTitle title="Completed workspace" />
                  <TabSwitch activeTab={activeTab} setActiveTab={setActiveTab} />
                </View>

                {activeTab === "schedule" ? <ScheduleCard /> : null}
                {activeTab === "summary" ? <WorkSummaryCard /> : null}

                <ReviewsCard reviews={reviews} />
              </View>

              <View className="flex-1 gap-4">
                {showReviewComposer ? (
                  <ReviewComposerCard
                    reviewRating={reviewRating}
                    setReviewRating={setReviewRating}
                    reviewFeedback={reviewFeedback}
                    setReviewFeedback={setReviewFeedback}
                    onSubmit={handleSubmitReview}
                    onCancel={() => {
                      setShowReviewComposer(false);
                      setReviewRating(0);
                      setReviewFeedback("");
                    }}
                  />
                ) : (
                  <RatingOverviewCard
                    reviewCount={reviews.length}
                    onWriteReview={() => setShowReviewComposer(true)}
                  />
                )}

                <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                  <View className="flex-row items-center gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                      <ShieldCheck size={18} color={Colors.common.BRAND} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-neutral-900">
                        Completed work summary
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-neutral-600">
                        Keep the final job record visible while reviews and follow-up
                        actions stay accessible on the right.
                      </Text>
                    </View>
                  </View>
                </View>

                <ActionCard onSupport={handleOpenSupport} onBack={handleBack} />

                <TouchableOpacity
                  onPress={handleOpenSupport}
                  activeOpacity={0.9}
                  className="flex-row items-center justify-between rounded-[24px] bg-neutral-950 px-5 py-5"
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-xs font-bold uppercase tracking-[0px] text-white/60">
                      Need support?
                    </Text>
                    <Text className="mt-2 text-lg font-black tracking-tight text-white">
                      Open a support ticket
                    </Text>
                  </View>
                  <Headphones size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <MessageSupportModal
        showSupportModal={showSupportModal}
        setShowSupportModal={setShowSupportModal}
        supportModalState={supportModalState}
        setSupportModalState={setSupportModalState}
      />
    </View>
  );
}
