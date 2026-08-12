import React, { useState, type ReactNode } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import {
  Clock3,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  ArrowLeft,
  ChevronDown,
} from "lucide-react-native";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { normalizeUserRole } from "@/constants/Routes";
import WorkerRatingStars from "@/components/modules/worker/worker-details/_ui/WorkerRatingStars";
import PLACEHOLDER_USER from "@/assets/images/placeholder/placeholder-user.png";

type WorkerDetail = {
  name: string;
  role: string;
  status: string;
  rating: string;
  reviews: string;
  location: string;
  stats: Array<{ label: string; value: string }>;
  about: string;
  documents: Array<{ id: string; name: string; size: string }>;
  workHistory: Array<{
    id: string;
    title: string;
    company: string;
    duration: string;
    rating: string;
  }>;
  feedback: Array<{
    id: string;
    name: string;
    date: string;
    text: string;
    rating: string;
  }>;
};

const WORKER_DETAILS: Record<string, WorkerDetail> = {
  "1": {
    name: "James Mitchell",
    role: "Groundworker",
    status: "Available Now",
    rating: "4.8",
    reviews: "142 reviews",
    location: "Shoreditch - 2.4 mi away",
    stats: [
      { label: "Jobs Completed", value: "87" },
      { label: "Reliability", value: "98%" },
      { label: "Repeat Hires", value: "34" },
    ],
    about:
      "Highly experienced groundworker with over 8 years in the industry. Specialized in site preparation, drainage systems, and structural foundations. Known for punctuality and a focus on safety standards.",
    documents: [
      { id: "doc-1", name: "CSCS Gold Card", size: "1.1 MB" },
      { id: "doc-2", name: "CSCS Gold Card", size: "1.1 MB" },
      { id: "doc-3", name: "CSCS Gold Card", size: "1.1 MB" },
    ],
    workHistory: [
      {
        id: "wh-1",
        title: "Lead Groundworker",
        company: "BuildRight Group",
        duration: "3 months",
        rating: "5.0",
      },
      {
        id: "wh-2",
        title: "Groundworker",
        company: "Northline Builders",
        duration: "1 year",
        rating: "4.9",
      },
    ],
    feedback: [
      {
        id: "fb-1",
        name: "Jane Cooper",
        date: "20 Apr 2026",
        text: "Very professional and always arrived on time.",
        rating: "5.00",
      },
      {
        id: "fb-2",
        name: "Esther Howard",
        date: "20 Apr 2026",
        text: "Very professional and always arrived on time.",
        rating: "5.00",
      },
    ],
  },
  empty: {
    name: "",
    role: "",
    status: "",
    rating: "",
    reviews: "",
    location: "",
    stats: [],
    about: "",
    documents: [],
    workHistory: [],
    feedback: [],
  },
};

WORKER_DETAILS["2"] = WORKER_DETAILS["1"];
WORKER_DETAILS["3"] = WORKER_DETAILS["1"];

const TIMESHEET_WEEKS = [
  { id: "week-1", title: "Week 1", range: "12th - 16th July" },
  { id: "week-2", title: "Week 2", range: "19th - 23rd July" },
  { id: "week-3", title: "Week 3", range: "26th - 30th July" },
  { id: "week-4", title: "Week 4", range: "2nd - 6th August" },
];

const WEEK_DAY_OPTIONS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
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

function EmptyStateCard() {
  return (
    <View className="flex-1 items-center justify-center px-6 py-16">
      <View className="w-full max-w-[360px] items-center rounded-3xl border border-neutral-100 bg-white p-8 shadow-sm">
        <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-orange-50">
          <MessageCircle size={34} color={Colors.common.BRAND} />
        </View>
        <Text className="text-xl font-extrabold text-neutral-900">
          No reviews yet
        </Text>
        <Text className="mt-3 text-center text-sm leading-6 text-neutral-500">
          Be the first to share your thoughts and help others decide.
        </Text>
      </View>
    </View>
  );
}

