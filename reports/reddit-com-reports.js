'use strict';
var _ = require('underscore');
var ENDPOINT_URL = 'http://www.reddit.com/r/javascript/.json';
var validationSchema = require('../reddit-report-schema.json');

module.exports = [
	{
		id: 'brief',
		name: 'Brief Report',

		config: {
			url: ENDPOINT_URL,
			jsonSchema: validationSchema,

			transformations: [
				{
					id: 'transform',
					transformer: 'tree-to-plain',
					enabled: true,
					override: false,

					config: {
						root: 'data.children',
						outputKey: 'briefReportModel',
						fields: [
							{
								src: 'data.id',
								dest: 'id'
							},
							{
								src: 'data.title',
								dest: 'title'
							},
							{
								src: 'data.created_utc',
								dest: 'created'
							},
							{
								src: 'data.score',
								dest: 'score'
							}
						]
					}
				},

				{
					id: 'sort',
					transformer: 'sort',
					enabled: false,

					config: {
						inputKey: 'briefReportModel'
					}
				},

				{
					id: 'csv-output',
					transformer: 'csv',
					enabled: false,

					config: {
						inputKey: 'briefReportModel',
						outputKey: 'csv',
						fields: [
							{
								path: 'id',
								name: 'id'
							},
							{
								path: 'title',
								name: 'title'
							},
							{
								path: 'created',
								name: 'created'
							},
							{
								path: 'score',
								name: 'score'
							}
						]
					}
				},

				{
					id: 'sql-output',
					transformer: 'sql',
					enabled: true,

					config: {
						inputKey: 'briefReportModel',
						outputKey: 'sql',
						fields: [
							{
								key: 'id',
								name: 'id'
							},
							{
								key: 'title',
								name: 'title'
							},
							{
								key: 'created',
								name: 'created'
							},
							{
								key: 'score',
								name: 'score'
							}
						]
					}
				}
			]
		}
	},

	{
		id: 'overview',
		name: 'Overview Report',

		config: {
			url: ENDPOINT_URL,

			transformations: [
				function(err, type, document, context) {
					context.overviewReportModel = _.chain(document.data.children)
						.groupBy(function(record) {
							return record.data.domain;
						})
						.map(function(recordGroup, domain) {
							var sum = _.reduce(recordGroup, function(scoreSum, record) {
								return scoreSum + record.data.score;
							}, 0);

							return {
								domain: domain,
								articlesCount: recordGroup.length,
								scoreSum: sum
							};
						})
						.value();

					this.pass(type, document, context);
				},

				{
					id: 'sort',
					transformer: 'sort',
					enabled: true,
					override: false,

					config: {
						inputKey: 'overviewReportModel',
						fields: [
							{
								name: 'articlesCount',
								orderAsc: false
							}
						]
					}
				},

				{
					id: 'csv-output',
					transformer: 'csv',
					enabled: false,

					config: {
						inputKey: 'overviewReportModel',
						outputKey: 'csv',
						fields: [
							{
								path: 'domain',
								name: 'domain'
							},
							{
								path: 'articlesCount',
								name: 'articlesCount'
							},
							{
								path: 'scoreSum',
								name: 'scoreSum'
							}
						]
					}
				},

				{
					id: 'sql-output',
					transformer: 'sql',
					enabled: true,

					config: {
						inputKey: 'overviewReportModel',
						outputKey: 'sql',
						fields: [
							{
								key: 'domain',
								name: 'domain'
							},
							{
								key: 'articlesCount',
								name: 'articlesCount'
							},
							{
								key: 'scoreSum',
								name: 'scoreSum'
							}
						]
					}
				}
			]
		}
	}
];
