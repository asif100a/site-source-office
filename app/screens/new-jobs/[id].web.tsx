import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import CommonHeader from "@/components/modules/common/CommonHeader";
import NewJobDetails from "@/components/modules/employer/new-jobs/JobDetails";

export default function NewJobDetailsWebScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const jobId = Array.isArray(id) ? id[0] : id;

  return (
    <ScreenWrapper>
      <CommonHeader headerTitle="New Job" withBackButton onPress={() => router.back()} />
      {jobId ? <NewJobDetails jobId={jobId} /> : null}
    </ScreenWrapper>
  );
}