function HeroCard({
  worker,
  title,
  subtitle,
  onBack,
}: {
  worker: WorkerDetail;
  title: string;
  subtitle: string;
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
                Worker details
              </Text>
            </View>
            <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
              <View className="h-2 w-2 rounded-full bg-emerald-500" />
              <Text className="text-xs font-semibold text-neutral-600">
                {worker.status}
              </Text>
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-3xl md:text-4xl font-black tracking-tight text-neutral-950">
              {title}
            </Text>
            <Text className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
              {subtitle}
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

function ProfileCard({ worker }: { worker: WorkerDetail }) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <View className="items-center">
        <View className="relative">
          <Image
            source={PLACEHOLDER_USER}
            style={{ width: 96, height: 96 }}
            className="rounded-full"
          />
          <View className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1">
            <Text className="text-[10px] font-bold text-emerald-700">
              {worker.status}
            </Text>
          </View>
        </View>

        <Text className="mt-6 text-center text-[28px] font-extrabold text-neutral-900">
          {worker.name}
        </Text>
        <Text className="mt-1 text-base text-neutral-500">{worker.role}</Text>

        <View className="mt-3 flex-row items-center gap-2">
          <WorkerRatingStars rating={worker.rating} />
          <Text className="text-sm font-medium text-neutral-700">
            <Text className="font-extrabold">{worker.rating}</Text> (
            {worker.reviews})
          </Text>
        </View>

        <View className="mt-4 flex-row items-center gap-2">
          <MapPin size={14} color="#C81E1E" />
          <Text className="text-sm font-medium text-neutral-500">
            {worker.location}
          </Text>
        </View>
      </View>
    </View>
  );
}

