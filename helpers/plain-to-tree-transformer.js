'use strict';
var _ = require('underscore');
var beautify = require('js-beautify').js_beautify;
var relationSource = require('../relation-structure.json');

var binarySearch = function(arrIn, item, comparator, showInsertIndex) {
	var bot = 0;
	var top = arrIn.length;

	while (bot < top) {
		var median = Math.floor((bot + top) / 2);
		var cmpResult = comparator(arrIn[median], item);

		if (cmpResult > 0) {
			top = median;
		} else if (cmpResult < 0) {
			bot = median + 1;
		} else if (!showInsertIndex) {
			return median;
		}
	}

	return showInsertIndex ? bot : -1;
};

var plainToTreeTransform = function(arrIn) {
	arrIn.sort(function(itemA, itemB) {
		return itemA.parentId - itemB.parentId;
	});

	for (var i = arrIn.length - 1; i >= 0; i--) {
		var item = arrIn[i];

		var idx = binarySearch(arrIn, item.parentId, function(item, parentId) {
			return item.id - parentId;
		});

		if (idx >= 0) {
			var targetItem = arrIn[idx];

			if (!targetItem.children) {
				targetItem.children = [];
			}

			targetItem.children.push(item);

			// splice last element in array cost O(1) time
			arrIn.splice(i, 1);
		}
	}

	return arrIn;
};

console.log(beautify(JSON.stringify(plainToTreeTransform(relationSource)), { indent_size: 4 }));
