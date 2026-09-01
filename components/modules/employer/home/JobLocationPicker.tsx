import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getAddressDetails, getAddressSuggestions, type AddressDetails, type AddressSuggestion } from "@/utils/googlePlaces";
import { Colors } from "@/constants/Colors";

export default function JobLocationPicker({
  address,
  onChange,
  onValidityChange,
}: {
  address: string;
  onChange: (details: AddressDetails) => void;
  onValidityChange?: (isValid: boolean) => void;
}) {
  const [value, setValue] = useState(address);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setValue(address), [address]);

  useEffect(() => {
    const query = value.trim();
    if (query.length < 3 || query === address.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError("");
      try {
        setSuggestions(await getAddressSuggestions(query));
      } catch (lookupError: any) {
        setSuggestions([]);
        setError(lookupError?.message ?? "Unable to search for this address.");
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [address, value]);

  const selectSuggestion = async (suggestion: AddressSuggestion) => {
    setIsLoading(true);
    setError("");
    try {
      const details = await getAddressDetails(suggestion.placeId, suggestion.description);
      setValue(details.description);
      setSuggestions([]);
      onChange(details);
      onValidityChange?.(true);
    } catch (lookupError: any) {
      setError(lookupError?.message ?? "Unable to find address coordinates.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="mt-3 rounded-[18px] border border-neutral-200 bg-white p-3">
      <Text className="mb-2 text-xs font-bold uppercase text-neutral-500">Change site location</Text>
      <TextInput
        value={value}
        onChangeText={(nextValue) => {
          setValue(nextValue);
          onValidityChange?.(nextValue.trim() === address.trim());
          setError("");
        }}
        placeholder="Search for an address"
        placeholderTextColor="#999999"
        className="rounded-xl border border-neutral-200 px-3 py-3 text-sm text-neutral-900"
      />
      {isLoading ? <ActivityIndicator className="mt-2 self-start" color={Colors.common.BRAND} /> : null}
      {suggestions.length > 0 ? (
        <View className="mt-2 overflow-hidden rounded-xl border border-neutral-200">
          {suggestions.map((suggestion) => (
            <TouchableOpacity key={suggestion.placeId} onPress={() => selectSuggestion(suggestion)} className="border-b border-neutral-100 px-3 py-3">
              <Text className="text-sm text-neutral-800">{suggestion.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
      {error ? <Text className="mt-2 text-xs text-red-600">{error}</Text> : null}
    </View>
  );
}
