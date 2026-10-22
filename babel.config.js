module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
<<<<<<< HEAD
=======

    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],

          alias: {
            '@': './',
            'tailwind.config': './tailwind.config.js',
          },
        },
      ],
      'react-native-worklets/plugin',
    ],
>>>>>>> fb5a9b5f9e81fe282d20f571e52f9629642fa1ae
  };
};
