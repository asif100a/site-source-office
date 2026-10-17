import { Platform } from "react-native";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

let configured = false;

export type GoogleIdentity = {
  email?: string;
  name?: string;
  picture?: string;
  idToken?: string;
};

export function isGoogleSignInConfigured() {
  return Boolean(googleWebClientId || googleIosClientId);
}

export function configureGoogleSignIn() {
  if (configured) return;

  GoogleSignin.configure({
    webClientId: googleWebClientId,
    iosClientId: googleIosClientId,
    offlineAccess: false,
    profileImageSize: 160,
  });

  configured = true;
}

export async function signInWithGoogleInApp(): Promise<GoogleIdentity | null> {
  configureGoogleSignIn();

  if (Platform.OS === "android") {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
  }

  const response = await GoogleSignin.signIn();

  if (response.type !== "success") {
    return null;
  }

  const { user } = response.data;

  return {
    email: user.email,
    name: user.name ?? user.givenName ?? undefined,
    picture: user.photo ?? undefined,
    idToken: response.data.idToken ?? undefined,
  };
}

export function getGoogleSignInErrorMessage(error: unknown) {
  if (isErrorWithCode(error)) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return null;
    }

    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return "Google Play Services is unavailable or needs to be updated.";
    }

    if (error.code === statusCodes.IN_PROGRESS) {
      return "Google sign-in is already in progress.";
    }
  }

  const message =
    error instanceof Error ? error.message : String(error ?? "");

  if (
    message.includes("NETWORK_ERROR") ||
    message.includes("ApiException: 7") ||
    message.includes("status code: 7")
  ) {
    return "Google Play Services cannot reach Google right now. Check the device internet connection, disable VPN/proxy/private DNS, update Google Play Services, then try again.";
  }

  return message || "Please try again.";
}
