import { useRef, type ReactNode } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Briefcase,
  Calendar,
  Clock3,
  MapPin,
  Users,
  X,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import type { WorkerJobItem } from "./VerticalJobListings";

type JobDetailsBottomSheetProps = {
  job: WorkerJobItem | null;
  visible: boolean;
  primaryActionLabel?: string;
  onClose: () => void;
  onPrimaryAction: () => void;
  isApplying?: boolean;
};

function formatPayRate(payRate: string) {
  if (payRate.includes("/") || payRate.includes("£") || payRate.includes("$")) {
    return payRate;
  }

  return `£${payRate}/hour`;
}

function JobDetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-start gap-3 rounded-xl bg-neutral-50 px-4 py-3">
      <View className="mt-0.5">{icon}</View>
      <View className="flex-1">
        <Text className="text-xs font-semibold uppercase text-neutral-400">
          {label}
        </Text>
        <Text className="mt-1 text-sm font-semibold text-neutral-800">
          {value}
        </Text>
      </View>
    </View>
  );
}

export default function JobDetailsBottomSheet({
  job,
  visible,
  primaryActionLabel = "Apply Now",
  onClose,
  onPrimaryAction,
  isApplying
}: JobDetailsBottomSheetProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const isClosingRef = useRef(false);
  const closeWithAnimation = () => {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;
    Animated.timing(translateY, {
      toValue: 700,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      requestAnimationFrame(() => {
        translateY.setValue(0);
        isClosingRef.current = false;
      });
    });
  };
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 8,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 90 || gesture.vy > 0.9) {
          closeWithAnimation();
          return;
        }

        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  if (!job) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeWithAnimation}
    >
      <View className="flex-1 justify-end" style={{
        backgroundColor: 'rgba(0, 0, 0, 0.45)'
      }}>
        <Pressable className="flex-1" onPress={closeWithAnimation} />
        <Animated.View
          style={{ transform: [{ translateY }] }}
          className="max-h-[88%] rounded-t-[28px] bg-white px-5 pb-8 pt-3"
        >
          <View className="items-center pb-3" {...panResponder.panHandlers}>
            <View className="h-1.5 w-12 rounded-full bg-neutral-300" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-5 flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <View className="mb-3 flex-row items-center gap-2">
                  <View className="rounded-full bg-orange-50 px-3 py-1">
                    <Text className="text-xs font-semibold text-neutral-900">
                      {job.tag}
                    </Text>
                  </View>
                  <Text className="text-xs font-medium text-neutral-400">
                    {job.time}
                  </Text>
                </View>
                <Text className="text-2xl font-extrabold text-neutral-950">
                  {job.title}
                </Text>
                <Text className="mt-1 text-sm font-semibold text-neutral-500">
                  {job.company}
                </Text>
              </View>

              <TouchableOpacity
                onPress={closeWithAnimation}
                className="h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
              >
                <X size={18} color="#404040" />
              </TouchableOpacity>
            </View>

            <View className="mb-5 rounded-2xl bg-neutral-950 px-5 py-4">
              <Text className="text-xs font-semibold uppercase text-white/55">
                Rate
              </Text>
              <Text className="mt-1 text-2xl font-extrabold text-white">
                {formatPayRate(job.payRate)}
              </Text>
            </View>

            <View className="gap-3">
              <JobDetailRow
                icon={<MapPin size={17} color="#737373" />}
                label="Location"
                value={job.location}
              />
              <JobDetailRow
                icon={<Users size={17} color="#737373" />}
                label="Team"
                value={job.team}
              />
              <JobDetailRow
                icon={<Calendar size={17} color="#737373" />}
                label="Duration"
                value={job.duration}
              />
              <JobDetailRow
                icon={<Clock3 size={17} color="#737373" />}
                label="Posted"
                value={job.time}
              />
            </View>

            <View className="my-5 rounded-2xl border border-neutral-100 px-4 py-4">
              <View className="mb-2 flex-row items-center gap-2">
                <Briefcase size={17} color={Colors.common.BRAND} />
                <Text className="text-base font-extrabold text-neutral-950">
                  Job details
                </Text>
              </View>
              <Text className="text-sm leading-6 text-neutral-600">
                This opportunity is a good match for workers who can start soon,
                communicate clearly, and stay reliable across the listed shift
                window.
              </Text>
            </View>

            <TouchableOpacity
              onPress={onPrimaryAction}
              disabled={isApplying}
              style={{ backgroundColor: Colors.common.GRAY_DARK }}
              className="mb-2 rounded-xl px-5 py-4 active:opacity-90"
            >
              <Text className="text-center text-sm font-extrabold text-white">
                {primaryActionLabel}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
