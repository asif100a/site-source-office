import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import CommonHeader from "@/components/modules/common/CommonHeader";
import NewJobDetails from "@/components/modules/employer/new-jobs/JobDetails";
import { useCreateJobApplicationMutation } from "@/store/api/jobApplicationApi";
import { getWorkerLoginRoute } from "@/constants/authState";
import { useIsAuthenticated } from "@/hooks/useAuthGuard";
import Toast from "react-native-toast-message";

export default function JobDetailsWebScreen() {
  const router = useRouter();
  const { id, applicationStatus } = useLocalSearchParams<{
    id?: string;
    applicationStatus?: string;
  }>();
  const jobId = Array.isArray(id) ? id[0] : id;
  const resolvedApplicationStatus = Array.isArray(applicationStatus)
    ? applicationStatus[0]
    : applicationStatus;
  const canApply = !resolvedApplicationStatus;
  const isAuthenticated = useIsAuthenticated();
  const [createJobApplication, { isLoading: isApplying }] =
    useCreateJobApplicationMutation();

  const handleApply = () => {
    if (!jobId) return;

    if (!isAuthenticated) {
      router.push(getWorkerLoginRoute(`/screens/job/${jobId}`) as any);
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
      <CommonHeader
        headerTitle="Job Details"
        withBackButton
        onPress={() => router.back()}
      />
      {jobId ? (
        <NewJobDetails
          jobId={jobId}
          showApplyButton={canApply}
          isApplying={isApplying}
          onApply={handleApply}
        />
      ) : null}
    </ScreenWrapper>
  );
}
