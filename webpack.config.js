module.exports = {
	context: __dirname,

	entry: {
		main: [
			'./public/js/bootstrap.js'
		]
	},

	output: {
		path: __dirname + '/public/assets',
		filename: '[name].bundle.js',
		chunkFilename: '[id].bundle.js'
	},

	devtool: "#source-map"
};
