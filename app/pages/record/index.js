import React, { useState, useEffect, useContext } from 'react';
import { BodyDataContext } from '../../context';
import {
	convertDateStringToTimestamp,
	formatDate,
} from '../../lib/dayjs-utils';
import { Button, Modal } from 'antd-mobile';
import dayjs from 'dayjs';
import DateRangeForm from '../../components/date-ranage-form';
import VisxChart from '../../components/visx-chart';
import { ParentSize } from '@visx/responsive';
import { ExportOutlined } from '@ant-design/icons';
import './style.styl';

const PREFIX_CLASS = 'record-page';
const defaultDates = {
	startDate: dayjs().startOf('month').startOf('day'),
	endDate: dayjs().endOf('month').startOf('day'),
};

function RecordPage() {
	const [xDomain, setXDomain] = useState([dayjs().subtract(3, 'day'), dayjs().add(3, 'day')]);
	const [selectData, setSelectData] = useState({});
	const [ isExportModalVisible, setIsExportModalVisible ] = useState(false)
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
					<div>weight: {weight ? weight : null} kg</div>
					<div>muscle: {muscle ? muscle : null} kg</div>
					<div>fat: {fat ? fat : null} kg</div>
					<div>bodyFat: {bodyFat ? bodyFat : null} %</div>
				</div>
				<h4  style={{ textAlign: 'center', width: '100%'}}>
					備註
				</h4>
				<div style={{ textAlign: 'center', width: '100%', color: 'red'}}>
					{description}
				</div>
			</>
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
			<Button
				onClick={() => setIsExportModalVisible(true)}
				style={{
					background: '#FCAE48',
					position: 'absolute',
					bottom: '60px',
					right: '20px',
					borderRadius: '50%',
					height: '30px',
					width: '30px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					boxShadow: '1px 1px 1px rgba(0,0,0,0.3)'
				}}
			>
				<ExportOutlined />
			</Button>
			<Modal
				popup
				visible={isExportModalVisible}
				onClose={() => setIsExportModalVisible(false)}
				animationType="slide-up"
			>
				<div
					style={{
						padding: '10px',
						display: 'flex',
						background: '#FFE8C9',
						height: '65vh',
						overflowWrap: 'anywhere'
					}}
				>
					{ JSON.stringify(bodyData) }
				</div>
			</Modal>
		</div>
	);
}

export default RecordPage;
