'use strict';
var _ = require('underscore');
var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = function(options) {
	var opts = _.extend({
		inputKey: null,
		fileNameKey: null,
		path: null
	}, options);

	return function(err, type, document, context) {
		if (!_.isArray(opts.inputKey) || !opts.path) {
			throw 'Illegal options';
		}

		mkdirp(opts.path);
		this.pass(type, document, context);

		var group = this.makeGroup();
		_.each(opts.inputKey, function(key) {
			var fileName = context[opts.fileNameKey][key];

			if (key in context && fileName) {
				var fqdnFileName = opts.path + '/' + fileName;
				fs.writeFile(fqdnFileName, context[key], group.slot());
			}
		});
	};
};
