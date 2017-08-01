'use strict';
var _ = require('underscore');
var $ = require('jquery');
var Epoxy = require('backbone.epoxy');
var RedditReportsDao = require('./reports-dao/reddit-com-reports');
var reportModel = require('./reddit-report-model');
var reportPaneElement;

var initBindings = function(model) {
	var OutputConfigBinding = Epoxy.View.extend({
		el: "#outputConfig",

		bindings: {
			'input.csv-enabled': 'checked:csvEnabled',
			'input.csv-separator': 'value:csvSeparator,events:[\'keyup\']',

			'input.sql-enabled': 'checked:sqlEnabled',
			'input.sql-table-name': 'value:sqlTable,events:[\'keyup\']'
		}
	});

	var RedditBriefConfigBinding = Epoxy.View.extend({
		el: "#redditBriefReport",

		bindings: {
			'select.reddit-sort-field': 'value:sortField',
			'select.reddit-sort-order': 'value:sortOrder'
		}
	});

	var RedditOverviewConfigBinding = Epoxy.View.extend({
		el: "#redditOverviewReport",

		bindings: {
			'select.reddit-sort-field': 'value:overviewSortField',
			'select.reddit-sort-order': 'value:overviewSortOrder'
		}
	});

	new OutputConfigBinding({model: model});
	new RedditBriefConfigBinding({model: model});
	new RedditOverviewConfigBinding({model: model});
};

var initReportSelector = function() {
	$('#reportSelector')
		.click(function(evt) {
			$(this).find('li.active').removeClass('active');
			var reportId = $(evt.target).parent()
				.addClass('active')
				.attr('data-report-id');

			reportPaneElement.find('> .report.active').removeClass('active');
			reportPaneElement.find('> .report[data-report-id=' + reportId +']').addClass('active');
		})
		.find('[data-report-id=brief] > a').click();
};

var initDom = function() {
	reportPaneElement = $('#redditReports');

	var briefReportPaneElement = $('#redditBriefReport');
	briefReportPaneElement.find('.perform-report').click(function () {
		if (!validateAndShowErrors()) { return; }

		var btn = $(this);
		if (btn.hasClass('disabled')) { return; }
		btn.addClass('disabled');

		RedditReportsDao.performBriefReport(reportModel)
			.done(function(downloadLinks) {
				var linksPaneElement = briefReportPaneElement
					.find('.download-links')
					.removeClass('hidden')
						.find('.content');

				renderDownloadLinks(downloadLinks.link, linksPaneElement);
				btn.removeClass('disabled');
			});
	});

	var overviewReportPaneElement = $('#redditOverviewReport');
	overviewReportPaneElement.find('.perform-report').click(function () {
		if (!validateAndShowErrors()) { return; }

		var btn = $(this);
		if (btn.hasClass('disabled')) { return; }
		btn.addClass('disabled');

		RedditReportsDao.performOverviewReport(reportModel)
			.done(function(downloadLinks) {
				var linksPaneElement = overviewReportPaneElement
					.find('.download-links')
					.removeClass('hidden')
						.find('.content');

				renderDownloadLinks(downloadLinks.link, linksPaneElement);
				btn.removeClass('disabled');
			});
	});
};

var renderDownloadLinks = function(links, element) {
	var html = [];

	if (links.csv) {
		html.push('<a href="' + _.escape(links.csv) + '">Download CSV File</a>');
	}

	if (links.sql) {
		html.push('<a href="' + _.escape(links.sql) + '">Download SQL File</a>');
	}

	element.empty().append(html.join('<br/>'));
};

var validateAndShowErrors = function() {
	var outputConfigPaneElement = $('#outputConfig');

	outputConfigPaneElement.find('.has-error').removeClass('has-error');

	if (!reportModel.isValid()) {
		_.each(reportModel.validationError, function(error) {
			if (error.field === '__CROSS_FIELD__') {
				$('#outputFormatCSV_Enabled,#outputFormatSQL_Enabled')
					.parent()
					.parent()
						.addClass('has-error');
			} else if (error.field === 'csvSeparator') {
				$('#outputFormatCSV_Separator')
					.focus()
					.parent()
						.addClass('has-error');
			} else if (error.field === 'sqlTable') {
				$('#outputFormatSQL_TableName')
					.focus()
					.parent()
						.addClass('has-error');
			}
		});

		return false;
	}

	return true;
};

initBindings(reportModel);
initDom();
initReportSelector();
