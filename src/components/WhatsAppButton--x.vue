<template>
	<div>
		<button @click="sendMessage">Kirim Pesan WhatsApp</button>
	</div>
</template>

<script>
import { Client, List, LocalAuth } from 'whatsapp-web.js';

export default {
	methods: {
		async sendMessage() {
			const phoneNumber = '6285765675657'; // Ganti dengan nomor telepon penerima
			// const message =
			// 	'Halo! Ini adalah pesan dari Vue.js dan whatsapp-web.js.';

			// Inisialisasi client WhatsApp
			const client = new Client({
				authStrategy: new LocalAuth({ clientId: 'my-client' }),
				puppeteer: {
					headless: true, // Atur ke false jika ingin melihat browser
				},
			});

			// Tunggu hingga client siap
			await client.initialize();

			// Kirim pesan
			const numberDetails = await client.getNumberId(phoneNumber);
			if (numberDetails) {
				const productsList = new List(
					'Penawaran menarik untuk produk berikut',
					'Lihat produk',
					[
						{
							title: 'Daftar produk',
							rows: [
								{ id: 'apple', title: 'Apel' },
								{ id: 'mango', title: 'Mangga' },
							],
						},
					],
					'Silakan pilih produk'
				);

				await client.sendMessage(
					numberDetails._serialized,
					productsList
				);
				console.log('Pesan terkirim!');
			} else {
				console.log('Nomor telepon tidak terdaftar.');
			}

			// Tutup koneksi
			await client.destroy();
		},
	},
};
</script>
