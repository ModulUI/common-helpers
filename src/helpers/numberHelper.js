import {isValidNumber, isEmpty} from './validateHelper'

export const parseNumber = (value) => {
	if (isEmpty(value))
		return null;
	let viewValue = value;
	if (value.replace) {
		viewValue = cleanValue(value);
		if (isValidNumber(viewValue)) {
			const num = parseFloat(viewValue.replace(',', '.'));
			if (!isNaN(num))
				return num;
		}
		return viewValue;
	}
	return viewValue;
};

export const cleanValue = (val, float = true) => {
	let result = val.replace(/[^0-9\.,]+/g, '').replace('.', ',');
	const commaPos = result.indexOf(',');
	if (float) {
		if (commaPos > -1) {
			const output = result.split(',');
			result = output.shift() + ',' + output.join('');
		}
	} else {//берем только целую часть
		if (commaPos >= 0) {
			result = result.substr(0, commaPos);
		}
	}

	return result;
};

export const noZero = (str) => {
	return str && str.replace ? str.replace(/0*/g, '').replace(/,*/, '').length == 0 : false;
};