import { workerProfileApi } from "@/store/api/workerProfileApi";
import { employerProfileApi } from "@/store/api/employerProfileApi";
import type { UserRole } from "@/constants/Routes";

/**
 * Checks whether the logged-in user has completed their onboarding profile details.
 *
 * For Worker:
 * - Must have trade / skills selected.
 * - Must have address with coordinates selected.
 *
 * For Employer:
 * - Must have company name.
 * - Must have business address with coordinates selected.
 */
export const checkIsProfileComplete = async (
  dispatch: any,
  role: UserRole,
): Promise<boolean> => {
  try {
    if (role === "worker") {
      const result = await dispatch(
        workerProfileApi.endpoints.getWorkerProfile.initiate(undefined, {
          forceRefetch: true,
        }),
      ).unwrap();

      const accountData = result?.data ?? result;
      const workerProfile = accountData?.workerProfile ?? accountData;
      const trades = workerProfile?.trades ?? accountData?.trades;
      const address =
        workerProfile?.address ??
        accountData?.address ??
        accountData?.profile?.address;

      const hasTrade =
        (Array.isArray(trades) && trades.length > 0 && Boolean(trades[0])) ||
        Boolean(workerProfile?.trade || accountData?.trade);

      const coordinates = address?.coordinates ?? address?.location?.coordinates;
      const hasCoordinates =
        Array.isArray(coordinates) &&
        coordinates.length === 2 &&
        typeof coordinates[0] === "number" &&
        typeof coordinates[1] === "number" &&
        (coordinates[0] !== 0 || coordinates[1] !== 0);

      const hasAddress = Boolean(
        hasCoordinates ||
          (typeof address === "string" && address.trim().length > 0) ||
          address?.description,
      );

      return Boolean(hasTrade && (hasCoordinates || hasAddress));
    } else {
      const result = await dispatch(
        employerProfileApi.endpoints.getEmployerProfile.initiate(undefined, {
          forceRefetch: true,
        }),
      ).unwrap();

      const accountData = result?.data ?? result;
      const employerProfile = accountData?.employerProfile ?? accountData;
      const address =
        employerProfile?.address ??
        accountData?.address ??
        accountData?.profile?.address;

      const coordinates = address?.coordinates ?? address?.location?.coordinates;
      const hasCoordinates =
        Array.isArray(coordinates) &&
        coordinates.length === 2 &&
        typeof coordinates[0] === "number" &&
        typeof coordinates[1] === "number" &&
        (coordinates[0] !== 0 || coordinates[1] !== 0);

      const hasAddress = Boolean(
        hasCoordinates ||
          (typeof address === "string" && address.trim().length > 0) ||
          address?.description,
      );

      const hasName = Boolean(
        (typeof employerProfile?.companyName === "string" &&
          employerProfile.companyName.trim().length > 0) ||
          (typeof accountData?.companyName === "string" &&
            accountData.companyName.trim().length > 0) ||
          (typeof accountData?.name === "string" &&
            accountData.name.trim().length > 0) ||
          (typeof accountData?.profile?.name === "string" &&
            accountData.profile.name.trim().length > 0),
      );

      return Boolean((hasCoordinates || hasAddress) && hasName);
    }
  } catch (error) {
    console.log("Profile completeness verification encountered an issue or 404:", error);
    return false;
  }
};
