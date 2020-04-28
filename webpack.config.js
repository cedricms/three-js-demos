const webpack = require('webpack');
const path = require("path");

const CopyWebpackPlugin = require('copy-webpack-plugin');

let config = {
	entry: {
		appCss: './app/assets/scss/app.scss',
		index: "./app/index.js",
		spinningCube: "./app/spinningCube/spinningCube.js",
		cubeWithLight: "./app/cubeWithLight/cubeWithLight.js"
	},
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "./[name]Bundle.js",
		publicPath: '/dist/'
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: './bundle.css',
						},
					},
					{ loader: 'extract-loader' },
					{ loader: 'css-loader' },
					{
						loader: 'sass-loader',
						options: {
							// Prefer Dart Sass
							implementation: require('sass'),
						},
					},
				]
			}
		]
	},
	plugins: [
		new CopyWebpackPlugin( [
				{ from: './node_modules/github-fork-ribbon-css/gh-fork-ribbon.css', to: '' }
			])
	]
}

module.exports = config;
