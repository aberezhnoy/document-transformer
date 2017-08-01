'use strict';
var ObjectHelpers = require('./object-helpers');
var _ = require('underscore');

module.exports = function(options) {
	var opts = _.extend({
		inputKey: null,
		outputKey: 'plainModel',
		root: null
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

		if (!_.isArray(docRoot)) {
			throw 'Wrong doc-root type for tree-to-plain';
		}

		context[opts.outputKey] = _.map(docRoot, function(record) {
			var resultRecord = {};

			_.each(fields, function(field) {
				resultRecord[field.dest] = ObjectHelpers.getByPath(field.src, record);
			});

			return resultRecord;
		});

		this.pass(type, document, context);
	};
};
