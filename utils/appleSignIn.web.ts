const appleClientId = process.env.EXPO_PUBLIC_APPLE_CLIENT_ID;
const appleSdkUrl = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

type AppleCredential = {
  authorization: { id_token: string; code?: string };
  user?: string;
  email?: string;
  name?: { firstName?: string; lastName?: string };
};

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init(options: Record<string, unknown>): void;
        signIn(): Promise<AppleCredential>;
      };
    };
  }
}

let sdkPromise: Promise<void> | null = null;

const loadAppleSdk = () => {
  if (window.AppleID) return Promise.resolve();
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${appleSdkUrl}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Unable to load Apple Sign In.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = appleSdkUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Apple Sign In."));
    document.head.appendChild(script);
  });

  return sdkPromise;
};

const decodeToken = (token: string) => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload.padEnd(payload.length + ((4 - payload.length % 4) % 4), "="))) as {
      email?: string;
      name?: string;
    };
  } catch {
    return {};
  }
};

export async function signInWithAppleOnWeb() {
  if (!appleClientId) {
    throw new Error("Apple web sign-in is not configured. Add EXPO_PUBLIC_APPLE_CLIENT_ID.");
  }

  await loadAppleSdk();
  if (!window.AppleID) throw new Error("Apple Sign In is unavailable.");

  window.AppleID.auth.init({
    clientId: appleClientId,
    scope: "name email",
    redirectURI: `${window.location.origin}/apple-callback`,
    state: crypto.randomUUID(),
    usePopup: true,
  });

  const result = await window.AppleID.auth.signIn();
  const idToken = result.authorization?.id_token;
  if (!idToken) throw new Error("Apple did not return an identity token.");

  const claims = decodeToken(idToken);
  const name = [result.name?.firstName, result.name?.lastName].filter(Boolean).join(" ");

  return {
    idToken,
    email: result.email ?? claims.email,
    name: name || claims.name,
  };
}
