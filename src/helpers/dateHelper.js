const isString = (value) => {
	if (typeof value == 'string' || value instanceof String) return true;
	return false
};

const _compare = (str1, str2) => {
	return typeof(str1) === 'string' && typeof(str2) === 'string' && str1.toLowerCase() === str2.toLowerCase();
}

export default {

	currentLocal: 'ru',
	validParts: /[dDjlNSwzWFmMntLoYyaABgGhHisueTIOPZcrU]/g,
	separators: /[ \-+\/\.T:@]/g,

	masks: {
		"default": "dd mmm yyyy",
		"default:R": "dd mmmm:R yyyy",
		"default:RC": "dd mmmm:R yyyy:C",
		"default:I": "dd mmmm:I yyyy",
		"defaultshortday": "d mmm yyyy",
		shortDate: "m/d/yy",
		mediumDate: "mmm d, yyyy",
		longDate: "mmmm d, yyyy",
		fullDate: "dddd, mmmm d, yyyy",
		shortTime: "h:MM TT",
		mediumTime: "h:MM:ss TT",
		longTime: "h:MM:ss TT Z",
		isoDate: "yyyy-mm-dd",
		isoTime: "HH:MM:ss",
		isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
		isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
		time: "HH:MM",
		clever: "clever",
		cleverDate: 'cleverDate',
		dateTime: 'dd.mm.yyyy HH:MM',
		serverDateTime: "yyyy-mm-dd'T'HH:MM:ss'Z'"
	},

	i18n: {
		'ru': {
			dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
			monthName: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
			yesterday: 'Вчера',
			today: 'Сегодня',
			dateSeparator: '.',
			months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
				'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
		}
	},


	monthDeclinationRu(month){
		return (month == 3 || month == 8) ? this.i18n.ru.monthName[month - 1] + 'а' : this.i18n[this.currentLocal].monthName[month - 1].slice(0, -1) + 'я';
	},

	monthDeclinationRuPredlojniy(month){
		return (month == 3 || month == 8) ? this.i18n.ru.monthName[month - 1] + 'е' : this.i18n[this.currentLocal].monthName[month - 1].slice(0, -1) + 'е';
	},

	getDayName(day, countChar){
		var dayName = this.i18n[this.currentLocal].dayNames[day];
		if (countChar && countChar > 0) {
			return dayName.substring(0, 3);
		}
		return dayName;
	},

	getMonthName(monthNumber, declination, countChar){
		var monthName = declination ? this.monthDeclinationRu(monthNumber) : this.i18n.ru.monthName[monthNumber - 1];
		if (!countChar && countChar > 0) {
			return monthName.substring(0, 3);
		}
		return monthName;
	},

	getCurrentWeekDates(date){
		var now = date;
		var start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		var delta = start.getDay() > 0 ? 1 : -6;
		start.setDate(start.getDate() - start.getDay() + delta);
		var stop = new Date(start);
		stop.setDate(stop.getDate() + 6);

		return {
			startDate: start,
			stopDate: stop
		}
	},

	getLastWeekDates(date){
		var now = date;
		var start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		var delta = start.getDay() > 0 ? 1 : -6;
		start.setDate(start.getDate() - start.getDay() + delta - 7);
		var stop = new Date(start);
		stop.setDate(stop.getDate() + 6);

		return {
			startDate: start,
			stopDate: stop
		}
	},

	getCurrentMonthDates(date){
		var now = date;
		var start = new Date(now.getFullYear(), now.getMonth(), 1);
		var stop = new Date(now.getFullYear(), now.getMonth(), this.daysInMonth(now));

		return {
			startDate: start,
			stopDate: stop
		}
	},

	getLastMonthDates(date){
		var now = date;
		var start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		var firstDayInlastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		var stop = new Date(now.getFullYear(), now.getMonth() - 1, this.daysInMonth(firstDayInlastMonthDate));

		return {
			startDate: start,
			stopDate: stop
		}
	},

	getCurrentQuarterDates(date){
		var now = date,
			start = '',
			stop = '';

		switch (now.getMonth()) {
			case 0:
			case 1:
			case 2:
				start = new Date(now.getFullYear(), 0, 1);
				stop = new Date(now.getFullYear(), 2, 31);
				break;
			case 3:
			case 4:
			case 5:
				start = new Date(now.getFullYear(), 3, 1);
				stop = new Date(now.getFullYear(), 5, 30);
				break;
			case 6:
			case 7:
			case 8:
				start = new Date(now.getFullYear(), 6, 1);
				stop = new Date(now.getFullYear(), 8, 30);
				break;
			case 9:
			case 10:
			case 11:
				start = new Date(now.getFullYear(), 9, 1);
				stop = new Date(now.getFullYear(), 11, 31);
				break;
		}

		return {
			startDate: start,
			stopDate: stop
		}
	},

	getLast30DaysDates(date){
		var now = date;
		var start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		start.setDate(start.getDate() - 30);
		var stop = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		return {
			startDate: start,
			stopDate: stop
		}
	},

	getDateRange(date){
		var start = this.setStartDate(new Date(date.getTime()));
		var stop = this.setEndDate(new Date(date.getTime()));
		return {
			startDate: start,
			stopDate: stop
		}
	},

	getYesterday(){
		let date = new Date();
		date = this.setStartDate(date);
		return new Date(date.getTime() - 1000 * 60 * 60 * 24);
	},

	getCurrentYearDates(date){
		var now = date;
		var start = new Date(now.getFullYear(), 0, 1);
		var stop = new Date(now.getFullYear(), 11, 31);

		return {
			startDate: start,
			stopDate: stop
		}
	},

	countCalendarDayBetween(date1, date2){
		function createOnlyDate(date) {
			var d = new Date(date.getTime());
			d.setHours(0, 0, 0, 0);
			return d;
		}

		var _date1 = createOnlyDate(date1);
		var _date2 = createOnlyDate(date2);

		var dayCount = (_date1.getTime() - _date2.getTime()) / (24 * 60 * 60 * 1000);
		return Math.abs(dayCount);
	},

	isYesterday(now, date){
		return now > date && this.countCalendarDayBetween(now, date) == 1;
	},

	countHourBetween(date1, date2){
		return (date1 - date2) / (1000 * 60 * 60);
	},

	isValidDate(date){
		if (Object.prototype.toString.call(date) === "[object Date]") {
			if (isNaN(date.getTime())) {
				return false;
			}
			else {
				return true;
			}
		}
		else {
			return false;
		}
	},

	setStartDate(date){
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		return date;
	},

	setEndDate(date){
		date.setHours(23);
		date.setMinutes(59);
		date.setSeconds(59);
		return date;
	},

	dateFormat(date, format, alternativeFormat, dateTimeNow){
		var mask;
		var prefix = '';
		var token = /d{1,4}(?::?[C]?)|m{1,4}(?::?[IRCP]?)|yy(?:yy|y)?(?::?[IRC]?)|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
			timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
			timezoneClip = /[^-+\dA-Z]/g,
			pad = function (val, len) {
				val = String(val);
				len = len || 2;
				while (val.length < len) val = "0" + val;
				return val;
			};


		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date();
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(this.masks[format] || format || this.masks["default"]);

		// Allow setting the utc argument via the mask
		var utc = false;
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var now = dateTimeNow ? dateTimeNow : new Date();
		var currentYear = now.getFullYear(),
			currentMonth = now.getMonth(),
			currentDate = now.getDate(),
			yesterday = this.i18n[this.currentLocal].yesterday,
			//isYesterday = this.countCalendarDayBetween(now, date) == 1 && now > date;
			isYesterday = this.isYesterday(now, date);


		var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			isCurrentYear = y == currentYear,
			isCurrentMonth = (y == currentYear) && (m == currentMonth),
			isCurrentDay = (y == currentYear) && (m == currentMonth) && (d == currentDate),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d: d,
				dd: pad(d),
				//'dd:C':isYesterday?yesterday:(isCurrentDay?'': pad(d)),
				ddd: this.getDayName(D, 3),
				dddd: this.getDayName(D),
				m: m + 1,
				mm: pad(m + 1),
				mmm: this.getMonthName(m + 1, false, 3),
				mmmm: this.getMonthName(m + 1, false),
				'mmmm:I': this.getMonthName(m + 1, false, 0),
				'mmmm:R': this.getMonthName(m + 1, true, 0),
				'mmmm:P': this.monthDeclinationRuPredlojniy(m + 1),
				'mm:C': isYesterday || isCurrentDay ? '' : pad(m + 1),
				'yy:C': !isCurrentYear ? String(y).slice(2) : "",
				yy: String(y).slice(2),
				'yyyy:C': !isCurrentYear ? y : "",
				yyyy: y,
				yyy: y,
				h: H % 12 || 12,
				hh: pad(H % 12 || 12),
				H: H,
				HH: pad(H),
				M: M,
				MM: pad(M),
				s: s,
				ss: pad(s),
				l: pad(L, 3),
				L: pad(L > 99 ? Math.round(L / 10) : L),
				t: H < 12 ? "a" : "p",
				tt: H < 12 ? "am" : "pm",
				T: H < 12 ? "A" : "P",
				TT: H < 12 ? "AM" : "PM",
				Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		var separator;


		if (format == 'clever') {
			separator = this.i18n[this.currentLocal].dateSeparator;
			mask = alternativeFormat ? alternativeFormat : "dd" + separator + 'mm' + separator + 'yyyy:C' + ' HH:MM';
			if (isCurrentYear) {
				mask = "dd" + separator + 'mm' + ' HH:MM';
			}
			if (isCurrentDay) {
				mask = "HH:MM"
			}
			if (isYesterday) {
				mask = yesterday + ", HH:MM"
			}
		}

		if (format == 'cleverDate') {
			separator = this.i18n[this.currentLocal].dateSeparator;
			mask = alternativeFormat ? alternativeFormat : "dd" + separator + 'mm' + separator + 'yyyy:C';
			if (isCurrentYear) {
				mask = alternativeFormat ? alternativeFormat : "dd" + separator + 'mm';
			}
			if (isCurrentDay) {
				return this.i18n[this.currentLocal].today;
			}
			if (isYesterday) {
				return this.i18n[this.currentLocal].yesterday;
			}
		}

		if (format == 'transaction') {
			mask = 'd mmmm:R yyyy';

			if (isCurrentYear) {
				mask = 'dd mmmm:R';
			}
			if (isCurrentDay) {
				prefix = this.i18n[this.currentLocal].today + ', ';
				mask = 'HH:MM';
			}
			if (isYesterday) {
				prefix = this.i18n[this.currentLocal].yesterday + ', ';
				mask = 'HH:MM';
			}
		}

		if (format == 'full') {
			mask = 'd mmmm:R yyyy';

			if (isCurrentYear) {
				mask = 'dd mmmm:R, HH:MM';
			}
			if (isCurrentDay) {
				prefix = this.i18n[this.currentLocal].today + ', ';
				mask = 'HH:MM';
			}
			if (isYesterday) {
				prefix = this.i18n[this.currentLocal].yesterday + ', ';
				mask = 'HH:MM';
			}
		}

		var parsedDate = mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});

		return prefix + parsedDate;
	},

	stringToDate(dateString){
		if (!isString(dateString)) {
			return undefined;
		}

		var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)*\.*\d*(Z)?\s*$/;

		var date = new Date(NaN), month,
			parts = isoExp.exec(dateString);
		if (parts) {
			date = parts[parts.length - 1] == 'Z' ? new Date(Date.UTC(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6])) : new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]);
		}
		return date;
	},


	daysInMonth(date){
		return 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate(); //такой вот хак для вычисления количества дней в месяце
	},

	parseDate: function (vDate, vFormat) {
		var self = this, vFormatParts, vDateParts, i, vDateFlag = false, vTimeFlag = false, vDatePart, iDatePart,
			vMonth, vMeriIndex, vMeriOffset, len, mer,
			out = {date: null, year: null, month: null, day: null, hour: 0, min: 0, sec: 0};
		const vSettings = {
			months: self.i18n.ru.months,
			monthsShort: self.i18n.ru.months.map(n => n.substring(0, 3))
		};

		if (!vDate) {
			return undefined;
		}
		if (vDate instanceof Date) {
			return vDate;
		}
		if (typeof vDate === 'number') {
			return new Date(vDate);
		}
		if (vFormat === 'U') {
			i = parseInt(vDate);
			return i ? new Date(i * 1000) : vDate;
		}
		if (typeof vDate !== 'string') {
			return '';
		}
		vFormatParts = vFormat.match(self.validParts);
		if (!vFormatParts || vFormatParts.length === 0) {
			throw new Error("Invalid date format definition.");
		}
		vDateParts = vDate.replace(self.separators, '\0').split('\0');
		for (i = 0; i < vDateParts.length; i++) {
			vDatePart = vDateParts[i];
			iDatePart = parseInt(vDatePart);
			switch (vFormatParts[i]) {
				case 'y':
				case 'Y':
					len = vDatePart.length;
					if (len === 2) {
						out.year = parseInt((iDatePart < 70 ? '20' : '19') + vDatePart);
					} else if (len === 4) {
						out.year = iDatePart;
					}
					vDateFlag = true;
					break;
				case 'm':
				case 'n':
				case 'M':
				case 'F':
					if (isNaN(vDatePart)) {
						vMonth = vSettings.monthsShort.indexOf(vDatePart);
						if (vMonth > -1) {
							out.month = vMonth + 1;
						}
						vMonth = vSettings.months.indexOf(vDatePart);
						if (vMonth > -1) {
							out.month = vMonth + 1;
						}
					} else {
						if (iDatePart >= 1 && iDatePart <= 12) {
							out.month = iDatePart;
						}
					}
					vDateFlag = true;
					break;
				case 'd':
				case 'j':
					if (iDatePart >= 1 && iDatePart <= 31) {
						out.day = iDatePart;
					}
					vDateFlag = true;
					break;
				case 'g':
				case 'h':
					vMeriIndex = (vFormatParts.indexOf('a') > -1) ? vFormatParts.indexOf('a') :
						(vFormatParts.indexOf('A') > -1) ? vFormatParts.indexOf('A') : -1;
					mer = vDateParts[vMeriIndex];
					if (vMeriIndex > -1) {
						vMeriOffset = _compare(mer, vSettings.meridiem[0]) ? 0 :
							(_compare(mer, vSettings.meridiem[1]) ? 12 : -1);
						if (iDatePart >= 1 && iDatePart <= 12 && vMeriOffset > -1) {
							out.hour = iDatePart + vMeriOffset - 1;
						} else if (iDatePart >= 0 && iDatePart <= 23) {
							out.hour = iDatePart;
						}
					} else if (iDatePart >= 0 && iDatePart <= 23) {
						out.hour = iDatePart;
					}
					vTimeFlag = true;
					break;
				case 'G':
				case 'H':
					if (iDatePart >= 0 && iDatePart <= 23) {
						out.hour = iDatePart;
					}
					vTimeFlag = true;
					break;
				case 'i':
					if (iDatePart >= 0 && iDatePart <= 59) {
						out.min = iDatePart;
					}
					vTimeFlag = true;
					break;
				case 's':
					if (iDatePart >= 0 && iDatePart <= 59) {
						out.sec = iDatePart;
					}
					vTimeFlag = true;
					break;
			}
		}
		if (vDateFlag === true && out.year && out.month && out.day) {
			out.date = new Date(out.year, out.month - 1, out.day, out.hour, out.min, out.sec, 0);
		} else {
			if (vTimeFlag !== true) {
				return false;
			}
			out.date = new Date(0, 0, 0, out.hour, out.min, out.sec, 0);
		}
		return out.date;
	}

}