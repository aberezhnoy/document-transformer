'use strict';
var ObjectHelpers = require('./object-helpers');
var _ = require('underscore');

module.exports = function(options) {
	var opts = _.extend({
		inputKey: null,
		outputKey: 'csvDocument',
		root: null,

		separator: ',',
		newLine: '\n'
	}, options);

	var fields = opts.fields || [];

	if (fields.length < 1) {
		throw 'Fields is not defined';
	}

	return function(err, type, document, context) {
		var doc = opts.inputKey ?
			context[opts.inputKey] :
			document;

		if (!doc) {
			throw 'Document is not defined';
		}

		var docRoot = opts.root ?
			ObjectHelpers.getByPath(opts.root, doc) :
			doc;

		var csvContent = _.map(docRoot, function(item) {
			return _.chain(fields)
				.pluck('path')
				.map(function (path) {
					return ObjectHelpers.getByPath(path, item);
				})
				.value()
				.join(opts.separator);
		}).join(opts.newLine);

		context[opts.outputKey] = _.pluck(fields, 'name').join(opts.separator) + opts.newLine + csvContent;

		this.pass(type, document, context);
	};
};
