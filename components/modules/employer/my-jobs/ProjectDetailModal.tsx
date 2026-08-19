import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";
import { ModalFrame, ModalHeader } from "./_ui";
import { Colors } from "@/constants/Colors";
import { Plus } from "lucide-react-native";
import { ProjectCard } from "@/types";

export default function ProjectDetailModal({
  visible,
  project,
  onClose,
  onCreateJob,
}: {
  visible: boolean;
  project?: ProjectCard;
  onClose: () => void;
  onCreateJob: () => void;
}) {
  if (!project) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <ModalFrame onClose={onClose}>
        <ModalHeader title={project.name} onClose={onClose} />

        <View className="rounded-2xl bg-neutral-50 p-4">
          <Text className="text-[10px] font-extrabold uppercase tracking-[1px] text-neutral-400">
            Company
          </Text>
          <Text className="mt-1 text-sm font-bold text-neutral-950">
            Tech Innovators Inc.
          </Text>
          <Text className="mt-4 text-[10px] font-extrabold uppercase tracking-[1px] text-neutral-400">
            Project
          </Text>
          <Text className="mt-1 text-sm font-semibold text-neutral-600">
            {project.address}
          </Text>
          <Text className="mt-1 text-xs font-medium text-neutral-500">
            {project.startDate} - {project.endDate}
          </Text>
        </View>

        <View className="mt-5">
          <Text className="mb-3 text-sm font-extrabold text-neutral-950">
            Job postings
          </Text>

          {project.jobs.length > 0 ? (
            <View className="gap-3">
              {project.jobs.map((job) => (
                <View
                  key={job.id}
                  className="rounded-2xl border border-neutral-100 bg-white p-4"
                >
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-sm font-extrabold text-neutral-950">
                        {job.tradeSkill}
                      </Text>
                      <Text className="mt-1 text-xs text-neutral-500">
                        {job.daysRequired}
                      </Text>
                    </View>
                    <Text className="text-sm font-extrabold text-neutral-950">
                      GBP {job.hourlyRate}/hr
                    </Text>
                  </View>
                  <Text className="mt-3 text-xs leading-5 text-neutral-600">
                    {job.workBrief}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="rounded-2xl border border-dashed border-neutral-200 p-4 text-xs leading-5 text-neutral-500">
              No job postings yet. Create one under this project.
            </Text>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onCreateJob}
          className="mt-6 flex-row items-center justify-center gap-2 rounded-2xl py-4 mb-6"
          style={{ backgroundColor: Colors.common.BRAND }}
        >
          <Plus size={18} color="#FFFFFF" />
          <Text className="text-sm font-extrabold text-white">
            Create job posting
          </Text>
        </TouchableOpacity>
      </ModalFrame>
    </Modal>
  );
}
