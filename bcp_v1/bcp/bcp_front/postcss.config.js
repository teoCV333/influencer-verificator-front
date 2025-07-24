const purgecss = require("@fullhuman/postcss-purgecss");
module.exports = {
  syntax: "postcss-scss",
  plugins: [
     // PurgeCSS only runs in production builds
    purgecss({
      content: [
        './src/**/*.html',
        './src/**/*.ts',
        './src/**/*.component.ts',
        './src/**/*.component.html'
      ],
      defaultExtractor: content => content.match(/([a-zA-Z0-9\-_:]+)/g) || [],
      safelist: [
        // Classes that should never be purged (e.g., Angular-bound classes)
        'bc-active', 'bc-button', 'bc-input', 'bc-card', 'bc-logo'
      ]
    }),
    require("postcss-obfuscator")({
      enable: true,
      prefix: "a1b2_",
      length: 6,
    }),
  ],
};
