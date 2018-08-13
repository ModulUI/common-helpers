import * as validateHelper from './../helpers/validateHelper';

describe('validateHelpers', () => {
    describe('isCorrectSnils', () => {
        it('works on correct snils', () => {
            const snils = '10735815247';
            expect(validateHelper.isCorrectSnils(snils)).toBe(true);
        });
        it('expects as least 10 digits', () => {
            const snils = '103581527';
            expect(validateHelper.isCorrectSnils(snils)).toBe(false);
        });
        it('expects as most 11 digits', () => {
            const snils = '103581527111';
            expect(validateHelper.isCorrectSnils(snils)).toBe(false);
        });
        it('expects only numbers', () => {
            const snils = 'test string';
            expect(validateHelper.isCorrectSnils(snils)).toBe(false);
        });
        it('expect not empty string', () => {
            const snils = '';
            expect(validateHelper.isCorrectSnils(snils)).toBe(false);
        });
    });
});
