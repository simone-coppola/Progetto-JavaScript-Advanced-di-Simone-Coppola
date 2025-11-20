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
  mode: 'production', // Cambia a production per il deploy
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'] // Mantieni solo style-loader
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
    // Rimuovi MiniCssExtractPlugin
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      favicon: './src/assets/IMG/logo.png'
    })
  ]
};
