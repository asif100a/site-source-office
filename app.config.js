const fs = require("fs");
const path = require("path");

function getEnvValue(name) {
  if (process.env[name]) {
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

  return match?.slice(name.length + 1).replace(/^["']|["']$/g, "");
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

const googleMapsApiKey =
  getEnvValue("EXPO_PUBLIC_GOOGLE_MAPS_API_KEY") ||
  getEnvValue("GOOGLE_MAPS_API_KEY");

module.exports = ({ config }) => ({
  ...config,
  plugins: withReactNativeMapsPlugin(config.plugins || [], googleMapsApiKey),
  extra: {
    ...config.extra,
    ...(googleMapsApiKey ? { googleMapsApiKey } : {}),
  },
  ios: {
    ...config.ios,
    bundleIdentifier:
      config.ios?.bundleIdentifier ||
      config.android?.package ||
      "com.techdebuggers.sitesource",
    config: {
      ...config.ios?.config,
      ...(googleMapsApiKey ? { googleMapsApiKey } : {}),
    },
  },
  android: {
    ...config.android,
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
