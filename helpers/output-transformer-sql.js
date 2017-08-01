'use strict';
var ObjectHelpers = require('./object-helpers');
var _ = require('underscore');

module.exports = function(options) {
	var opts = _.extend({
		inputKey: null,
		outputKey: 'sqlDocument',
		root: null,

		tableName: null
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

		var sqlContent = _.map(docRoot, function(item) {
			var insFields = [];
			var insValues = [];

			_.each(fields, function(field) {
				insFields.push(field.name);
				var value =  item[field.key] + '';
				insValues.push('\'' + value.replace('\'', '\\\'') + '\'');
			});

			return 'INSERT INTO ' +
				opts.tableName +
				' (' + insFields.join(',') + ') VALUES ('+
				insValues.join(',') + ';';
		}).join('\n');

		context[opts.outputKey] = sqlContent;

		this.pass(type, document, context);
	};
};
