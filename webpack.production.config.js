const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	mode: 'production',
	entry: {
		app: path.join(__dirname, './app/index.js'),
	},
	output: {
		path: path.join(__dirname, './public'),
		filename: 'js/[name].js',
		publicPath: '/',
	},
	optimization: {
		runtimeChunk: true,
		splitChunks: {
			cacheGroups: {
				reactDomVendor: {
					test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
					name: 'reactVendor',
					chunks: 'all',
				},
				commons: {
					test: /[\\/]node_modules[\\/](!react-dom)(!react)[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
			},
		},
		minimizer: [
			new TerserPlugin(),
		],
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				use: 'babel-loader?cacheDirectory=true',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
					},
				],
			},
			{
				test: /\.styl$/,
				exclude: [
					/(node_modules|bower_components)/,
				],
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
					},
					{
						loader: 'stylus-loader',
					},
				],
			},
			{
				test: /\.(png|jpg|gif|ttf|eot|woff|woff2|svg)$/,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			chunks: ['app'],
			template: 'views/index.html',
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
			},
		}),
		new MiniCssExtractPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{ from: './app/pwa', to: './images' },
				{ from: './app/pwa/manifest.json' },
			],
		}),
		new WorkboxPlugin.GenerateSW({
			swDest: 'service-worker.js',
			clientsClaim: true,
			skipWaiting: true,
			exclude: [/\.DS_Store/],
		}),
	],
};
