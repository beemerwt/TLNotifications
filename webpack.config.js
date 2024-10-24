const path = require('path');

module.exports = {
	mode: 'production',
	entry: {
		index: './src/index.js',
		messaging: './src/firebase-messaging-sw.js',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	}
};
