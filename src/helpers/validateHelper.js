const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9-])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const validEmail = (email) => {
	if ((email || '').length == 0)
		return true;
	return EMAIL_REGEXP.test(email);
};

export const onlyCyr = (string) => {
	return /^[а-яА-ЯёЁ][а-яА-ЯёЁ\-\s]*$/.test(string);
};

export const firstSymbolCyr = str => {
	if (str && str.length >= 1)
		return /^[а-яА-ЯёЁ]$/.test(str.charAt(0));
	return true;
};

export const validPassword = (password) => {
	return !isEmpty(password) && /^[A-Za-z0-9!"№%:;@#$%^&*(){}?_+=<>\~`§.\[\],\\\/|]+$/g.test(password); //должны быть буквы и цифры, заглавные и маленькие
};

export const validPasswordLength = (password) => {
	return !isEmpty(password) && password.length >= 8;
};

export const isEmpty = val => {
	return val === '' || val === null || val === undefined;
};

export const isRequired = (text) => (val) => isEmpty(val) ? text : undefined;

export const isCorrectInn = function (INN) {
	var factor1 = [2, 4, 10, 3, 5, 9, 4, 6, 8];
	var factor2 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
	var factor3 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
	var i = 0;
	var sum = 0;
	var sum2 = 0;
	var Result = false;
	var d;
	if (INN.length == 0) {
		Result = true;
	}
	else if (INN.length == 10) { //юр лицо
		sum = 0;
		for (i = 0; i <= 8; i++) {
			d = INN.slice(i, i + 1);
			sum += d * factor1[i];
		}
		sum = sum % 11;
		sum = sum % 10;
		Result = INN.slice(9, 10) == sum;

	}
	else if (INN.length == 12) {//физ лицо и ИП
		sum = 0;
		for (i = 0; i <= 9; i++) {
			d = INN.slice(i, i + 1);
			sum += d * factor2[i];
		}
		sum = sum % 11;
		sum = sum % 10;
		sum2 = 0;
		for (i = 0; i <= 10; i++) {
			d = INN.slice(i, i + 1);
			sum2 += d * factor3[i];
		}
		sum2 = sum2 % 11;
		sum2 = sum2 % 10;
		Result = INN.slice(10, 11) == sum &&
			INN.slice(11, 12) == sum2;
	}
	return Result;
};

export const isCorrectKpp = (val) => {
	if (!val)
		return true;
	return val.length === 9;
};

export const isValidNumber = val => {
	if (isEmpty(val))
		return true;
	return /^(0(\.|,)\d+|[1-9]+[0-9]*((\.|,)\d+)?|0)$/.test(val);
};


const CELLPHONE_REGEXP = /^[0-9]{10}$/;
export const getPlainNumber = (value) => {
	const tempNumber = value.replace ? value : value.toString();
	return tempNumber.replace(/[^0-9]+/g, '').substring(0, 10);
};

export const isValidPhone = phone => {
	if (isEmpty(phone))
		return true;
	phone = getPlainNumber(phone);
	if (phone.length <= 10)
		return CELLPHONE_REGEXP.test(phone);
	return false;
};




