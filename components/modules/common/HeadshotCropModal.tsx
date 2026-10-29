import React from "react";
import type { UploadedFile } from "@/components/standard_ui/form_fields/StandardFileUploadBox";

export default function HeadshotCropModal({
  visible,
  imageUri,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
  onConfirm: (croppedFile: UploadedFile) => void;
}) {
  return null;
}
