import { EmployerTimesheet, EmployerTimesheetDay } from "@/types";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { X } from "lucide-react-native";

const formatDayLabel = (day: string) =>
  day
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatHoursLabel = (hours: number) =>
  `${hours} ${hours === 1 ? "Hour" : "Hours"}`;

const formatDate = (value?: string) => {
  if (!value) return "Not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatSubmittedAt = (value?: string) => {
  if (!value) return "Submitted date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Submitted date unavailable";

  return `Submitted ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

const formatLocation = (timesheet?: EmployerTimesheet | null) => {
  const address = timesheet?.job?.location?.address;
  if (address) return address;

  const coordinates = timesheet?.job?.location?.coordinates;
  if (Array.isArray(coordinates) && coordinates.length >= 2) {
    return `${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`;
  }

  return timesheet?.job?.title ?? "Location unavailable";
};

const formatTotalHours = (days?: EmployerTimesheetDay[]) => {
  const totalHours = (days ?? []).reduce((sum, day) => {
    const hours = Number(day.hours);
    return sum + (Number.isFinite(hours) ? hours : 0);
  }, 0);

  return `${totalHours} hrs submitted time`;
};

const formatRequirement = (requirement: string) =>
  requirement
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between gap-4">
      <Text className="text-sm text-neutral-500">{label}</Text>
      <Text className="flex-1 text-right text-sm font-semibold text-neutral-900">
        {value}
      </Text>
    </View>
  );
}

export default function TimesheetDetailsModal({
  visible,
  timesheet,
  onClose,
}: {
  visible: boolean;
  timesheet: EmployerTimesheet | null;
  onClose: () => void;
}) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-end px-4 pb-8"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
      >
        <View className="max-h-[82vh] rounded-2xl bg-white">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          >
            <View className="mb-5 flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-[24px] font-semibold text-neutral-900">
                  Timesheet Details
                </Text>
                <Text className="mt-1 text-sm font-medium text-neutral-500">
                  {timesheet?.workerAuth?.profile?.name ?? "Worker"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                className="rounded-full p-1 active:opacity-70"
              >
                <X size={16} color="#111827" />
              </TouchableOpacity>
            </View>

            <View className="mb-4 rounded-2xl border border-neutral-100 px-4 py-3">
              <Text className="text-sm font-bold text-neutral-950">
                {timesheet ? `Week ${timesheet.week}` : "Week"}
              </Text>
              <Text className="mt-1 text-xs font-semibold text-neutral-400">
                {formatSubmittedAt(timesheet?.createdAt)}
              </Text>
              <Text className="mt-2 text-xs font-semibold text-neutral-500">
                {timesheet?.workerAuth?.workerProfile?.trades?.join(", ") ||
                  timesheet?.job?.title ||
                  "Trade not set"}
              </Text>
              <Text className="mt-1 text-xs text-neutral-500">
                {formatLocation(timesheet)}
              </Text>
            </View>

            <View className="mb-4 rounded-2xl border border-neutral-100 px-4 py-4">
              <Text className="text-xs font-bold uppercase tracking-widest text-orange-600">
                About Job
              </Text>
              <Text className="mt-2 text-lg font-bold text-neutral-950">
                {timesheet?.job?.title ?? "Job title unavailable"}
              </Text>

              <View className="mt-4 gap-3">
                <Detail
                  label="Trade"
                  value={timesheet?.job?.trades?.join(", ") || "Not set"}
                />
                <Detail
                  label="Hourly rate"
                  value={
                    timesheet?.job?.hourlyRate != null
                      ? `$${timesheet.job.hourlyRate}/hour`
                      : "Not set"
                  }
                />
                <Detail
                  label="Workers needed"
                  value={String(timesheet?.job?.workersNeeded ?? "Not set")}
                />
                <Detail
                  label="Start date"
                  value={formatDate(timesheet?.job?.startDate)}
                />
                <Detail
                  label="End date"
                  value={formatDate(timesheet?.job?.endDate)}
                />
                <Detail label="Location" value={formatLocation(timesheet)} />
              </View>

              {timesheet?.job?.mustHave?.length ? (
                <View className="mt-4 border-t border-neutral-100 pt-4">
                  <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Must have
                  </Text>
                  <Text className="mt-2 text-sm leading-5 text-neutral-700">
                    {timesheet.job.mustHave.map(formatRequirement).join(", ")}
                  </Text>
                </View>
              ) : null}

              {timesheet?.job?.note ? (
                <View className="mt-4 border-t border-neutral-100 pt-4">
                  <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Job note
                  </Text>
                  <Text className="mt-2 text-sm leading-5 text-neutral-700">
                    {timesheet.job.note}
                  </Text>
                </View>
              ) : null}

              {timesheet?.job?.workingHours?.length ? (
                <View className="mt-4 border-t border-neutral-100 pt-4">
                  <Text className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Working hours
                  </Text>
                  <View className="mt-3 gap-2">
                    {timesheet.job.workingHours.map((workingHour) => (
                      <View
                        key={workingHour.day}
                        className="flex-row items-center justify-between rounded-xl bg-neutral-50 px-3 py-3"
                      >
                        <Text className="text-sm font-bold text-neutral-900">
                          {formatDayLabel(workingHour.day)}
                        </Text>
                        <Text className="text-sm text-neutral-600">
                          {workingHour.startTime} - {workingHour.endTime}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}
            </View>

            <View className="gap-3">
              {timesheet?.timeSheetDays?.length ? (
                timesheet.timeSheetDays.map((item) => (
                  <View
                    key={item.id}
                    className="flex-row items-center justify-between rounded-2xl border border-neutral-100 px-4 py-3"
                  >
                    <View>
                      <Text className="text-base font-medium text-slate-800">
                        {formatDayLabel(item.day)}
                      </Text>
                      <Text className="mt-0.5 text-sm text-slate-400">
                        {item.status}
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-neutral-900">
                      {formatHoursLabel(item.hours)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="rounded-2xl border border-neutral-100 px-4 py-3 text-sm font-medium text-neutral-400">
                  No timesheet day details available.
                </Text>
              )}
            </View>

            <Text className="mt-4 text-right text-sm font-extrabold text-neutral-900">
              {formatTotalHours(timesheet?.timeSheetDays)}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
