'use strict';
var Backbone = require('backbone');

var RedditReportModel = Backbone.Model.extend({
	validate: function(attrs, options) {
		var errors = [];

		if (attrs.csvEnabled && !attrs.csvSeparator) {
			errors.push({
				field: 'csvSeparator',
				error: 'NOT_EMPTY',
				message: 'Field must be filled'
			});
		}

		if (attrs.sqlEnabled && !attrs.sqlTable) {
			errors.push({
				field: 'sqlTable',
				error: 'NOT_EMPTY',
				message: 'Field must be filled'
			});
		}

		if (!attrs.csvEnabled && !attrs.sqlEnabled) {
			errors.push({
				field: '__CROSS_FIELD__',
				error: 'AT_LEAST_ONE',
				message: ''
			});
		}

		if (errors.length > 0) {
			return errors;
		}
	}
});

module.exports = new RedditReportModel({
	// report config
	sortField: 'title',
	sortOrder: 'asc',

	overviewSortField: 'scoreSum',
	overviewSortOrder: 'asc',

	// output config
	csvEnabled: true,
	csvSeparator: ';',

	sqlEnabled: false,
	sqlTable: 'new_table'
});
