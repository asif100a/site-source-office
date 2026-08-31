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
};

async function appendImage(formData: FormData, image: UploadedAsset) {
  if (Platform.OS === "web") {
    const response = await fetch(image.uri);
    const blob = await response.blob();
    formData.append("image", blob, image.name);
    return;
  }

  const file = new ExpoFile(image.uri);
  formData.append("image", file, image.name);
}

export async function buildProfileEditFormData({
  payload,
  image,
}: BuildProfileEditFormDataInput) {
  const formData = new FormData();

  formData.append("payload", JSON.stringify(payload));

  if (image) {
    await appendImage(formData, image);
  }

  return formData;
}
