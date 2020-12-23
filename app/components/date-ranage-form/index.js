import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, DatePicker } from 'antd-mobile';
import { formatDate, convertDateStringToTimestamp } from '../../lib/dayjs-utils';
import dayjs from 'dayjs';
import './style.styl';

const PREFIX_CLASS = 'date-range-form';
const propTypes = {
	onChange: PropTypes.func.isRequired,
	defaultDates: PropTypes.object,
};

function DateRangeForm({
	onChange,
	defaultDates,
}) {
	const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);
	const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);
	const [startDate, setStartDate] = useState(formatDate(defaultDates.startDate));
	const [endDate, setEndDate] = useState(formatDate(defaultDates.endDate));

	useEffect(() => {
		onChange({ startDate, endDate });
	}, [startDate, endDate]);

	return (
		<div className={PREFIX_CLASS}>
			<div className={`${PREFIX_CLASS}__setting-buttons`}>
				<Button
					size="small"
					type="primary"
					onClick={() => {
						setStartDate(formatDate(dayjs().startOf('day').subtract(1, 'year')));
						setEndDate(formatDate(dayjs().startOf('day')));
					}}
				>
					一年
				</Button>
				<Button
					size="small"
					type="primary"
					onClick={() => {
						setStartDate(formatDate(dayjs().startOf('day').subtract(9, 'months')));
						setEndDate(formatDate(dayjs().startOf('day')));
					}}
				>
					九個月
				</Button>
				<Button
					size="small"
					type="primary"
					onClick={() => {
						setStartDate(formatDate(dayjs().startOf('day').subtract(6, 'months')));
						setEndDate(formatDate(dayjs().startOf('day')));
					}}
				>
					六個月
				</Button>
				<Button
					size="small"
					type="primary"
					onClick={() => {
						setStartDate(formatDate(dayjs().startOf('day').subtract(3, 'months')));
						setEndDate(formatDate(dayjs().startOf('day')));
					}}
				>
					三個月
				</Button>
				<Button
					size="small"
					type="primary"
					onClick={() => {
						setStartDate(formatDate(dayjs().startOf('day').subtract(30, 'days')));
						setEndDate(formatDate(dayjs().startOf('day')));
					}}
				>
					三十天
				</Button>
			</div>
			<div className={`${PREFIX_CLASS}__dates`}>
				<div onClick={() => setIsStartDatePickerVisible(true)}>
					開始日期: {startDate}
				</div>
				<DatePicker
					mode="date"
					format="YYYY-MM-DD"
					visible={isStartDatePickerVisible}
					value={new Date(convertDateStringToTimestamp(startDate))}
					onOk={date => {
						setStartDate(formatDate(date));
						setIsStartDatePickerVisible(false);
					}}
					onDismiss={() => setIsStartDatePickerVisible(false)}
				/>
				<div onClick={() => setIsEndDatePickerVisible(true)}>
					結束日期: {endDate}
				</div>
				<DatePicker
					mode="date"
					format="YYYY-MM-DD"
					visible={isEndDatePickerVisible}
					value={new Date(convertDateStringToTimestamp(endDate))}
					onOk={date => {
						setEndDate(formatDate(date));
						setIsEndDatePickerVisible(false);
					}}
					onDismiss={() => setIsEndDatePickerVisible(false)}
				/>
			</div>
		</div>
	);
}

DateRangeForm.propTypes = propTypes;

export default DateRangeForm;
