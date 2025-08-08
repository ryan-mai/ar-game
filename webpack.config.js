const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.ts",
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|glb)$/i,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css", ".jpg"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Development",
      template: "./index.html",
      favicon: false,
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "./assets/models", to: "./assets/models" }],
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: "all",
    open: false,
    client: {
      webSocketURL: "ws://0.0.0.0/ws",
    },
    proxy: [
      {
        context: ["/ws"],
        target: "http://localhost:443",
        changeOrigin: true,
        secure: true,
      },
    ],
    static: {
      directory: path.join(__dirname, "public"),
      watch: true,
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true,
      }),
    ],
  },
};
