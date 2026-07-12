const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");

class CustomStandaloneDisabledPlugin {
  apply(compiler) {
    const isProd = compiler.options.mode === "production";
    compiler.hooks.compilation.tap(
      "CustomStandaloneDisabledPlugin",
      (compilation) => {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          "CustomStandaloneDisabledPlugin",
          (data, cb) => {
            if (data.html.includes("Your Microfrontend is not here")) {
              // dev mode: StandaloneSingleSpaPlugin 生成了默认提示，替换 <main> 内容
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
            } else if (isProd) {
              // production mode: 无 StandaloneSingleSpaPlugin，注入完整提示页面
              data.html = data.html.replace(
                /<body>[\s\S]*<\/body>/,
                `<body>
                  <main>
                    <h1>Single-spa: React 子应用</h1>
                    <p>当前微前端以"集成模式"运行，不独立提供页面。</p>
                    <h2>访问链接</h2>
                    <p><a href="/micro-single-app-substrate/react/">/micro-single-app-substrate/react/</a></p>
                    <h2>Standalone 模式</h2>
                    <p>如果想独立运行本子应用：<code>npm run start:standalone</code></p>
                  </main>
                </body>`
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
    projectName: "react",
    webpackConfigEnv,
    argv,
  });

  delete defaultConfig.externals;

  const isProduction = argv.p || argv.mode === "production";

  return merge(defaultConfig, {
    devServer: {
      port: 3000,
    },
    plugins: [
      isProduction && new HtmlWebpackPlugin(),
      new CustomStandaloneDisabledPlugin(),
    ].filter(Boolean),
  });
};
