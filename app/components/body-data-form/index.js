import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, DatePicker,  } from 'antd-mobile';
import SlideInput from '../slide-input';
import { formatDate, convertDateStringToTimestamp } from '../../lib/dayjs-utils';
import { themeLight } from '../../colors/color';
import './style.styl';

const PREFIX_CLASS = 'body-data-form';
const propTypes = {
	onSubmit: PropTypes.func.isRequired,
};

function BodyDataForm({
	onSubmit,
}) {
	const [date, setDate] = useState(formatDate());
	const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
	const [weight, setWeight] = useState(52);
	const [muscle, setMuscle] = useState(30);
	const [bodyFat, setBodyFat] = useState(20);
	const [fat, setFat] = useState(20);
	const [description, setDescription] = useState('')

	function _handleSubmit(e) {
		e.preventDefault();

		onSubmit({
			date: convertDateStringToTimestamp(date),
			weight: weight ? weight : 0,
			bodyFat: bodyFat ? bodyFat : 0,
			muscle: muscle ? muscle : 0,
			fat: fat ? fat : 0,
			description: description,
		});

		setDescription('')
	}

	return (
		<div className={PREFIX_CLASS}>
			<h1
				onClick={() => setIsDatePickerVisible(true)}
				className={`${PREFIX_CLASS}__date-title`}
			>
				{date}
			</h1>
			<DatePicker
				mode="date"
				format="YYYY-MM-DD"
				visible={isDatePickerVisible}
				value={new Date(convertDateStringToTimestamp(date))}
				onOk={date => {
					setDate(formatDate(date));
					setIsDatePickerVisible(false);
				}}
				onDismiss={() => setIsDatePickerVisible(false)}
			/>
			<div className={`${PREFIX_CLASS}__form-item`}>
				<div className={`${PREFIX_CLASS}__form-item-circle`}>
					<label htmlFor="weight">
						<div>體重</div>
						<div>{weight} kg</div>
					</label>
				</div>
				<SlideInput
					onChange={setWeight}
					value={weight}
					step={0.1}
					range={[30, 100]}
				/>
			</div>
			<div className={`${PREFIX_CLASS}__form-item`}>
				<div className={`${PREFIX_CLASS}__form-item-circle`}>
					<label htmlFor="muscle">
						<div>肌肉量</div>
						<div>{muscle} kg</div>
					</label>
				</div>
				<SlideInput
					onChange={setMuscle}
					value={muscle}
					step={0.1}
					range={[0, 50]}
				/>
			</div>
			<div className={`${PREFIX_CLASS}__form-item`}>
				<div className={`${PREFIX_CLASS}__form-item-circle`}>
					<label htmlFor="bodyFat">
						<div>體脂</div>
						<div>{bodyFat} %</div>
					</label>
				</div>
				<SlideInput
					onChange={setBodyFat}
					value={bodyFat}
					step={0.1}
					range={[0, 50]}
				/>
			</div>
			<div className={`${PREFIX_CLASS}__form-item`}>
				<div className={`${PREFIX_CLASS}__form-item-circle`}>
					<label htmlFor="muscle">
						<div>脂肪重</div>
						<div>{fat} kg</div>
					</label>
				</div>
				<SlideInput
					onChange={setFat}
					value={fat}
					step={0.1}
					range={[0, 50]}
				/>
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '5px' }}>
				<textarea
					value={description}
					onChange={e => setDescription(e.target.value)}
					style={{ background: themeLight.weightLine, borderRadius: '5px', textAlign: 'center', padding: '5px' }}
					placeholder="備註"
				></textarea>
			</div>
			<Button
				type="primary"
				onClick={_handleSubmit}
				className={`${PREFIX_CLASS}__submit-btn`}
			>
				新增
			</Button>
		</div>
	);
}

BodyDataForm.propTypes = propTypes;

export default BodyDataForm;
