function formatAlamatLengkap(
	jl = '',
	rt = '',
	rw = '',
	desa = '',
	kecamatan = '',
	kabupaten = '',
	provinsi = '',
	kode_pos = ''
) {
	return `${jl || ' '} RT ${String(rt || 0).padStart(3, 0)} RW ${String(
		rw || 0
	).padStart(3, '0')} ${desa || ' '} ${kecamatan || ' '} ${
		kabupaten || ' '
	} ${provinsi || ' '} ${kode_pos || ' '}`.replace(/\s\s+/g, ' ');
}

function getInitials(str) {
	const words = str.split(' ');
	const initials = words.map((word) => word.charAt(0).toLowerCase());
	return initials.join('');
}

function slugify(text) {
	return text
		.toString()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-');
}

function titleCase(text) {
	return text
		.split(' ')
		.map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
		.join(' ');
}

function kebabToTitleCase(text) {
	return text
		.split('-')
		.map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
		.join(' ');
}
function snakeToTitleCase(text) {
	return text
		.split('_')
		.map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
		.join(' ');
}

function snakeToKebabCase(text) {
	return text
		.split('_')
		.map((w) => w[0].toLowerCase() + w.substring(1).toLowerCase())
		.join('-');
}
function kebabToSnakeCase(text) {
	return text
		.split('-')
		.map((w) => w[0].toLowerCase() + w.substring(1).toLowerCase())
		.join('_');
}

export {
	formatAlamatLengkap,
	getInitials,
	slugify,
	titleCase,
	kebabToTitleCase,
	snakeToTitleCase,
	snakeToKebabCase,
	kebabToSnakeCase,
};
