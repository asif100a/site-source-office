import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import CommonHeader from "@/components/modules/common/CommonHeader";
import NewJobDetails from "@/components/modules/employer/new-jobs/JobDetails";
import Toast from "react-native-toast-message";
import { useCreateJobApplicationMutation } from "@/store/api/jobApplicationApi";
import { getWorkerLoginRoute } from "@/constants/authState";
import { useIsAuthenticated } from "@/hooks/useAuthGuard";

export default function NewJobDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const jobId = Array.isArray(id) ? id[0] : id;
  const isAuthenticated = useIsAuthenticated();
  const [createJobApplication, { isLoading: isApplying }] =
    useCreateJobApplicationMutation();

  // console.log("jobId from the new job details screen: ", jobId);

  const handleApply = () => {
    if (!jobId) return;

    if (!isAuthenticated) {
      router.push(getWorkerLoginRoute(`/screens/new-jobs/${jobId}`) as any);
      return;
    }

    if (isApplying) return;

    void createJobApplication(jobId)
      .unwrap()
      .then((response) => {
        console.log("Job application response: ", response);
        Toast.show({
          type: "success",
          text1: "Application submitted",
          text2: "Your application was sent successfully.",
        });
      })
      .catch((error) => {
        console.error("Job application error: ", error);
        Toast.show({
          type: "error",
          text1: "Application failed",
          text2: (error as any)?.data?.message ?? "Please try again.",
        });
      });
  };

  return (
    <ScreenWrapper>
      <CommonHeader headerTitle="New Job" withBackButton onPress={() => router.back()} />
      {jobId ? (
        <NewJobDetails
          jobId={jobId}
          showApplications
          onApply={handleApply}
        />
      ) : null}
    </ScreenWrapper>
  );
}
