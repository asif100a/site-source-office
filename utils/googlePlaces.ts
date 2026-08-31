import Constants from "expo-constants";
import { Platform } from "react-native";

export type AddressSuggestion = {
  placeId: string;
  description: string;
};

export type AddressDetails = {
  description: string;
  coordinates: [number, number];
};

declare global {
  interface Window {
    google?: any;
  }
}

let googlePlacesScriptPromise: Promise<void> | null = null;

export function getGoogleMapsApiKey() {
  const expoConfig = Constants.expoConfig as any;
  const publicGoogleMapsApiKey =
    typeof process !== "undefined"
      ? process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
      : undefined;

  return (
    publicGoogleMapsApiKey ||
    expoConfig?.extra?.googleMapsApiKey ||
    expoConfig?.android?.config?.googleMaps?.apiKey ||
    expoConfig?.ios?.config?.googleMapsApiKey ||
    ""
  );
}

async function loadGooglePlacesScript(apiKey: string) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  if (window.google?.maps?.places) {
    return;
  }

  if (!googlePlacesScriptPromise) {
    googlePlacesScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[data-google-places="true"]',
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve());
        existingScript.addEventListener("error", () =>
          reject(new Error("Unable to load Google Places script.")),
        );
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        apiKey,
      )}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.dataset.googlePlaces = "true";
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Unable to load Google Places script."));
      document.head.appendChild(script);
    });
  }

  await googlePlacesScriptPromise;
}

async function getWebAddressSuggestions(
  input: string,
  apiKey: string,
): Promise<AddressSuggestion[]> {
  await loadGooglePlacesScript(apiKey);

  return new Promise((resolve) => {
    const service = new window.google.maps.places.AutocompleteService();

    service.getPlacePredictions(
      { input, types: ["geocode"] },
      (predictions: any[] | null, status: string) => {
        if (status !== "OK" || !predictions) {
          resolve([]);
          return;
        }

        resolve(
          predictions.map((prediction) => ({
            placeId: prediction.place_id,
            description: prediction.description,
          })),
        );
      },
    );
  });
}

async function getNativeAddressSuggestions(
  input: string,
  apiKey: string,
): Promise<AddressSuggestion[]> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input,
    )}&types=geocode&key=${encodeURIComponent(apiKey)}`,
  );
  const result = await response.json();

  return (result.predictions ?? []).map((prediction: any) => ({
    placeId: prediction.place_id,
    description: prediction.description,
  }));
}

export async function getAddressSuggestions(input: string) {
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey || input.trim().length < 3) {
    return [];
  }

  if (Platform.OS === "web") {
    return getWebAddressSuggestions(input, apiKey);
  }

  return getNativeAddressSuggestions(input, apiKey);
}

async function getWebAddressDetails(
  placeId: string,
  fallbackDescription: string,
  apiKey: string,
): Promise<AddressDetails> {
  await loadGooglePlacesScript(apiKey);

  return new Promise((resolve, reject) => {
    const container = document.createElement("div");
    const service = new window.google.maps.places.PlacesService(container);

    service.getDetails(
      {
        placeId,
        fields: ["formatted_address", "geometry", "name"],
      },
      (place: any | null, status: string) => {
        const location = place?.geometry?.location;

        if (status !== "OK" || !location) {
          reject(new Error("Unable to find address coordinates."));
          return;
        }

        resolve({
          description:
            place.formatted_address || place.name || fallbackDescription,
          coordinates: [location.lng(), location.lat()],
        });
      },
    );
  });
}

async function getNativeAddressDetails(
  placeId: string,
  fallbackDescription: string,
  apiKey: string,
): Promise<AddressDetails> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId,
    )}&fields=formatted_address,geometry,name&key=${encodeURIComponent(apiKey)}`,
  );
  const result = await response.json();
  const location = result.result?.geometry?.location;

  if (!location) {
    throw new Error("Unable to find address coordinates.");
  }

  return {
    description:
      result.result?.formatted_address ||
      result.result?.name ||
      fallbackDescription,
    coordinates: [location.lng, location.lat],
  };
}

export async function getAddressDetails(
  placeId: string,
  fallbackDescription: string,
) {
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    throw new Error("Google Maps API key is missing.");
  }

  if (Platform.OS === "web") {
    return getWebAddressDetails(placeId, fallbackDescription, apiKey);
  }

  return getNativeAddressDetails(placeId, fallbackDescription, apiKey);
}
