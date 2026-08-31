import { File as ExpoFile } from "expo-file-system";
import { Platform } from "react-native";

type UploadedAsset = {
  uri: string;
  name: string;
  type: string;
};

type BuildProfileEditFormDataInput = {
  payload: Record<string, unknown>;
  image?: UploadedAsset | null;
  certificates?: UploadedAsset[];
};

async function appendFile(
  formData: FormData,
  fieldName: string,
  fileAsset: UploadedAsset,
) {
  if (Platform.OS === "web") {
    const response = await fetch(fileAsset.uri);
    const blob = await response.blob();
    formData.append(fieldName, blob, fileAsset.name);
    return;
  }

  const file = new ExpoFile(fileAsset.uri);
  formData.append(fieldName, file, fileAsset.name);
}

export async function buildProfileEditFormData({
  payload,
  image,
  certificates = [],
}: BuildProfileEditFormDataInput) {
  const formData = new FormData();

  formData.append("payload", JSON.stringify(payload));

  if (image) {
    await appendFile(formData, "image", image);
  }

  for (const certificate of certificates) {
    await appendFile(formData, "certificates", certificate);
  }

  return formData;
}
