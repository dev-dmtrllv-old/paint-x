const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CheckerPlugin, TsConfigPathsPlugin } = require("awesome-typescript-loader");

module.exports = {
	entry: path.resolve(process.cwd(), "src", "app", "index.tsx"),
	devtool: "source-map",
	mode: "development",
	output: {
		path: path.resolve(process.cwd(), "dist", "app"),
		filename: "js/[name].bundle.js",
		chunkFilename: "js/[chunkhash].chunk.js"
	},
	target: "electron-renderer",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: "awesome-typescript-loader",
				}
			},
			{
				test: /\.js$/,
				use: ["source-map-loader"],
				enforce: "pre"
			},
			{
				test: /\.s?(c|a)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader",
				],
				exclude: /node_modules/
			},
			{
				test: /\.(jpe?g|png|gif|svg|ico)$/i,
				use: {
					loader: "url-loader",
					options: {
						fallback: "file-loader",
						limit: 40000,
						name: "images/[name].[ext]",
					},
				},
			},
		]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		plugins: [
			new TsConfigPathsPlugin({ rootDir: "./src", baseUrl: "./src", "outDir": "./dist" })
		]
	},
	plugins: [
		new CheckerPlugin(),
	],
};
