const { HtmlWebpackPlugin } = require("@event-chat/micro-dev-config/helpers");
const { CustomStandaloneDisabledPlugin, GenerateImportMapPlugin } = require("@event-chat/micro-dev-config/plugins")
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const { merge } = require("webpack-merge");

const displayStandalonePage = (prod) => `<main>
  <h1>Single-spa: React 子应用</h1>
  <p>当前微前端以"集成模式"运行，不独立提供页面。</p>
  <h2>访问链接</h2>
  <p>${
    prod
      ? '<a href="/micro-single-app-substrate/react/">/micro-single-app-substrate/react/</a>'
      : '<a href="http://localhost:9000/react">http://localhost:9000/react</a>'
  }</p>
  <h2>Standalone 模式</h2>
  <p>如果想独立运行本子应用：<code>npm run start:standalone</code></p>
</main>`

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
    output: {
      filename: isProduction ? `${defaultConfig.output.filename.split('.')[0]}.[contenthash:8].js` : defaultConfig.output.filename
    },
    devServer: {
      port: 3000,
    },
    plugins: [
      isProduction && new HtmlWebpackPlugin(),
      new CustomStandaloneDisabledPlugin({
        handle: (html) => {
          if (html.includes("Your Microfrontend is not here")) {
            // dev mode: StandaloneSingleSpaPlugin 生成了默认提示，替换 <main> 内容
            return html.replace(/<main>[\s\S]*<\/main>/, displayStandalonePage(isProduction));
          } else if (isProduction) {
            // production mode: 无 StandaloneSingleSpaPlugin，注入完整提示页面
            return html.replace(
              /<body>[\s\S]*<\/body>/,
              `<body>
                ${displayStandalonePage(isProduction)}
              </body>`
            );
          }
        }
      }),
      new GenerateImportMapPlugin({
        module: isProduction ? '@levi/react' : ''
      })
    ].filter(Boolean),
  });
};
