const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");

class CustomStandaloneDisabledPlugin {
  apply(compiler) {
    const isProd = compiler.options.mode === "production";
    compiler.hooks.compilation.tap(
      "CustomStandaloneDisabledPlugin",
      (compilation) => {
        const HtmlWebpackPlugin = require("html-webpack-plugin");
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          "CustomStandaloneDisabledPlugin",
          (data, cb) => {
            if (data.html.includes("Your Microfrontend is not here")) {
              data.html = data.html.replace(
                /<main>[\s\S]*<\/main>/,
                `<main>
                  <h1>Single-spa: React 子应用</h1>
                  <p>当前微前端以"集成模式"运行，不独立提供页面。</p>
                  <h2>访问链接</h2>
                  <p>${
                    isProd
                      ? '<a href="/micro-single-app-substrate/react/">/micro-single-app-substrate/react/</a>'
                      : '<a href="http://localhost:9000/react">http://localhost:9000/react</a>'
                  }</p>
                  <h2>Standalone 模式</h2>
                  <p>如果想独立运行本子应用：<code>npm run start:standalone</code></p>
                </main>`
              );
            }
            cb(null, data);
          }
        );
      }
    );
  }
}

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
      port: 3000,
    },
    plugins: [new CustomStandaloneDisabledPlugin()],
  });
};
