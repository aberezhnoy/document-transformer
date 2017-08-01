'use strict';
var _ = require('underscore');

var ObjectHelpers = {
	getByPath: function(path, obj) {
		var value = obj;
		var pathItems = path.split('.');

		for (var idx in pathItems) {
			if (!pathItems.hasOwnProperty(idx)) { continue; }
			var pathItem = pathItems[idx];
			if (!value) { return null; }

			if (_.isArray(value)) {
				value = value[parseInt(pathItem, 10)];
			} else if (_.isObject(value)) {
				value = value[pathItem];
			} else {
				return null;
			}
		}

		return value;
	},

	clone: function(obj) {
		var _copy = function(item) {
			if ((_.isArray(item) || _.isObject(item)) && !_.isFunction(item)) {
				return ObjectHelpers.clone(item);
			} else {
				return item;
			}
		};

		if (_.isArray(obj)) {
			return _.map(obj, _copy);
		} else if (_.isObject(obj)) {
			return _.mapObject(obj, _copy);
		}

		return obj;
	}
};

module.exports = ObjectHelpers;
