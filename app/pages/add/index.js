import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Toast, Button, Modal } from 'antd-mobile';
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
	const [ isImportModalVisible, setIsImportModalVisible ] =useState(false)
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
					Toast.success('created success', 1.5);
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

			Toast.loading('importing',0,)
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
			Toast.hide();

			Toast.success('import success');

		} catch(err) {
			Toast.success(err);
		}

		setImportJson('');
		setIsImportModalVisible(false);
	}

	return (
		<div className={PREFIX_CLASS}>
			<BodyDataForm
				onSubmit={_handleUpdateBodyData}
			/>
			<div style={{ marginTop: '5px' }}>
				<Button onClick={() => setIsImportModalVisible(true)} style={{ background: '#FCAE48' }}>
					匯入
				</Button>
			</div>
			<Modal
				popup
				visible={isImportModalVisible}
				onClose={() => setIsImportModalVisible(false)}
				animationType="slide-up"
			>
				<div style={{ padding: '10px', display: 'flex', flexDirection: 'column', background: '#FFE8C9' }}>
					<textarea
						value={importJson}
						onChange={(e) => setImportJson(e.target.value)}
						rows={20}
						style={{ width: '100%', marginBottom: '5px', background: '#FFE8C9', borderRadius: '5px' }}
					>
					</textarea>
					<Button
						onClick={_handleImportData}
						style={{ background: '#FCAE48' }}
					>
						Import Data
					</Button>
				</div>
			</Modal>
		</div>
	);
}

AddPage.propTypes = propTypes;

export default AddPage;
