import { WorkerHomeFilter } from "@/types";
import { Text, TouchableOpacity, View } from "react-native";

export function FilterChip({
  label,
  active,
  onPress,
}: {
  label: WorkerHomeFilter;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mr-3 rounded-full px-5 py-3"
      style={{
        backgroundColor: active ? "#111111" : "#FFFFFF",
        borderWidth: active ? 0 : 1,
        borderColor: "#E7E7E7",
      }}
    >
      <Text
        className="text-sm font-bold"
        style={{ color: active ? "#FFFFFF" : "#4B4B4B" }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function MarkerBubble({
  label,
  dark = false,
}: {
  label: string;
  dark?: boolean;
}) {
  return (
    <View
      className="rounded-full px-3 py-2 shadow-sm"
      style={{
        backgroundColor: dark ? "#111111" : "#FFFFFF",
        borderWidth: dark ? 0 : 1,
        borderColor: "#ECECEC",
      }}
    >
      <Text
        className="text-sm font-bold"
        style={{ color: dark ? "#FFFFFF" : "#111111" }}
      >
        {label}
      </Text>
    </View>
  );
}