import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { getAddressFromCoordinates } from "@/utils/googlePlaces";

export default function JobLocationLabel({
  location,
  coordinates,
}: {
  location?: string;
  coordinates?: [number, number];
}) {
  const [address, setAddress] = useState(location || "Location not set");

  useEffect(() => {
    let mounted = true;
    if (!coordinates) return () => { mounted = false; };

    getAddressFromCoordinates(coordinates)
      .then((resolvedAddress) => mounted && setAddress(resolvedAddress))
      .catch(() => mounted && setAddress(location || "Location not set"));

    return () => {
      mounted = false;
    };
  }, [coordinates, location]);

  return <Text className="text-neutral-500 text-xs">{address}</Text>;
}
