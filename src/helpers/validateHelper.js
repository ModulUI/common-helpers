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

export const validPasswordLength = password => !isEmpty(password) && password.length >= 8;

export const isEmpty = val => val === '' || val === null || val === undefined;

export const isRequired = text => val => isEmpty(val) ? text : undefined;

export const isCorrectInn = function (inn) {
	var factor1 = [2, 4, 10, 3, 5, 9, 4, 6, 8];
	var factor2 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
	var factor3 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
	var i = 0;
	var sum = 0;
	var sum2 = 0;
	var result = false;
	var d;
	if (inn.length == 0) {
		result = true;
	}
	else if (inn.length == 10) { //юр лицо
		sum = 0;
		for (i = 0; i <= 8; i++) {
			d = inn.slice(i, i + 1);
			sum += d * factor1[i];
		}
		sum = sum % 11;
		sum = sum % 10;
		result = inn.slice(9, 10) == sum;

	}
	else if (inn.length == 12) {//физ лицо и ИП
		sum = 0;
		for (i = 0; i <= 9; i++) {
			d = inn.slice(i, i + 1);
			sum += d * factor2[i];
		}
		sum = sum % 11;
		sum = sum % 10;
		sum2 = 0;
		for (i = 0; i <= 10; i++) {
			d = inn.slice(i, i + 1);
			sum2 += d * factor3[i];
		}
		sum2 = sum2 % 11;
		sum2 = sum2 % 10;
		result = inn.slice(10, 11) == sum &&
			inn.slice(11, 12) == sum2;
	}
	return result;
};

export const isCorrectKpp = val => !val || val.length === 9

export const isCorrectControlKeyBankAccount = (bankAccount, bik) => {
  if (!bankAccount || !bik) return false;
  const coefficient = [7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1];
  let controlNumber = bik.toString().substr(-3);
  if (controlNumber <= 2) {
    controlNumber = '0'.concat(bik.toString().substr(-5, 2));
  }
  const tempAcccount = controlNumber.concat(bankAccount);
  let sum = 0;
  for (let i = 0; i < tempAcccount.length; i++) {
    sum += (Number(tempAcccount.charAt(i)) * coefficient[i]) % 10;
  }
  return sum % 10 === 0;
};

export const isCorrectSnils = function (snils) {
  if (snils.length !== 11 && !/^\d*$|^$/.test(snils)) return false;
  if (snils < 1001998) return false;
  const part = snils.slice(0, 9);
  let sum = 0;
  for (let i = 0; i < part.length; i++) {
    sum += part[i] * (part.length - i);
  }
  /*eslint-disable*/
  if (sum < 100 && sum == snils.slice(-2)) return true;
  /*eslint-enable*/
  if (sum === 100 || sum === 101) snils.slice(-2) === '00';
  if (sum > 101) {
    sum %= 101;
    if (sum < 100 && sum === snils.slice(-2)) return true;
    if (sum === 100 || sum === 101) return snils.slice(-2) === '00';
  }
  return false;
};

export const isCorrectOgrn13 = o => o.slice(-1) === (`${ o.slice(0, -1) % 11 }`).slice(-1);

export const isCorrectOgrn15 = o => o.slice(-1) === (`${ o.slice(0, -1) % 13 }`).slice(-1);

export const isOgrn = ogrn => {
  if (!ogrn) { return true; }
  // проверяем длину
  if (ogrn.length !== 13 && ogrn.length !== 15) { return false; }
  // проверяем число ли
  if (!/^\d+$|^$/.test(ogrn)) { return false; }
  // проверяем контрольную сумму
  if (ogrn.length === 15) { return isCorrectOgrn15(ogrn); }
  return isCorrectOgrn13(ogrn);
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




