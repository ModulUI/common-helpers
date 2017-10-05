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

/**
 * Отсекаем лишние символы после в дробной части, из 2.1121 -> 2.11
 * @param str
 * @param char
 * @param round
 * @returns {*}
 */
export const trimValidLength = (str, char, round) => {
    let resultStr = str;
    let lengthAfterChar = 0;
    if (str.lastIndexOf(char) >= 0)
        lengthAfterChar = str.length - str.lastIndexOf(char) - 1; //без учета точки

    let trimLength = lengthAfterChar - round; //сколько лишних символов нужно отрезать с конца
    if (trimLength > 0) {
        resultStr = str.substr(0, str.length - trimLength);
    }

    return resultStr;
};