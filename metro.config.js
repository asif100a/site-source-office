const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

const defaultEnhanceMiddleware = config.server.enhanceMiddleware;

config.server.enhanceMiddleware = (middleware, server) => {
  const enhancedMiddleware = defaultEnhanceMiddleware(middleware, server);

  return (request, response, next) => {
    if (
      request.url?.includes('.bundle') &&
      request.headers.accept?.includes('multipart/mixed')
    ) {
      // Android's bundle downloader can reject Metro's multipart chunk stream.
      request.headers.accept = 'application/javascript';
    }

    return enhancedMiddleware(request, response, next);
  };
};

// Polyfill buffer for react-native-svg
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  buffer: require.resolve('buffer'),
};

module.exports = withNativewind(config, { inlineRem: 16 });
