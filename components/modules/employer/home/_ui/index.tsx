import { Clock3, Minus, Plus } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export function FormSectionLabel({ label }: { label: string }) {
  return (
    <Text className="mt-6 text-[10px] font-extrabold uppercase tracking-[1.3px] text-[#7A7A7A]">
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
        <Text className="text-[15px] font-bold text-[#202020]">{label}</Text>
        <Text className="mt-1 text-[11px] text-[#858585]">{hint}</Text>
      </View>

      <View className="flex-row items-center gap-4">
        <CounterButton icon={<Minus size={18} color="#202020" />} onPress={onDecrease} />
        <Text className="min-w-[58px] text-center text-[18px] font-black tracking-[-0.3px] text-[#111111]">
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
      className={`flex-1 rounded-[18px] border bg-white px-3 py-3 ${
        active ? "border-[#FF5A1F]" : "border-[#E9E9E9]"
      }`}
    >
      <Text className="text-[10px] font-bold uppercase tracking-[1px] text-[#8B8B8B]">
        {label}
      </Text>
      <Text className="mt-1 text-[18px] font-black tracking-[-0.3px] text-[#111111]">
        {value}
      </Text>
    </View>
  );
}

export function TimePill({ value }: { value: string }) {
  return (
    <View className="flex-row items-center gap-2 rounded-2xl border border-[#E9E9E9] bg-white px-3 py-2.5">
      <Text className="text-[13px] font-bold text-[#202020]">{value}</Text>
      <Clock3 size={15} color="#8A8A8A" />
    </View>
  );
}