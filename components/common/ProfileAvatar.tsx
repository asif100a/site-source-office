import React, { useEffect, useMemo, useState } from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import { User } from "lucide-react-native";

type ProfileAvatarProps = {
  name?: string | null;
  uri?: string | null;
  size?: number;
  className?: string;
};

const getInitials = (name?: string | null) => {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return "";

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export default function ProfileAvatar({
  name,
  uri,
  size = 44,
  className = "",
}: ProfileAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const initials = useMemo(() => getInitials(name), [name]);
  const showImage = Boolean(uri) && !hasImageError;
  const imageSource = useMemo<ImageSourcePropType | null>(
    () => (uri ? { uri } : null),
    [uri]
  );

  useEffect(() => {
    setHasImageError(false);
  }, [uri]);

  return (
    <View
      className={`items-center justify-center overflow-hidden rounded-full bg-orange-50 ${className}`}
      style={{ width: size, height: size }}
    >
      {showImage && imageSource ? (
        <Image
          source={imageSource}
          className="h-full w-full"
          resizeMode="cover"
          onError={() => setHasImageError(true)}
        />
      ) : initials ? (
        <Text
          className="font-bold"
          style={{ color: "#C81E1E", fontSize: Math.max(12, size * 0.34) }}
        >
          {initials}
        </Text>
      ) : (
        <User size={Math.max(16, size * 0.46)} color="#C81E1E" />
      )}
    </View>
  );
}
