'use strict';
var ObjectHelpers = require('./object-helpers');
var _ = require('underscore');

module.exports = function(options) {
	var opts = _.extend({
		inputKey: null,
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
			throw 'Wrong doc-root type to sort';
		}

		docRoot.sort(function(itemA, itemB) {
			return _.reduce(fields, function(total, field) {
				var valueA = itemA[field.name];
				var valueB = itemB[field.name];
				var result = 0;

				if (valueA > valueB) {
					result = 1;
				} else if (valueA < valueB)  {
					result = -1;
				}

				if (field.orderAsc !== true) {
					result *= -1;
				}

				return total + result;
			}, 0);
		});

		this.pass(type, document, context);
	};
};
