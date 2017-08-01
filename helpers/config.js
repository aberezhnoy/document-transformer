'use strict';
var _ = require('underscore');
var TransformerFactory = require('./transformer-factory');
var ObjectHelpers = require('./object-helpers');
var conform = require('conform');

var genericConfig = {
	documentParsers: {
		json: function (body) {
			return JSON.parse(body);
		}
	},

	documentValidators: {
		json: function (doc, config) {
			var result = conform.validate(doc, config.jsonSchema);
			return result.valid;
		}
	}
};

module.exports = {
	create: function(config, inputConfig, additionalSteps) {
		// apply report config
		var reportConfigCopy = ObjectHelpers.clone(config);
		var build = _.extend({}, genericConfig, reportConfigCopy);

		// apply input config
		var inputConfigTransformations = inputConfig.transformations;
		delete inputConfig.transformations;
		_.extend(build, inputConfig);
		_.each(inputConfigTransformations, function(transformerConfig) {
			var id = transformerConfig.id;

			var transformer = _.find(build.transformations, function(transformer) {
				return transformer.id === id;
			});

			if (transformer && transformer.override !== false) {
				transformer.enabled = transformerConfig.enabled;
				_.extend(transformer.config, transformerConfig.config);
				var c = 0;
			}
		});

		// add additional steps
		if (_.isArray(additionalSteps) && additionalSteps.length > 0) {
			build.transformations.push.apply(build.transformations, additionalSteps);
		}

		// create transformers by config
		_.each(build.transformations, function(transformer, idx, transformations) {
			if (!_.isFunction(transformer) && _.isObject(transformer) && transformer.enabled === true) {
				transformations[idx] = TransformerFactory.create(transformer.transformer, transformer.config);
			}
		});

		// filter out disabled configurations
		build.transformations = _.filter(build.transformations, function(transformer) {
			return _.isFunction(transformer);
		});

		return build;
	}
};
