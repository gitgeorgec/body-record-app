import React, { useState, useMemo, useCallback } from 'react';
import { Line } from '@visx/shape';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import { withTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max, extent, bisector } from 'd3-array';
import { LinePath } from '@visx/shape';
import { AxisLeft, AxisBottom, AxisRight } from '@visx/axis';
import { Group } from '@visx/group';
import { convertDateStringToTimestamp } from '../../lib/dayjs-utils';
import { curveMonotoneX } from '@visx/curve';
import throttle from 'lodash/throttle';
import { themeLight } from '../../colors/color';

const background = themeLight.cardBg;
const background2 = themeLight.btnBg;
const accentColor = themeLight.weightLine;
const accentColorDark = themeLight.line;
const axisBottomTickLabelProps = {
	textAnchor: 'middle',
	fontFamily: 'Arial',
	fontSize: 12,
	fontWeight: 600,
	fill: 'black',
};

const getDate = d => new Date(d.date);
const getWeightValue = d => d.weight;
const getBodyFatValue = d => d.bodyFat;
const getMuscleValue = d => d.muscle;
const getFatValue = d => d.fat;
const bisectDate = bisector(d => new Date(d.date)).left;

export default withTooltip(
	({
		width,
		height,
		margin = { top: 0, right: 0, bottom: 0, left: 0 },
		showTooltip,
		hideTooltip,
		tooltipData,
		tooltipTop = 0,
		tooltipLeft = 0,
		data,
		xDomain,
		onTouchMove,
		onClick,
	}) => {
		const [isDarg, setIsDrag] = useState(false);
		const [xPosition, setXPosition] = useState(0);

		// Bounds
		const xMax = width - margin.left - margin.right;
		const yMax = height - margin.top - margin.bottom;

		// Scales
		const dateScale = useMemo(() => scaleTime({
			range: [0, xMax],
			domain: extent(xDomain),
		}), [xMax, xDomain]);
		const weightValueScale = useMemo(() => scaleLinear({
			range: [yMax, 45],
			domain: [45, Math.min((max(data, getWeightValue) || 0) + 15, 65)],
			nice: true,
		}), [yMax, data]);
		const bodyFatValueScale = useMemo(() => scaleLinear({
			range: [yMax, 15],
			// domain: [10, Math.min(max(data, getBodyFatValue) || 0) + 30, 35],
			domain: [15, 35],
			nice: true,
		}), [yMax]);

		// Tooltip handler
		const handleTooltip = useCallback(event => {
			const { x } = localPoint(event) || { x: 0 };
			const x0 = dateScale.invert(x);
			const index = bisectDate(data, x0, 1);
			const d0 = data[index - 1];
			const d1 = data[index];

			let d = d0;

			if (d1 && getDate(d1)) {
				d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
			}

			if (d) {
				onClick(d);
				showTooltip({
					tooltipData: d,
					tooltipLeft: dateScale(d.date),
					tooltipTop: weightValueScale(getWeightValue(d)),
				});
			}
		}, [showTooltip, weightValueScale, dateScale, data]);

		const _handleTouchStart = event => {
			handleTooltip(event);
			const { x } = localPoint(event) || { x: 0 };

			setIsDrag(true);
			setXPosition(x);
		};

		const _handleTouchMove = event => {
			if (isDarg) {
				const { x } = localPoint(event) || { x: 0 };
				setXPosition(x);
				const dx = convertDateStringToTimestamp(dateScale.invert(xPosition)) - convertDateStringToTimestamp(dateScale.invert(x));

				onTouchMove([xDomain[0] + dx, xDomain[1] + dx]);
				hideTooltip();
			}
		};

		const _handleTouchEnd = () => {
			setIsDrag(false);
		};

		const _renderSelectLinePoint = (tooltipLeft, tooltipTop) => {
			return (
				<g>
					<circle
						cx={tooltipLeft}
						cy={tooltipTop + 1}
						r={4}
						fill="black"
						fillOpacity={0.1}
						stroke="black"
						strokeOpacity={0.1}
						strokeWidth={2}
						pointerEvents="none"
					/>
					<circle
						cx={tooltipLeft}
						cy={tooltipTop}
						r={4}
						fill={accentColorDark}
						stroke="white"
						strokeWidth={2}
						pointerEvents="none"
					/>
				</g>
			);
		};

		const numTicks = Math.floor((xDomain[1] - xDomain[0]) / 86400000);

		return (
			<svg
				width={width}
				height={height}
				onTouchStart={_handleTouchStart}
				onTouchMove={throttle(_handleTouchMove, 200)}
				onTouchEnd={_handleTouchEnd}
				onMouseDown={_handleTouchStart}
				onMouseMove={throttle(_handleTouchMove, 200)}
				onMouseUp={_handleTouchEnd}
				onMouseLeave={_handleTouchEnd}
			>
				<rect
					x={0}
					y={0}
					width={width}
					height={height}
					rx={15}
					fill="url(#area-background-gradient)"
				/>
				<LinearGradient id="area-background-gradient" from={background} to={background2}/>
				<LinearGradient id="weigth-stroke-gradient" from="white" to="white" toOpacity={0.8}/>
				<LinearGradient id="muscle-stroke-gradient" from="green" to="green" toOpacity={0.6}/>
				<LinearGradient id="body-fat-stroke-gradient" from="yellow" to="yellow" toOpacity={0.6}/>
				<LinearGradient id="fat-stroke-gradient" from="red" to="red" toOpacity={0.6}/>
				<GridRows
					scale={weightValueScale}
					width={xMax}
					strokeDasharray="3,3"
					stroke={accentColor}
					strokeOpacity={0.5}
					pointerEvents="none"
				/>
				<GridColumns
					scale={dateScale}
					height={yMax}
					strokeDasharray="3,3"
					stroke={accentColor}
					strokeOpacity={0.5}
					pointerEvents="none"
				/>
				<LinePath
					data={data}
					x={d => dateScale(getDate(d))}
					y={d => weightValueScale(getWeightValue(d))}
					yScale={weightValueScale}
					stroke="url(#weigth-stroke-gradient)"
					strokeWidth={3}
					curve={curveMonotoneX}
				/>
				<LinePath
					data={data}
					x={d => dateScale(getDate(d))}
					y={d => bodyFatValueScale(getMuscleValue(d))}
					yScale={bodyFatValueScale}
					strokeWidth={3}
					stroke="url(#muscle-stroke-gradient)"
					curve={curveMonotoneX}
				/>
				<LinePath
					data={data}
					x={d => dateScale(getDate(d))}
					y={d => bodyFatValueScale(getBodyFatValue(d))}
					yScale={bodyFatValueScale}
					strokeWidth={3}
					stroke="url(#body-fat-stroke-gradient)"
					curve={curveMonotoneX}
				/>
				<LinePath
					data={data}
					x={d => dateScale(getDate(d))}
					y={d => bodyFatValueScale(getFatValue(d))}
					yScale={bodyFatValueScale}
					strokeWidth={3}
					stroke="url(#fat-stroke-gradient)"
					curve={curveMonotoneX}
				/>
				<Group left={0} top={-25}>
					<AxisBottom
						top={yMax}
						scale={dateScale}
						numTicks={numTicks >= 7 ? 7 : numTicks}
						stroke="black"
						tickStroke="black"
						tickLabelProps={() => axisBottomTickLabelProps}
					/>
				</Group>
				<Group>
					<AxisRight
						scale={weightValueScale}
						numTicks={5}
						stroke="white"
						tickStroke="opacity"
						tickLabelProps={() => axisBottomTickLabelProps}
					/>
				</Group>
				<Group left={width}>
					<AxisLeft
						scale={bodyFatValueScale}
						numTicks={5}
						stroke="white"
						tickStroke="opacity"
						tickLabelProps={() => axisBottomTickLabelProps}
					/>
				</Group>
				{tooltipData && (
					<g>
						<Line
							from={{ x: tooltipLeft, y: 0 }}
							to={{ x: tooltipLeft, y: yMax }}
							stroke={accentColorDark}
							strokeWidth={2}
							pointerEvents="none"
							strokeDasharray="5,2"
						/>
						{_renderSelectLinePoint(tooltipLeft, tooltipTop)}
						{_renderSelectLinePoint(tooltipLeft, bodyFatValueScale(getBodyFatValue(tooltipData)))}
						{_renderSelectLinePoint(tooltipLeft, bodyFatValueScale(getMuscleValue(tooltipData)))}
						{_renderSelectLinePoint(tooltipLeft, bodyFatValueScale(getFatValue(tooltipData)))}
					</g>
				)}
			</svg>
		);
	}
);
