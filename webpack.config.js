const { CustomStandaloneDisabledPlugin, GenerateImportMapPlugin, HtmlWebpackPlugin, copyPlugin, defineEnvPlugin } = require("@event-chat/micro-dev-config/plugins")
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const { merge } = require("webpack-merge");
const path = require('path');

const ROOT_CONFIG_URL = process.env.DEPLOY_BASE ?? "/micro-single-app-react";
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
  const isStandalone = webpackConfigEnv.standalone;
  const htmlPlugin = defaultConfig.plugins.find(
    plugin => plugin.constructor.name === "HtmlWebpackPlugin"
  );

  if (htmlPlugin) {
    htmlPlugin.options.title = 'Single-spa React 子应用';
  }

  return merge(defaultConfig, {
    output: {
      filename: isProduction ? `${defaultConfig.output.filename.split('.')[0]}.[contenthash:8].js` : defaultConfig.output.filename
    },
    devServer: {
      port: 3000,
    },
    plugins: [
      !htmlPlugin && new HtmlWebpackPlugin({ inject: !isProduction, title: 'Single-spa React 子应用' }),
      defineEnvPlugin({ production: isProduction }, {
        APP_NAME: '@levi/react',
        BASE_URL: isProduction ? `${ROOT_CONFIG_URL}/` : "/",
        DEPLOY_BASE: ROOT_CONFIG_URL,
        STANDALONE: isStandalone
      }),
      copyPlugin([
        {
          from: path.resolve(__dirname, 'public'),
          noErrorOnMissing: true,
          globOptions: {
            ignore: ['**/index.html']
          },
        }
      ]),
      new CustomStandaloneDisabledPlugin({
        handle: (html) => {
          if (html.includes("Your Microfrontend is not here")) {
            // dev mode: StandaloneSingleSpaPlugin 生成了默认提示，替换 <main> 内容
            return html.replace(/<main>[\s\S]*<\/main>/, displayStandalonePage(isProduction));
          } else if (isProduction) {
            // production mode: 无 StandaloneSingleSpaPlugin，注入完整提示页面
            return html.replace('</head>', `<link rel="alternate icon" href="${ROOT_CONFIG_URL}/favicon.ico"></head>`).replace(
              /<body>[\s\S]*<\/body>/,
              `<body>
                ${displayStandalonePage(isProduction)}
              </body>`
            );
          }
          return html
        }
      }),
      new GenerateImportMapPlugin({
        module: isProduction ? '@levi/react' : ''
      })
    ].filter(Boolean),
  });
};
