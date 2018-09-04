import dateHelper from '../helpers/dateHelper';

describe('dateHelpers', () => {
    it('addDaysToDate method works', () => {
        const format = (d) => {
            const currDate = newDate.getDate();
            const currMonth = newDate.getMonth();
            const currYear = newDate.getFullYear();
            return [currDate, currMonth, currYear].join('.');
        }
        const days = 5;
        const date = new Date(2018, 2, 1);
        const newDate = dateHelper.addDaysToDate(date, days);
        const expectDate = '6.2.2018';
        
        expect(format(newDate)).toBe(expectDate);
    });
});
