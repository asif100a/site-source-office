import { Clock3, Minus, Plus } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export function FormSectionLabel({ label }: { label: string }) {
  return (
    <Text className="mt-6 text-[11px] font-bold uppercase tracking-[1.3px] text-[#7A7A7A]">
      {label}
    </Text>
  );
}

export function CounterRow({
  label,
  hint,
  value,
  onDecrease,
  onIncrease,
}: {
  label: string;
  hint: string;
  value: string;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <View className="shrink">
        <Text className="text-base font-bold text-[#202020]">{label}</Text>
        <Text className="mt-1 text-sm text-[#858585]">{hint}</Text>
      </View>

      <View className="flex-row items-center gap-4">
        <CounterButton
          icon={<Minus size={18} color="#202020" />}
          onPress={onDecrease}
        />
        <Text className="min-w-[64px] text-center text-[20px] font-bold tracking-tight text-[#111111]">
          {value}
        </Text>
        <CounterButton
          icon={<Plus size={18} color="#FFFFFF" />}
          onPress={onIncrease}
          filled
        />
      </View>
    </View>
  );
}

export function CounterButton({
  icon,
  filled = false,
  onPress,
}: {
  icon: React.ReactNode;
  filled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={`h-11 w-11 items-center justify-center rounded-2xl ${
        filled ? "bg-[#111111]" : "bg-[#F3F3F3]"
      }`}
    >
      {icon}
    </TouchableOpacity>
  );
}

export function DateCard({
  label,
  value,
  active = false,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <View
      className={`rounded-[18px] border bg-white px-4 py-4 ${
        active ? "border-[#FF5A1F]" : "border-[#E9E9E9]"
      }`}
    >
      <Text className="text-[10px] font-bold uppercase tracking-[1px] text-[#8B8B8B]">
        {label}
      </Text>
      <Text className="mt-1 text-[22px] font-bold tracking-tight text-[#111111]">
        {value}
      </Text>
    </View>
  );
}

export function TimePill({ value }: { value: string }) {
  return (
    <View className="flex-row items-center gap-2 rounded-2xl border border-[#E9E9E9] bg-white px-3 py-2.5">
      <Text className="text-sm font-bold text-[#202020]">{value}</Text>
      <Clock3 size={15} color="#8A8A8A" />
    </View>
  );
}

export function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between gap-4">
      <Text className="text-xs font-bold uppercase tracking-[1px] text-[#222222]">
        {label}
      </Text>
      <Text className="max-w-[190px] text-right text-sm font-semibold text-[#222222]">
        {value}
      </Text>
    </View>
  );
}

export function SnapshotCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <View className="rounded-[22px] border border-neutral-100 bg-neutral-50 px-4 py-4">
      <Text className="text-[11px] font-bold uppercase tracking-[1.2px] text-neutral-500">
        {label}
      </Text>
      <Text className="mt-2 text-2xl font-bold tracking-tight text-neutral-950">
        {value}
      </Text>
      <Text className="mt-2 text-sm leading-6 text-neutral-500">{helper}</Text>
    </View>
  );
}