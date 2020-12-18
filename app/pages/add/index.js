import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Toast, Button } from 'antd-mobile';
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
	const [ importJson, setImportJson ] = useState('')
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

	async function _handleImportData() {
		try {
			const importedData = JSON.parse(importJson)
			const importedDataLength = importedData.length;

			for (let i =0; i < importedDataLength; i++) {
				const newData = importedData[i]
				const inserDate = newData.date;
				await localDB.setItem(`${inserDate}`, newData)
					.then(() => {
						const updatedBodyData = bodyData.filter(data => data.date !== inserDate);

						updatedBodyData.push(newData);
						updatedBodyData.sort((a, b) => a.date - b.date);
						setBodyData(updatedBodyData);
					})
					.catch(err => {
						console.log(err);
					});
			}

			Toast.success('import success');

		} catch(err) {
			Toast.success(err);
		}

		setImportJson('')
	}

	return (
		<div className={PREFIX_CLASS}>
			<BodyDataForm
				onSubmit={_handleUpdateBodyData}
			/>
			<Button onClick={_handleImportData}>
				Import Data
			</Button>
			<textarea
				value={importJson}
				onChange={(e) => setImportJson(e.target.value)}
			>
			</textarea>
		</div>
	);
}

AddPage.propTypes = propTypes;

export default AddPage;
