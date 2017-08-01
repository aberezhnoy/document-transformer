'use strict';
var $ = require('jquery');

module.exports = {
	performBriefReport: function(model) {
		var config = {
			reportId: 'brief',

			transformations: [
				{
					id: 'sort',
					enabled: true,
					config: {
						fields: [
							{
								name: model.get('sortField'),
								orderAsc: model.get('sortOrder') === 'asc'
							}
						]
					}
				},

				{
					id: 'csv-output',
					enabled: model.get('csvEnabled'),
					config: {
						separator: model.get('csvSeparator')
					}
				},

				{
					id: 'sql-output',
					enabled: model.get('sqlEnabled'),
					config: {
						tableName: model.get('sqlTable')
					}
				}
			]
		};

		return $.ajax({
			url: '/reddit-reports',
			type: 'post',
			contentType: 'application/json; charset=UTF-8',
			data: JSON.stringify(config),
			dataType: 'json'
		});
	},

	performOverviewReport: function(model) {
		var config = {
			reportId: 'overview',

			transformations: [
				{
					id: 'sort',
					enabled: true,
					config: {
						fields: [
							{
								name: model.get('sortField'),
								orderAsc: model.get('sortOrder') === 'asc'
							}
						]
					}
				},

				{
					id: 'csv-output',
					enabled: model.get('csvEnabled'),
					config: {
						separator: model.get('csvSeparator')
					}
				},

				{
					id: 'sql-output',
					enabled: model.get('sqlEnabled'),
					config: {
						tableName: model.get('sqlTable')
					}
				}
			]
		};

		return $.ajax({
			url: '/reddit-reports',
			type: 'post',
			contentType: 'application/json; charset=UTF-8',
			data: JSON.stringify(config),
			dataType: 'json'
		});
	}
};
