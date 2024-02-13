import { apiTokened } from 'src/api';
import { toArray } from 'src/utils/array-object';
import { forceRerender } from 'src/utils/buttons-click';
import { notifyError, notifySuccess, notifyConfirm } from 'src/utils/notify';

async function updateData({
	endPoint,
	data,
	rerender,
	loading,
	notify,
	params,
}) {
	try {
		if (loading && typeof loading.value === 'boolean') loading.value = true;
		const response = await apiTokened.put(endPoint, data, { params });
		if (notify) notifySuccess(response.data.message);
		if (rerender) forceRerender();
		return response.data;
	} catch (error) {
		const message = error?.response?.data?.message;
		if (message) {
			toArray(message).forEach((msg) => notifyError(msg));
		} else {
			console.log(`Error during update ${endPoint}`, error);
		}
		return false;
	} finally {
		if (loading && typeof loading.value === 'boolean')
			loading.value = false;
	}
}

async function apiUpdate({
	endPoint,
	data,
	confirm = true,
	message = '<span style="color:\'red\'">Update data ini?</span>',
	rerender,
	loading,
	notify = true,
	params,
}) {
	if (confirm) {
		const dialog = await notifyConfirm(message, true);
		return dialog
			? await updateData({
					endPoint,
					data,
					rerender,
					loading,
					notify,
					params,
			  })
			: false;
	} else {
		return updateData({
			endPoint,
			data,
			rerender,
			loading,
			notify,
			params,
		});
	}
}

export default apiUpdate;