function StatsCard({ worker }: { worker: WorkerDetail }) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <View className="flex-row">
        {worker.stats.map((item, index) => (
          <View
            key={item.label}
            className={`flex-1 items-center py-2 ${
              index < worker.stats.length - 1 ? "border-r border-neutral-100" : ""
            }`}
          >
            <Text className="text-3xl font-extrabold text-neutral-900">
              {item.value}
            </Text>
            <Text className="mt-1 text-center text-[11px] text-neutral-500">
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function DocumentsCard({ worker }: { worker: WorkerDetail }) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Documents" />
      <View className="flex-row flex-wrap gap-3">
        {worker.documents.map((document) => (
          <View
            key={document.id}
            className="min-w-[170px] flex-1 rounded-2xl border border-neutral-200/80 bg-white p-4"
          >
            <View className="mb-3 h-9 w-9 items-center justify-center rounded-xl bg-red-50">
              <Text className="text-sm font-bold text-rose-500">PDF</Text>
            </View>
            <Text className="text-sm font-bold text-neutral-900" numberOfLines={1}>
              {document.name}
            </Text>
            <Text className="mt-1 text-[11px] text-neutral-400">
              {document.size}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function WorkHistoryCard({ worker }: { worker: WorkerDetail }) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Work History" detail="Recent roles" />
      <View className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
        {worker.workHistory.map((item, index) => (
          <View
            key={item.id}
            className={`flex-row items-start justify-between px-4 py-4 ${
              index < worker.workHistory.length - 1
                ? "border-b border-neutral-100"
                : ""
            }`}
          >
            <View className="flex-1 pr-3">
              <Text className="text-sm font-bold text-neutral-900">
                {item.title}
              </Text>
              <Text className="mt-0.5 text-xs text-neutral-500">
                {item.company} - {item.duration}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Star size={14} color="#FBBF24" fill="#FBBF24" />
              <Text className="text-sm font-extrabold text-neutral-900">
                {item.rating}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function RatingSummaryCard({
  worker,
  onWriteReview,
}: {
  worker: WorkerDetail;
  onWriteReview: () => void;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Rating & Feedback" />
      <View className="flex-row items-center gap-4">
        <View className="items-center">
          <Text className="text-4xl font-extrabold text-neutral-900">
            {worker.rating}
          </Text>
          <Text className="text-xs text-neutral-400">/5</Text>
          <View className="mt-2">
            <WorkerRatingStars rating={worker.rating} />
          </View>
          <Text className="mt-2 text-xs text-neutral-400">{worker.reviews}</Text>
        </View>

        <View className="flex-1 gap-2">
          {[200, 40, 32, 19, 7].map((value, index) => (
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
                  style={{ width: `${Math.max(15, value / 2)}%` }}
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

function ReviewsCard({ worker }: { worker: WorkerDetail }) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Reviews" detail={`${worker.feedback.length} entries`} />
      <View className="gap-3">
        {worker.feedback.map((item) => (
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
                      {item.rating}
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-xs text-neutral-400">{item.date}</Text>
            </View>
            <Text className="mt-3 text-sm leading-6 text-neutral-600">
              {item.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ReviewComposerCard({
  reviewRating,
  setReviewRating,
  reviewText,
  setReviewText,
  onSubmit,
  onDiscard,
}: {
  reviewRating: number;
  setReviewRating: (rating: number) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  onSubmit: () => void;
  onDiscard: () => void;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="Write Review" />
      <View className="mb-4 mt-2 flex-row items-center justify-center gap-2">
        {Array.from({ length: 5 }).map((_, index) => {
          const value = index + 1;
          const active = value <= reviewRating;

          return (
            <TouchableOpacity
              key={value}
              onPress={() => setReviewRating(value)}
              className="p-1"
              activeOpacity={0.85}
            >
              <Star
                size={40}
                color={active ? "#FDBA3F" : "#D1D5DB"}
                fill={active ? "#FDBA3F" : "transparent"}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="min-h-[220px] rounded-2xl border border-neutral-200/80 bg-white px-4 py-3">
        <TextInput
          value={reviewText}
          onChangeText={setReviewText}
          placeholder="What did you think?"
          placeholderTextColor="#6B7280"
          multiline
          textAlignVertical="top"
          className="flex-1 text-sm leading-6 text-neutral-900"
        />
      </View>

      <View className="mt-5 flex-row gap-3">
        <TouchableOpacity
          onPress={onSubmit}
          style={{ backgroundColor: Colors.common.GRAY_DARK }}
          className="flex-1 items-center justify-center rounded-2xl py-4 active:opacity-90"
        >
          <Text className="text-sm font-extrabold text-white">Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDiscard}
          className="flex-1 items-center justify-center rounded-2xl border border-neutral-200 bg-white py-4 active:opacity-75"
        >
          <Text className="text-sm font-extrabold text-neutral-900">
            Discard
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AboutCard({ worker }: { worker: WorkerDetail }) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <SectionTitle title="About" />
      <Text className="text-sm leading-6 text-neutral-600">{worker.about}</Text>
    </View>
  );
}

function EmployerTimesheetCard({
  selectedWeek,
  isWeekDropdownOpen,
  onToggleWeekDropdown,
  onSelectWeek,
}: {
  selectedWeek: string;
  isWeekDropdownOpen: boolean;
  onToggleWeekDropdown: () => void;
  onSelectWeek: (weekDay: string) => void;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-base font-medium text-neutral-900">
            Update Timesheet
          </Text>
          <Text className="mt-1 text-sm text-neutral-500">Day 3 of 20</Text>
        </View>
        <View className="rounded-full bg-[#FFF1E9] px-2.5 py-1">
          <Text
            style={{ color: Colors.common.BRAND }}
            className="text-xs font-medium"
          >
            Approval queue
          </Text>
        </View>
      </View>

      <View className="mb-4">
        <Text className="mb-2 text-xs font-medium text-neutral-500">Week</Text>
        <TouchableOpacity
          onPress={onToggleWeekDropdown}
          className="min-h-12 flex-row items-center justify-between rounded-xl border border-neutral-200 px-3 py-3 active:opacity-80"
        >
          <Text
            className={`text-sm ${
              selectedWeek === "Select Week"
                ? "text-neutral-400"
                : "text-neutral-800"
            }`}
          >
            {selectedWeek}
          </Text>
          <ChevronDown size={16} color="#737373" />
        </TouchableOpacity>

        {isWeekDropdownOpen ? (
          <View className="mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white">
            {WEEK_DAY_OPTIONS.map((weekDay, index) => (
              <TouchableOpacity
                key={weekDay}
                onPress={() => onSelectWeek(weekDay)}
                className={`px-3 py-3 active:bg-neutral-50 ${
                  index < WEEK_DAY_OPTIONS.length - 1
                    ? "border-b border-neutral-100"
                    : ""
                }`}
              >
                <Text className="text-sm font-medium text-neutral-800">
                  {weekDay}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>

      <View className="gap-3">
        {TIMESHEET_WEEKS.map((week) => (
          <View
            key={week.id}
            className="flex-row items-center justify-between rounded-2xl border border-neutral-100 px-4 py-3"
          >
            <View className="flex-1 pr-3">
              <Text className="text-base font-medium text-slate-800">
                {week.title}
              </Text>
              <Text className="mt-0.5 text-sm text-slate-400">
                {week.range}
              </Text>
            </View>

            <TouchableOpacity className="rounded-xl border border-neutral-200 px-4 py-2 active:opacity-80">
              <Text className="text-xs font-medium text-neutral-500">
                Approve
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

function EmployerActionsCard({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <Text className="text-sm font-bold uppercase tracking-[0px] text-neutral-500">
        Employer view
      </Text>
      <Text className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
        Review and approve
      </Text>
      <Text className="mt-2 text-sm leading-6 text-neutral-600">
        This desktop version keeps the worker summary visible while approval work
        stays on the right.
      </Text>

      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.88}
        className="mt-5 flex-row items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-4"
      >
        <Text className="text-sm font-semibold text-neutral-900">Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function WorkerActionsCard({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
      <Text className="text-sm font-bold uppercase tracking-[0px] text-neutral-500">
        Quick actions
      </Text>
      <Text className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
        Accept or decline
      </Text>
      <Text className="mt-2 text-sm leading-6 text-neutral-600">
        The mobile sticky footer becomes a desktop action card so the page stays
        balanced on wider screens.
      </Text>

      <View className="mt-5 gap-3">
        <TouchableOpacity
          onPress={onAccept}
          style={{ backgroundColor: Colors.common.GRAY_DARK }}
          className="items-center justify-center rounded-2xl py-4 active:opacity-90"
        >
          <Text className="text-sm font-extrabold text-white">Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDecline}
          className="items-center justify-center rounded-2xl border border-neutral-200 bg-white py-4 active:opacity-75"
        >
          <Text className="text-sm font-extrabold text-neutral-900">
            Decline
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function WorkerDetailsWebScreen() {
  const router = useRouter();
  const { id, origin } = useLocalSearchParams<{ id?: string; origin?: string }>();
  const workerId = Array.isArray(id) ? id[0] : id;
  const originRoute = Array.isArray(origin) ? origin[0] : origin;
  const worker = workerId ? WORKER_DETAILS[workerId] : undefined;
  const showEmptyState = !worker || !worker.name;
  const isEmployerView = normalizeUserRole(originRoute) === "employer";

  const [showReviewComposer, setShowReviewComposer] = useState(false);
  const [reviewRating, setReviewRating] = useState(4);
  const [reviewText, setReviewText] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("Select Week");
  const [isWeekDropdownOpen, setIsWeekDropdownOpen] = useState(false);

  const goBackToOrigin = () => {
    router.back();
  };

  const closeReviewComposer = () => {
    setShowReviewComposer(false);
    setReviewText("");
    setReviewRating(4);
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar style="dark" />
      {showEmptyState ? (
        <EmptyStateCard />
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 64 }}
        >
          <View className="px-6 pt-6 md:px-10 xl:px-12 md:pt-8">
            <View className="mx-auto w-full max-w-7xl gap-6">
              <HeroCard
                worker={worker}
                title={worker.name}
                subtitle={
                  isEmployerView
                    ? "Review this worker profile, check availability, and manage timesheet approval from a desktop layout."
                    : "Browse the worker profile, work history, and reviews in a layout designed for the web while leaving mobile unchanged."
                }
                onBack={goBackToOrigin}
              />

              {isEmployerView ? (
                <View className="flex-col gap-6 xl:flex-row">
                  <View className="flex-[1.25] gap-4">
                    <ProfileCard worker={worker} />
                  </View>

                  <View className="flex-1 gap-4">
                    <EmployerTimesheetCard
                      selectedWeek={selectedWeek}
                      isWeekDropdownOpen={isWeekDropdownOpen}
                      onToggleWeekDropdown={() =>
                        setIsWeekDropdownOpen((current) => !current)
                      }
                      onSelectWeek={(weekDay) => {
                        setSelectedWeek(weekDay);
                        setIsWeekDropdownOpen(false);
                      }}
                    />
                    <EmployerActionsCard onBack={goBackToOrigin} />
                  </View>
                </View>
              ) : (
                <View className="flex-col gap-6 xl:flex-row">
                  <View className="flex-[1.45] gap-4">
                    <ProfileCard worker={worker} />
                    <StatsCard worker={worker} />
                    <AboutCard worker={worker} />
                    <DocumentsCard worker={worker} />
                    <WorkHistoryCard worker={worker} />
                    {showReviewComposer ? (
                      <ReviewComposerCard
                        reviewRating={reviewRating}
                        setReviewRating={setReviewRating}
                        reviewText={reviewText}
                        setReviewText={setReviewText}
                        onSubmit={closeReviewComposer}
                        onDiscard={closeReviewComposer}
                      />
                    ) : (
                      <RatingSummaryCard
                        worker={worker}
                        onWriteReview={() => setShowReviewComposer(true)}
                      />
                    )}
                    <ReviewsCard worker={worker} />
                  </View>

                  <View className="flex-1 gap-4">
                    <View className="rounded-[24px] border border-neutral-200 bg-white p-5 md:p-6">
                      <View className="flex-row items-center gap-3">
                        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                          <ShieldCheck size={18} color={Colors.common.BRAND} />
                        </View>
                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-neutral-900">
                            Worker summary
                          </Text>
                          <Text className="mt-1 text-sm leading-6 text-neutral-600">
                            Keep the key profile, review, and hiring context in
                            view while the main content stays readable.
                          </Text>
                        </View>
                      </View>
                    </View>

                    <WorkerActionsCard
                      onAccept={goBackToOrigin}
                      onDecline={goBackToOrigin}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
