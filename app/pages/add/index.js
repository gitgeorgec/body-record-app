import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile';
import BodyDataForm from '../../components/body-data-form';
import { BodyDataContext } from '../../context';
import localDB from '../../database';
import './style.styl';

const PREFIX_CLASS = 'add-page';
const propTypes = {
	onNavigate: PropTypes.func.isRequired,
};

function AddPage({
	onNavigate,
}) {
	const { bodyData, setBodyData } = useContext(BodyDataContext);

	function _handleUpdateBodyData(newData) {
		let insertDate = newData.date;

		if (window.flutter_inappwebview) {
			window.flutter_inappwebview
				.callHandler('addData', newData)
				.then(() => {
					Toast.success('created success');
				})
				.catch(err => {
					Toast.fail(err);
					console.log(err);
				});
		} else {
			localDB
				.setItem(`${insertDate}`, newData)
				.then(() => {
					const updatedBodyData = bodyData.filter(data => data.date !== insertDate);

					updatedBodyData.push(newData);
					updatedBodyData.sort((a, b) => a.date - b.date);
					setBodyData(updatedBodyData);
					Toast.success('created success');
				})
				.catch(err => {
					Toast.fail(err);
					console.log(err);
				});
		}
	}

	return (
		<div className={PREFIX_CLASS}>
			<BodyDataForm
				onSubmit={_handleUpdateBodyData}
			/>
		</div>
	);
}

AddPage.propTypes = propTypes;

export default AddPage;
