import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import CommonHeader from "@/components/modules/common/CommonHeader";
import NewJobDetails from "@/components/modules/employer/new-jobs/JobDetails";

export default function JobDetailsWebScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const jobId = Array.isArray(id) ? id[0] : id;

  const handleApply = () => {
    if (!jobId) return;

    router.push({
      pathname: "/auth",
      params: {
        role: "worker",
        step: "register_sso",
        returnTo: `/screens/job/${jobId}`,
      },
    } as any);
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
          showApplyButton
          onApply={handleApply}
        />
      ) : null}
    </ScreenWrapper>
  );
}
