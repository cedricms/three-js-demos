const webpack = require('webpack');
const path = require("path");

let config = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "./bundle.js",
		publicPath: '/dist/'
	},
	mode: 'development'
}

module.exports = config;
