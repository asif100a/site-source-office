const fs = require("fs");
const path = require("path");

function getEnvValue(name) {
  if (process.env[name] && process.env[name] !== "undefined" && process.env[name] !== "null") {
    return process.env[name];
  }

  const envPath = path.join(__dirname, ".env");

  if (!fs.existsSync(envPath)) {
    return undefined;
  }

  const match = fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("#") && line.startsWith(`${name}=`));

  const value = match?.slice(name.length + 1).replace(/^["']|["']$/g, "");

  return value && value !== "undefined" && value !== "null" ? value : undefined;
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function withReactNativeMapsPlugin(plugins, googleMapsApiKey) {
  if (!googleMapsApiKey) {
    return plugins;
  }

  const mapsPlugin = [
    "react-native-maps",
    {
      androidGoogleMapsApiKey: googleMapsApiKey,
      iosGoogleMapsApiKey: googleMapsApiKey,
    },
  ];

  const hasMapsPlugin = plugins.some((plugin) =>
    Array.isArray(plugin)
      ? plugin[0] === "react-native-maps"
      : plugin === "react-native-maps",
  );

  if (!hasMapsPlugin) {
    return [...plugins, mapsPlugin];
  }

  return plugins.map((plugin) => {
    if (Array.isArray(plugin) && plugin[0] === "react-native-maps") {
      return [
        "react-native-maps",
        {
          ...(plugin[1] || {}),
          androidGoogleMapsApiKey: googleMapsApiKey,
          iosGoogleMapsApiKey: googleMapsApiKey,
        },
      ];
    }

    if (plugin === "react-native-maps") {
      return mapsPlugin;
    }

    return plugin;
  });
}

function getReversedGoogleClientId(clientId) {
  if (!clientId) return undefined;
  if (clientId.startsWith("com.googleusercontent.apps.")) {
    return clientId;
  }
  const match = clientId.match(/^([\w-]+)\.apps\.googleusercontent\.com$/);
  if (match) {
    return `com.googleusercontent.apps.${match[1]}`;
  }
  return clientId;
}

function withGoogleSignInPlugin(plugins, iosClientId) {
  const reversedScheme = getReversedGoogleClientId(iosClientId);
  if (!reversedScheme) {
    return plugins;
  }

  const googlePlugin = [
    "@react-native-google-signin/google-signin",
    {
      iosUrlScheme: reversedScheme,
    },
  ];

  const hasPlugin = plugins.some((plugin) =>
    Array.isArray(plugin)
      ? plugin[0] === "@react-native-google-signin/google-signin"
      : plugin === "@react-native-google-signin/google-signin",
  );

  if (!hasPlugin) {
    return [...plugins, googlePlugin];
  }

  return plugins.map((plugin) => {
    if (Array.isArray(plugin) && plugin[0] === "@react-native-google-signin/google-signin") {
      return [
        "@react-native-google-signin/google-signin",
        {
          ...(plugin[1] || {}),
          iosUrlScheme: (plugin[1] && plugin[1].iosUrlScheme) || reversedScheme,
        },
      ];
    }
    if (plugin === "@react-native-google-signin/google-signin") {
      return googlePlugin;
    }
    return plugin;
  });
}

const googleMapsApiKey =
  getEnvValue("EXPO_PUBLIC_GOOGLE_MAPS_API_KEY") ||
  getEnvValue("GOOGLE_MAPS_API_KEY");
const googleIosClientId = getEnvValue("EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID");
const googleServicesFile = path.join(__dirname, "google-services.json");
const hasGoogleServicesFile = fs.existsSync(googleServicesFile);
const envEasProjectId = getEnvValue("EXPO_PUBLIC_EAS_PROJECT_ID");
const easProjectId = envEasProjectId && isUuid(envEasProjectId) ? envEasProjectId : undefined;

module.exports = ({ config }) => ({
  ...config,
  plugins: withGoogleSignInPlugin(
    withReactNativeMapsPlugin(config.plugins || [], googleMapsApiKey),
    googleIosClientId,
  ),
  extra: {
    ...config.extra,
    ...(googleMapsApiKey ? { googleMapsApiKey } : {}),
    ...(easProjectId
      ? {
          projectId: easProjectId,
          eas: {
            ...config.extra?.eas,
            projectId: easProjectId,
          },
        }
      : {}),
  },
  ios: {
    ...config.ios,
    bundleIdentifier:
      config.ios?.bundleIdentifier ||
      config.android?.package ||
      "com.sitesource.app",
    config: {
      ...config.ios?.config,
      ...(googleMapsApiKey ? { googleMapsApiKey } : {}),
    },
  },
  android: {
    ...config.android,
    ...(hasGoogleServicesFile ? { googleServicesFile: "./google-services.json" } : {}),
    config: {
      ...config.android?.config,
      ...(googleMapsApiKey
        ? {
            googleMaps: {
              ...config.android?.config?.googleMaps,
              apiKey: googleMapsApiKey,
            },
          }
        : {}),
    },
  },
});
