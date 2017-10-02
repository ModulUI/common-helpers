'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.noZero = exports.cleanValue = exports.parseNumber = undefined;

var _validateHelper = require('./validateHelper');

var parseNumber = exports.parseNumber = function parseNumber(value) {
	if ((0, _validateHelper.isEmpty)(value)) return null;
	var viewValue = value;
	if (value.replace) {
		viewValue = cleanValue(value);
		if ((0, _validateHelper.isValidNumber)(viewValue)) {
			var num = parseFloat(viewValue.replace(',', '.'));
			if (!isNaN(num)) return num;
		}
		return viewValue;
	}
	return viewValue;
};

var cleanValue = exports.cleanValue = function cleanValue(val) {
	var float = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	var result = val.replace(/[^0-9\.,]+/g, '').replace('.', ',');
	var commaPos = result.indexOf(',');
	if (float) {
		if (commaPos > -1) {
			var output = result.split(',');
			result = output.shift() + ',' + output.join('');
		}
	} else {
		//берем только целую часть
		if (commaPos >= 0) {
			result = result.substr(0, commaPos);
		}
	}

	return result;
};

var noZero = exports.noZero = function noZero(str) {
	return str && str.replace ? str.replace(/0*/g, '').replace(/,*/, '').length == 0 : false;
};