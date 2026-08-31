import type { ImagePickerAsset } from "expo-image-picker";
import { File as ExpoFile } from "expo-file-system";
import { Platform } from "react-native";

type WorkerProfileFormInput = {
  name?: string;
  trade: string;
  experience: string;
  address: {
    coordinates: [number, number];
  };
  image?: ImagePickerAsset | null;
};

type WorkerProfileCertificatesInput = {
  certificates: string[];
};

function normalizeTrade(trade: string) {
  return trade.trim().replace(/[^A-Za-z0-9]+/g, "_").toUpperCase();
}

function normalizeCertificate(certificate: string) {
  return certificate.trim().replace(/[^A-Za-z0-9]+/g, "_").toUpperCase();
}

function normalizeExperience(experience: string) {
  const value = Number.parseInt(experience, 10);
  return Number.isNaN(value) ? 0 : value;
}

function getImageFileName(image: ImagePickerAsset) {
  return (
    image.fileName ||
    image.uri.split(/[\\/]/).pop()?.split("?")[0] ||
    "profile-image.jpg"
  );
}

async function appendImage(formData: FormData, image: ImagePickerAsset) {
  const fileName = getImageFileName(image);
  const mimeType = image.mimeType || "image/jpeg";

  if (Platform.OS === "web") {
    const response = await fetch(image.uri);
    const blob = await response.blob();
    formData.append("image", blob, fileName);
    return;
  }

  // Expo fetch supports its File type, which streams bytes from the local URI.
  // React Native's legacy { uri, name, type } parts are not supported here.
  const file = new ExpoFile(image.uri);
  formData.append("image", file, fileName);
}

export async function buildWorkerProfileFormData({
  name,
  trade,
  experience,
  address,
  image,
}: WorkerProfileFormInput) {
  const payload = {
    ...(name?.trim() ? { name: name.trim() } : {}),
    trades: trade ? [normalizeTrade(trade)] : [],
    experience: normalizeExperience(experience),
    address: {
      type: "Point",
      coordinates: address.coordinates,
    },
    certificates: [],
  };
  const formData = new FormData();

  formData.append("payload", JSON.stringify(payload));

  if (image) {
    await appendImage(formData, image);
  }

  return formData;
}

export function buildWorkerProfileCertificatesFormData({
  certificates,
}: WorkerProfileCertificatesInput) {
  const payload = {
    certificates: certificates
      .map(normalizeCertificate)
      .filter((certificate) => Boolean(certificate)),
  };
  const formData = new FormData();

  formData.append("payload", JSON.stringify(payload));

  return formData;
}
