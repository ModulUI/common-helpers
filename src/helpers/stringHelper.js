/**
 * Склонение слова по кол-ву
 * @param number
 * @param one
 * @param two
 * @param five
 * @returns {*}
 */
export const pluralize = (number, one, two, five) => {
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

const isString = value => typeof value === 'string' || value instanceof String;

/**
 * Разделение числа на разряды с указанным разделителем
 */
const separateDigitsNumber = (number, separator) => {
    const sep = separator || '\xA0';
    if (!number && number !== 0) return;
    return number.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1' + sep);
};

/**
 * Замена десятичного разделителя
 */
const decimalSeparator = (number, oldSeparator, newSeparator) => {
    if (!number && number !== 0) return;
    return number.toString().replace(oldSeparator, newSeparator);
};

/**
 * Форматирование суммы
 * @param {Number,String} value
 * @param {boolean,string} withoutKopecks
 * @return {*}
 */
export const formatAmount = (value, withoutKopecks) => {
    if (!value && value !== 0) return;

    if (isString(value))
        value = parseFloat(value);

    if (withoutKopecks === "auto")
        withoutKopecks = Math.floor(value) === value;

    return withoutKopecks ?
        separateDigitsNumber(decimalSeparator(value.toFixed())) :
        separateDigitsNumber(decimalSeparator(value.toFixed(2), '.', ','));
};