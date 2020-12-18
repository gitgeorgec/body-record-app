import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../lib/dayjs-utils';

const propTypes = {
	x: PropTypes.number,
	y: PropTypes.number,
	payload: PropTypes.object,
};

function DateTick({
	x,
	y,
	payload,
}) {
	return (
		<g transform={`translate(${x},${y})`}>
			<text
				x={0}
				y={0}
				dy={16}
				textAnchor="end"
				fill="#666"
				transform="rotate(-30)"
			>
				{formatDate(payload.value)}
			</text>
		</g>
	);
}

DateTick.propTypes = propTypes;

export default DateTick;
