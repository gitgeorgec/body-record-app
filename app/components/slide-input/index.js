import React from 'react';
import PropTypes from 'prop-types';
import { Slider, Button } from 'antd-mobile';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import './style.styl';

const PREFIX_CLASS = 'slide-input';
const propTypes = {
	onChange: PropTypes.func.isRequired,
	value: PropTypes.number.isRequired,
	step: PropTypes.number,
	range: PropTypes.array,
};
const defaultProps = {
	step: 1,
	range: [0, 100],
};

function SlideInput({
	onChange,
	value,
	step,
	range,
}) {
	const [min, max] = range;
	const mutileValue = (1 / step);

	return (
		<div className={PREFIX_CLASS}>
			<Button
				onClick={() => onChange(((value * mutileValue) - 1) / mutileValue)}
				type="ghost"
			>
				<MinusCircleOutlined/>
			</Button>
			<Slider
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={onChange}
			/>
			<Button
				onClick={() => onChange(((value * mutileValue) + 1) / mutileValue)}
				type="ghost"
			>
				<PlusCircleOutlined/>
			</Button>
		</div>
	);
}

SlideInput.propTypes = propTypes;
SlideInput.defaultProps = defaultProps;

export default SlideInput;
