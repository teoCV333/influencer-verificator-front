const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = (config, options) => {
    // ✅ CORRECTED: Only apply PostCSS to .scss files (not .css)
    config.module.rules.push({
        test: /\.scss$/i, // Only SCSS files
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                },
            },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: {
                            autoprefixer: {}, // Example of a valid PostCSS plugin
                            // Remove postcss-obfuscator here (see below)
                        },
                    },
                    sourceMap: false,
                },
            },
        ],
    });

    // ✅ JavaScript obfuscation (only for production)
    if (config.mode === 'production') {
        config.plugins.push(
            new JavaScriptObfuscator(
                {
                    debugProtection: true,
                    disableConsoleOutput: true,
                    renameGlobals: true,
                    rotateStringArray: true,
                    stringArray: true,
                },
                ['vendor.js']
            )
        );
    }

    return config;
};