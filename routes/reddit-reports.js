'use strict';
var router = require('express').Router();
var Config = require('../helpers/config');
var TransformProcess = require('../helpers/transform');
var RedditReports = require('../reports/reddit-com-reports');
var _ = require('underscore');
var crypto = require('crypto');
var path = require('path');

router.post('/',
	function(req, res, next) {
		var requestBean = req.body;
		var reportId = requestBean.reportId;
		var inputConfig = {
			transformations: requestBean.transformations
		};

		var report = _.find(RedditReports, function(RedditReport) {
			return RedditReport.id === reportId;
		});

		var configBuild = Config.create(report.config, inputConfig, [
			function(err, type, document, context) {
				var hash = crypto.createHash('md5').update(_.now() + 'some-salt').digest("hex");
				var file;
				context.fileName = {};
				context.downloadLink = {};

				if (context.csv) {
					file = hash + '.csv';
					context.fileName.csv = file;
					context.downloadLink.csv = '/reports/' + file;
				}

				if (context.sql) {
					file = hash + '.sql';
					context.fileName.sql = file;
					context.downloadLink.sql = '/reports/' + file;
				}

				this.pass(type, document, context);
			},

			{
				transformer: 'file',
				enabled: true,

				config: {
					inputKey: ['csv', 'sql'],
					path: path.join(__dirname, '..', 'work'),
					fileNameKey: 'fileName'
				}
			}
		]);

		TransformProcess.run(configBuild, function(context) {
			if (context.error) {
				req.resultError = context.error;
			} else {
				req.result = {
					link: context.context.downloadLink
				};
			}

			next();
		});
	},

	function(req, res) {
		if (req.resultError) {
			throw req.resultError;
		}

		res.json(req.result);
	}
);

module.exports = router;
