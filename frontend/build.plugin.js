// webpack 配置自定义
module.exports = ({ onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.module
      .rule('less')
      .test(/\.less/)
      .use('less-loader')
      .loader('less-loader')
      .options({
        lessOptions: {
          javascriptEnabled: true
        }
      })
  })
}
