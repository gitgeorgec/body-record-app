import React, { useState, useEffect, useContext } from 'react';
import { BodyDataContext } from '../../context';
import {
	convertDateStringToTimestamp,
	formatDate,
} from '../../lib/dayjs-utils';
import { Button } from 'antd-mobile';
import dayjs from 'dayjs';
import DateRangeForm from '../../components/date-ranage-form';
import VisxChart from '../../components/visx-chart';
import { ParentSize } from '@visx/responsive';
import { ExportOutlined } from '@ant-design/icons';
import { themeLight } from '../../colors/color';
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
			description
		} = selectData;

		return (
			<>
				<div className={`${PREFIX_CLASS}__selected-info`}>
					<h4>date: {date ? formatDate(date) : null}</h4>
					<div>
						<div style={{ display: 'inline-block', background: 'blue', width: 10, height: 10, borderRadius: '50%', marginRight: 5 }}></div>
						weight: {weight ? weight : null} kg
					</div>
					<div>
						<div style={{ display: 'inline-block', background: 'pink', width: 10, height: 10, borderRadius: '50%', marginRight: 5 }}></div>
						muscle: {muscle ? muscle : null} kg
					</div>
					<div>
						<div style={{ display: 'inline-block', background: 'purple', width: 10, height: 10, borderRadius: '50%', marginRight: 5 }}></div>
						fat: {fat ? fat : null} kg
					</div>
					<div>
						<div style={{ display: 'inline-block', background: 'yellow', width: 10, height: 10, borderRadius: '50%', marginRight: 5 }}></div>
						bodyFat: {bodyFat ? bodyFat : null} %
					</div>
				</div>
				<h4 style={{ textAlign: 'center', width: '100%', margin: '3px'}}>
					備註
				</h4>
				<div style={{ textAlign: 'center', width: '100%'}}>
					{description}
				</div>
			</>
		);
	}

	function _downLoadData() {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(bodyData)));
		element.setAttribute('download', 'body-record.text');
		element.style.display = 'none';

		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
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
			<Button
				onClick={_downLoadData}
				style={{
					background: themeLight.btnBg2,
					color: 'white',
					position: 'absolute',
					bottom: '60px',
					right: '20px',
					borderRadius: '50%',
					height: '30px',
					width: '30px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					boxShadow: '1px 1px 2px rgba(0,0,0,0.3)'
				}}
			>
				<ExportOutlined />
			</Button>
		</div>
	);
}

export default RecordPage;
