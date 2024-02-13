import { apiTokened } from 'src/api';

/**
 * @param {*} object
 * @returns array
 */
async function getLists({ loading, lists, key, sort = null, url = '' }) {
	loading.value[key] = true;
	const endPoint = url?.length ? url : `lists/${key}`;
	try {
		const { data } = await apiTokened.get(endPoint);
		let result = data.lists;
		if (sort == 'asc' || sort == true) {
			result.sort();
		} else if (sort == 'desc' || sort == false) {
			result.reverse();
		}
		if (lists) {
			lists.value[key] = result;
		}
		return result;
	} catch (error) {
		const message = error?.response?.data?.message;
		if (message) {
			toArray(message).forEach((msg) => notifyError(msg));
		} else {
			console.log(`Not Found lists: ${key} `, error);
		}
		return false;
	} finally {
		loading.value[key] = false;
	}
}

/**
 * @param {*} object
 * @returns array object
 */
async function getListsKey({ loading, lists, key, sort = null, url = '' }) {
	loading.value[key] = true;
	const endPoint = url?.length ? url : `lists/${key}`;
	const snakeCase = key.replace(/-/g, '_');
	try {
		const { data } = await apiTokened.get(endPoint);
		let result = data[snakeCase];
		if (sort == 'asc' || sort == true) {
			result.sort((a, b) => {
				if (a.val0 < b.val0) {
					return -1;
				}
			});
		} else if (sort == 'desc' || sort == false) {
			result.sort((a, b) => {
				if (a.val0 > b.val0) {
					return -1;
				}
			});
		}
		if (lists) {
			lists.value[key] = result;
		}
		return result;
	} catch (error) {
		const message = error?.response?.data?.message;
		if (message) {
			toArray(message).forEach((msg) => notifyError(msg));
		} else {
			console.log(`Not Found lists: ${key} `, error);
		}
		return false;
	} finally {
		loading.value[key] = false;
	}
}

function hasObject(array) {
	for (let i = 0; i < array.length; i++) {
		if (typeof array[i] === 'object') {
			return true;
		}
	}
	return false;
}

/**
 * @param {*} object
 * @returns array object
 */
async function getListsCustom({ loading, lists, key, url, sort = null }) {
	loading.value[key] = true;
	try {
		const { data } = await apiTokened.get(url);
		// lists.value[key] = data[key];
		let result = data[key];
		if (!hasObject(result)) {
			if (sort == 'asc' || sort == true) {
				result.sort();
			} else if (sort == 'desc' || sort == false) {
				result.reverse();
			}
		}

		if (lists) {
			lists.value[key] = result;
		}
		return result;
	} catch (error) {
		const message = error?.response?.data?.message;
		if (message) {
			toArray(message).forEach((msg) => notifyError(msg));
		} else {
			console.log(`Not Found lists: ${key} `, error);
		}
		return false;
	} finally {
		loading.value[key] = false;
	}
}

export { getLists, getListsKey, getListsCustom };
