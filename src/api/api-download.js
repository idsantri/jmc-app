import { notifyConfirm } from 'src/utils/notify';
import { apiTokened } from '.';

async function apiDownload({
	message = 'Download data yang dicetak?',
	url,
	confirm = false,
	loading,
	params,
	fileName = 'dokumen',
}) {
	if (confirm) {
		const isConfirmed = await notifyConfirm(message, true);
		if (!isConfirmed) return false;
	}

	if (loading && typeof loading.value === 'boolean') loading.value = true;
	try {
		const response = await apiTokened.request({
			url: url,
			method: 'GET',
			responseType: 'blob', // important
			// headers: {
			// 	'Content-Type': 'application/pdf',
			// },
			params,
		});

		const href = URL.createObjectURL(response.data);
		// create "a" HTML element with href to file & click
		const link = document.createElement('a');
		link.href = href;
		link.setAttribute('download', fileName + '.pdf'); //or any other extension
		// link.setAttribute('target', '_blank');
		document.body.appendChild(link);
		link.click();

		// clean up "a" element & remove ObjectURL
		document.body.removeChild(link);
		URL.revokeObjectURL(href);
		return true;
	} catch (error) {
		console.error('error download', error);
	} finally {
		if (loading && typeof loading.value === 'boolean')
			loading.value = false;
	}
}
export default apiDownload;
