import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ModalFrame, ModalHeader, ProjectDateInput, ProjectInput } from "./_ui";
import { Colors } from "@/constants/Colors";
import { ProjectForm } from "@/types";

export default function StartProjectModal({
  visible,
  projectForm,
  setProjectForm,
  onClose,
  onCreate,
}: {
  visible: boolean;
  projectForm: ProjectForm;
  setProjectForm: React.Dispatch<React.SetStateAction<ProjectForm>>;
  onClose: () => void;
  onCreate: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <ModalFrame onClose={onClose}>
        <ModalHeader title="Start a project" onClose={onClose} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-4">
            <ProjectInput
              label="Project name"
              placeholder="e.g. Hoxton Street Refurb"
              value={projectForm.name}
              onChangeText={(name) =>
                setProjectForm((current) => ({ ...current, name }))
              }
            />
            <ProjectInput
              label="Address"
              placeholder="Site address"
              value={projectForm.address}
              onChangeText={(address) =>
                setProjectForm((current) => ({ ...current, address }))
              }
            />
            <View className="flex-row gap-3">
              <ProjectDateInput
                label="Start date"
                placeholder="10 Aug"
                date={projectForm.startDate}
                onDateChange={(startDate) =>
                  setProjectForm((current) => ({ ...current, startDate }))
                }
                containerClassName="flex-1"
              />
              <ProjectDateInput
                label="End date"
                placeholder="21 Aug"
                date={projectForm.endDate}
                onDateChange={(endDate) =>
                  setProjectForm((current) => ({ ...current, endDate }))
                }
                containerClassName="flex-1"
              />
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onCreate}
          className="mt-6 items-center justify-center rounded-2xl py-4 mb-6"
          style={{ backgroundColor: Colors.common.GRAY_DARK }}
        >
          <Text className="text-sm font-extrabold text-white">
            Create project
          </Text>
        </TouchableOpacity>
      </ModalFrame>
    </Modal>
  );
}