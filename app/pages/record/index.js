import React, { useState, useEffect, useContext } from 'react';
import { BodyDataContext } from '../../context';
import {
	convertDateStringToTimestamp,
	formatDate,
} from '../../lib/dayjs-utils';
import dayjs from 'dayjs';
import DateRangeForm from '../../components/date-ranage-form';
import VisxChart from '../../components/visx-chart';
import { ParentSize } from '@visx/responsive';
import './style.styl';

const PREFIX_CLASS = 'record-page';
const defaultDates = {
	startDate: dayjs().startOf('month').startOf('day'),
	endDate: dayjs().endOf('month').startOf('day'),
};

function RecordPage() {
	const [xDomain, setXDomain] = useState([dayjs().subtract(3, 'day'), dayjs().add(3, 'day')]);
	const [selectData, setSelectData] = useState({});
	const { bodyData } = useContext(BodyDataContext);

	useEffect(() => {
		_handleUpdateDateRange(defaultDates);
	}, []);

	function _handleUpdateDateRange({ startDate, endDate }) {
		setXDomain([
			convertDateStringToTimestamp(startDate),
			convertDateStringToTimestamp(endDate),
		]);
	}

	function _renderSelectInfo() {
		const {
			date,
			weight,
			bodyFat,
			muscle,
			fat,
		} = selectData;

		return (
			<div className={`${PREFIX_CLASS}__selected-info`}>
				<h4>date: {date ? formatDate(date) : null}</h4>
				<div>weight: {weight ? weight : null} kg</div>
				<div>fat: {fat ? fat : null} kg</div>
				<div>bodyFat: {bodyFat ? bodyFat : null} %</div>
				<div>muscle: {muscle ? muscle : null} %</div>
			</div>
		);
	}

	return (
		<div className={PREFIX_CLASS}>
			<DateRangeForm
				onChange={_handleUpdateDateRange}
				defaultDates={defaultDates}
			/>
			<div>
				<ParentSize>
					{parent => (
						<VisxChart
							width={parent.width}
							height={400}
							data={bodyData}
							xDomain={xDomain}
							onTouchMove={setXDomain}
							onClick={setSelectData}
						/>
					)}
				</ParentSize>
			</div>
			{_renderSelectInfo()}
		</div>
	);
}

export default RecordPage;
