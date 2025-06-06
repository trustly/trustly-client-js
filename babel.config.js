module.exports = {

  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],

  plugins: [
    ["babel-plugin-inline-import", {
      "extensions": [
        ".json",
        ".sql",
        ".pem"
      ]
    }],
  ],
};
