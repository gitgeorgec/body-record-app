import dayjs from 'dayjs';

export const DATE = 'YYYY-MM-DD';
export const DATE_TIME_SECONDS = 'YYYY/MM/DD HH:mm:ss';

export function formatDate(date = new Date(), format = DATE) {
	return dayjs(date).startOf('day').format(format);
}

export function convertDateStringToTimestamp(dateString = '', format = DATE_TIME_SECONDS) {
	return dayjs(dateString, format).valueOf();
}

export function convertStartOfDayToDateTimeString(from) {
	return dayjs(from).startOf('day').toISOString();
}

export function getRangeDates(startDate, endDate, format = 'YYYY-MM-DD') {
	let end = dayjs(endDate).startOf('day');

	let start = dayjs(startDate).startOf('day');

	const Dates = [];

	while (start <= end) {
		Dates.push(start.format(format));
		start = start.add(1, 'day');
	}

	return Dates;
}
