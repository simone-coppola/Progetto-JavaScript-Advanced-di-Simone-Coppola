const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/Progetto-JavaScript-Advanced-di-Simone-Coppola/'
  },
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/IMG/[name][ext]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      favicon: './src/assets/IMG/logo.png'
    })
  ],
  devServer: {
  static: './dist',
  port: 8080,
  open: true,
  proxy: [
    {
      context: ['/api'],
      target: 'https://openlibrary.org',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/api': '' },
    }
  ]
}
};
