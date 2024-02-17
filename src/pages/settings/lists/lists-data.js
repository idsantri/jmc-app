const data = [
	{ url: 'metode-pembayaran', label: 'Metode Pembayaran', mode: 'one' },
	{ url: 'nama-kelompok', label: 'Nama Kelompok', mode: 'one' },
];

const listData = Object.values(data).sort((a, b) => {
	return a.label > b.label ? 1 : -1;
});

export default listData;
