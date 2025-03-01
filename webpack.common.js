import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  entry: "./src/js/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(process.cwd(), "dist"),
    clean: true,
  },
  mode: "production",
  devServer: {
    static: {
      directory: path.resolve(process.cwd(), "dist"),
    },
    port: 9000,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
};
