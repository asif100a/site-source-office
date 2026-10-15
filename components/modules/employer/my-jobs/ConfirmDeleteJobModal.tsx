import { Modal, Text, TouchableOpacity, View } from "react-native";

export default function ConfirmDeleteJobModal({
  visible,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center px-5" style={{ backgroundColor: "rgba(17, 24, 39, 0.45)" }}>
        <View className="w-full max-w-md rounded-3xl bg-white p-6">
          <Text className="text-lg font-extrabold text-neutral-950">Delete job posting?</Text>
          <Text className="mt-2 text-sm leading-5 text-neutral-600">
            This action cannot be undone. Do you really want to delete this job?
          </Text>
          <View className="mt-6 flex-row justify-end gap-3">
            <TouchableOpacity onPress={onCancel} disabled={isDeleting} className="rounded-xl border border-neutral-200 px-4 py-3">
              <Text className="text-sm font-bold text-neutral-700">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} disabled={isDeleting} className="rounded-xl bg-red-600 px-4 py-3 disabled:opacity-60">
              <Text className="text-sm font-bold text-white">{isDeleting ? "Deleting..." : "Delete"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
