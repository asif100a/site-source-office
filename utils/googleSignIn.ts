import { Platform } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

let configured = false;

export type GoogleIdentity = {
  email?: string;
  name?: string;
  picture?: string;
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
  };
}
