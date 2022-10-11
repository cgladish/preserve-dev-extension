module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.plugins[4].options.filename = "static/css/[name].css";
      return {
        ...webpackConfig,
        entry: {
          main: [
            env === "development" &&
              require.resolve("react-dev-utils/webpackHotDevClient"),
            paths.appIndexJs,
          ].filter(Boolean),
          background: "./src/background.ts",
          twitter: "./src/twitter/index.ts",
        },
        output: {
          ...webpackConfig.output,
          filename: "static/js/[name].js",
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false,
        },
      };
    },
  },
};
