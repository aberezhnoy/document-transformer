'use strict';
var Steppy = require('twostep').Steppy;
var _ = require('underscore');
var request = require('request');

module.exports = {
	run: function(config, ready) {
		var preSteps = [
			// download document content
			function() {
				if (!config.url) {
					throw 'Document URL is undefined';
				}

				request(config.url, this.slot());
			},

			// determine document type
			function(err, res) {
				this.pass('json', res.body);
			},

			// parse document
			function(err, type, body) {
				var parser = config.documentParsers[type];

				if (_.isFunction(parser)) {
					this.pass(type, parser(body));
				} else {
					throw 'Parser for `' + type + '`not found';
				}
			},

			// validate document
			function(err, type, doc) {
				var validator = config.documentValidators[type];

				if (_.isFunction(validator) && !validator(doc, config)) {
					throw 'Document is not valid';
				}

				this.pass(type, doc);
			},

			// pass context to custom steps
			function (err, type, doc) {
				this.pass(type, doc, {});
			}
		];

		var postSteps = [
			// return result
			function(err, type, doc, context) {
				if (_.isFunction(ready)) {
					ready({
						error: err,
						type: type,
						document: doc,
						context: context
					});
				}
			},

			// handle errors
			function(err) {
				if (_.isFunction(ready)) {
					ready({
						error: err
					});
				}
			}
		];

		Steppy.apply(Steppy, preSteps.concat(config.transformations, postSteps));
	}
};
