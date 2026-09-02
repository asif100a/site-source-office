import { WorkerHomeFilter } from "@/types";
import { Colors } from "@/constants/Colors";
import { MapPin } from "lucide-react-native";
import { Platform, Text, TouchableOpacity, View } from "react-native";

type NativeMapComponents = {
  MapView: typeof import("react-native-maps").default;
  Marker: typeof import("react-native-maps").Marker;
  ProviderGoogle: typeof import("react-native-maps").PROVIDER_GOOGLE;
};

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
  dark = false,
}: {
  dark?: boolean;
}) {
  return (
    <View
      className="items-center justify-center rounded-full p-2.5 shadow-sm"
      style={{
        backgroundColor: dark ? "#111111" : "#FFFFFF",
        borderWidth: dark ? 0 : 1,
        borderColor: "#ECECEC",
      }}
    >
      <MapPin size={16} color={dark ? "#FFFFFF" : Colors.common.BRAND} />
    </View>
  );
}

export function getNativeMapComponents(): NativeMapComponents | null {
  if (Platform.OS === "web") {
    return null;
  }

  try {
    const maps =
      require("react-native-maps") as typeof import("react-native-maps");
    return {
      MapView: maps.default,
      Marker: maps.Marker,
      ProviderGoogle: maps.PROVIDER_GOOGLE,
    };
  } catch {
    return null;
  }
}