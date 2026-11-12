import { workerProfileApi } from "@/store/api/workerProfileApi";
import { employerProfileApi } from "@/store/api/employerProfileApi";
import type { UserRole } from "@/constants/Routes";
import { BACKEND_URL } from "@/constants/env.config";

// Log structure and field presence only; never log profile values or credentials.
const keys = (value: any): string[] =>
  value && typeof value === "object" ? Object.keys(value) : [];

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
    // A login mutation can invalidate profile queries before its caller stores
    // the new token. forceRefetch still joins an in-flight request with the same
    // cache key, so let that request finish before verifying the new session.
    const pending = dispatch(
      role === "worker"
        ? workerProfileApi.util.getRunningQueryThunk("getWorkerProfile", undefined)
        : employerProfileApi.util.getRunningQueryThunk("getEmployerProfile", undefined),
    );
    if (pending) {
      if (__DEV__) console.info("[ProfileCompletion] waiting for earlier profile request", { role });
      await pending;
    }
    if (role === "worker") {
      const result = await dispatch(
        workerProfileApi.endpoints.getWorkerProfile.initiate(undefined, {
          forceRefetch: true,
          subscribe: false,
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

      const complete = Boolean(hasTrade && (hasCoordinates || hasAddress));
      if (__DEV__) {
        console.info("[ProfileCompletion] worker check", JSON.stringify({
          backend: BACKEND_URL,
          responseKeys: keys(result),
          accountKeys: keys(accountData),
          workerProfileKeys: keys(workerProfile),
          commonProfileKeys: keys(accountData?.profile),
          addressType: typeof address,
          addressKeys: keys(address),
          tradesType: Array.isArray(trades) ? "array" : typeof trades,
          tradeCount: Array.isArray(trades) ? trades.length : null,
          coordinateTypes: Array.isArray(coordinates)
            ? coordinates.map((value: unknown) => typeof value) : null,
          hasTrade, hasCoordinates, hasAddress, complete,
        }));
      }
      return complete;
    } else {
      const result = await dispatch(
        employerProfileApi.endpoints.getEmployerProfile.initiate(undefined, {
          forceRefetch: true,
          subscribe: false,
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
    const status = (error as { status?: unknown })?.status;
    if (__DEV__) {
      console.warn("[ProfileCompletion] request failed", JSON.stringify({
        role, backend: BACKEND_URL, status: status ?? "unknown",
      }));
    }
    if (status === 404) return false;
    throw new Error("Unable to verify your saved profile. Please try logging in again.");
  }
};
