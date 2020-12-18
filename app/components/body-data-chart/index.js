import React from 'react';
import PropTypes from 'prop-types';
import {
	ResponsiveContainer,
	LineChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Line,
	Tooltip,
	Legend,
} from 'recharts';
import DateTick from './date-tick';

const propTypes = {
	bodyData: PropTypes.array,
	xDomain: PropTypes.array,
	onClickLineChart: PropTypes.func,
};

function BodyDataChart({
	bodyData,
	xDomain,
	onClickLineChart,
}) {
	return (
		<ResponsiveContainer minHeight="380px">
			<LineChart
				data={bodyData}
				margin={{ top: 10, right: 0, left: 0, bottom: 50 }}
				onClick={onClickLineChart}
			>
				<CartesianGrid strokeDasharray="3 3"/>
				<XAxis
					dataKey="date"
					domain={xDomain}
					tick={<DateTick/>}
					interval={0}
					type="number"
					padding={{ left: 10, right: 10 }}
					allowDataOverflow
				/>
				<YAxis
					yAxisId="left"
					type="number"
					domain={[30, 80]}
				/>
				<YAxis
					interval={0}
					type="number"
					yAxisId="right"
					orientation="right"
					domain={[0, 100]}
					ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
				/>
				<Legend verticalAlign="top" height={36}/>
				<Tooltip
					content={() => {}}
				/>
				<Line type="monotone" yAxisId="left" dataKey="weight" stroke="#8884d8" strokeWidth="3px"/>
				<Line type="monotone" yAxisId="right" dataKey="bodyFat" stroke="#82ca9d" strokeWidth="3px"/>
				<Line type="monotone" yAxisId="right" dataKey="muscle" stroke="#821a9d" strokeWidth="3px"/>
			</LineChart>
		</ResponsiveContainer>
	);
}

BodyDataChart.propTypes = propTypes;

export default BodyDataChart;
