const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "levi",
    projectName: "react",    // @levi/react
    webpackConfigEnv,
    argv,
  });

  delete defaultConfig.externals;
  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    devServer: {
      port: 3000
    }
  });
};
