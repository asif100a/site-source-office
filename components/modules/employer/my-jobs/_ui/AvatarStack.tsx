import React from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";

type AvatarStackApplicant = {
  id: string;
  name?: string;
  image?: string | null;
  initial?: string;
};

const getInitial = (applicant: AvatarStackApplicant) =>
  applicant.initial ?? applicant.name?.trim().charAt(0).toUpperCase() ?? "W";

export default function AvatarStack({
  applicants = [],
}: {
  applicants?: AvatarStackApplicant[];
}) {
  const visibleApplicants = applicants.slice(0, 3);

  if (!visibleApplicants.length) {
    return null;
  }

  return (
    <View className="flex-row items-center">
      {visibleApplicants.map((applicant, index) => (
        <View
          key={applicant.id}
          className={`h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-700 ${
            index > 0 ? "-ml-2" : ""
          }`}
        >
          {applicant.image ? (
            <Image
              source={{ uri: applicant.image }}
              className="h-full w-full rounded-full"
            />
          ) : (
            <Text className="text-[10px] font-extrabold text-white">
              {getInitial(applicant)}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}
