"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Склонение слова по кол-ву
 * @param number
 * @param one
 * @param two
 * @param five
 * @returns {*}
 */
var pluralize = exports.pluralize = function pluralize(number, one, two, five) {
	number = Math.abs(number);
	number %= 100;
	if (number >= 5 && number <= 20) {
		return five;
	}
	number %= 10;
	if (number == 1) {
		return one;
	}
	if (number >= 2 && number <= 4) {
		return two;
	}
	return five;
};