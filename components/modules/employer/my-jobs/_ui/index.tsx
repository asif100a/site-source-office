import StandardDateInput from "@/components/standard_ui/form_fields/StandardDateInput";
import { ChevronDown, X } from "lucide-react-native";
import { Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";

const TRADE_OPTIONS = [
  { label: "Groundworker", value: "Groundworker" },
  { label: "Carpenter", value: "Carpenter" },
  { label: "Electrician", value: "Electrician" },
  { label: "Plumber", value: "Plumber" },
  { label: "Bricklayer", value: "Bricklayer" },
  { label: "Painter", value: "Painter" },
  { label: "Scaffolder", value: "Scaffolder" },
];

export function ModalFrame({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <View
      className="flex-1 justify-end"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
    >
      <Pressable className="flex-1" onPress={onClose} />
      <View className="max-h-[86%] rounded-t-[28px] bg-white p-5 pb-8 shadow-2xl">
        {children}
      </View>
    </View>
  );
}

export function ModalHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <View className="mb-5 flex-row items-center justify-between gap-4">
      <Text className="flex-1 text-lg font-extrabold text-neutral-950">
        {title}
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClose}
        className="h-9 w-9 items-center justify-center rounded-full bg-neutral-100"
      >
        <X size={17} color="#333333" />
      </TouchableOpacity>
    </View>
  );
}

export function ProjectInput({
  label,
  placeholder,
  value,
  onChangeText,
  containerClassName = "",
  keyboardType = "default",
  multiline = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  containerClassName?: string;
  keyboardType?: "default" | "numeric";
  multiline?: boolean;
}) {
  return (
    <View className={containerClassName}>
      <Text className="mb-2 text-xs font-bold uppercase tracking-[0.8px] text-neutral-500">
        {label}
      </Text>
      <View className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A3A3A3"
          keyboardType={keyboardType}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          className={`text-sm font-semibold text-neutral-900 ${
            multiline ? "min-h-[90px]" : "py-0"
          }`}
        />
      </View>
    </View>
  );
}

export function ProjectDateInput({
  label,
  placeholder,
  date,
  onDateChange,
  containerClassName = "",
}: {
  label: string;
  placeholder: string;
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  containerClassName?: string;
}) {
  return (
    <View className={containerClassName}>
      <StandardDateInput
        label={label}
        date={date}
        onDateChange={
          ((nextDate) => {
            onDateChange(
              typeof nextDate === "function" ? nextDate(date) : nextDate,
            );
          }) as React.Dispatch<React.SetStateAction<Date | null>>
        }
        placeholder={placeholder}
        inputContainerStyle={{ marginBottom: 0 }}
        inputStyle={{
          backgroundColor: "#FAFAFA",
          borderRadius: 16,
          borderColor: "#E5E5E5",
          fontSize: 14,
          fontWeight: "600",
          paddingHorizontal: 12
        }}
      />
    </View>
  );
}

export function TradeSkillDropdown({
  value,
  open,
  setOpen,
  onSelect,
}: {
  value: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (tradeSkill: string) => void;
}) {
  return (
    <View>
      <Text className="mb-2 text-xs font-bold uppercase tracking-[0.8px] text-neutral-500">
        Trade / Skill
      </Text>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setOpen((current) => !current)}
        className="h-[50px] flex-row items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4"
      >
        <Text
          className={`text-sm font-semibold ${
            value ? "text-neutral-900" : "text-neutral-400"
          }`}
        >
          {value || "Select trade / skill"}
        </Text>
        <ChevronDown size={18} color="#999999" />
      </TouchableOpacity>

      {open ? (
        <View className="mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {TRADE_OPTIONS.map((option) => {
            const selected = value === option.value;

            return (
              <TouchableOpacity
                key={option.value}
                activeOpacity={0.8}
                onPress={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
                className={`min-h-[48px] justify-center px-4 ${
                  selected ? "bg-[#FFF5F2]" : "bg-white"
                }`}
              >
                <Text
                  className={`text-sm ${
                    selected
                      ? "font-bold text-[#FF5500]"
                      : "font-medium text-neutral-800"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}