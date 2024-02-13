const toArray = (value) => {
	let result = [];
	if (Array.isArray(value)) result = value;
	else if (typeof value === 'object')
		result = Object.keys(value).map((key) => value[key]);
	else result.push(value);
	return result;
};
function getObjectById(arr, id) {
	// Periksa apakah array merupakan Proxy
	const dataArr = Array.isArray(arr) ? arr : arr.value;
	return dataArr.find((obj) => obj.id === id);
}

export { toArray, getObjectById };
