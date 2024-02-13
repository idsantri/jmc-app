import { apiTokened } from 'src/api';
import { toArray } from 'src/utils/array-object';
import { notifyError, notifySuccess } from 'src/utils/notify';

async function apiGet({ endPoint, loading, params, notify = false }) {
	try {
		if (loading && typeof loading.value === 'boolean') loading.value = true;
		const { data } = await apiTokened.get(endPoint, { params });
		if (notify) notifySuccess(data.message);
		return data;
	} catch (error) {
		const message = error?.response?.data?.message;
		if (message) {
			toArray(message).forEach((msg) => notifyError(msg));
		} else {
			console.log(`Error during get ${endPoint}`, error);
		}
		return false;
	} finally {
		if (loading && typeof loading.value === 'boolean')
			loading.value = false;
	}
}

export default apiGet;
