'use strict';

var transformations = {
	sort: require('../helpers/sort-transformer'),
	csv: require('../helpers/output-transformer-csv'),
	sql: require('../helpers/output-transformer-sql'),
	'tree-to-plain': require('../helpers/tree-to-plain-transformer'),
	file: require('../helpers/output-fs-storage')
};

module.exports = {
	create: function(type, config) {
		var transformer = transformations[type];

		if (!transformer) {
			throw 'Unknown transformer `' + type + '`';
		}

		return transformer(config);
	}
};
