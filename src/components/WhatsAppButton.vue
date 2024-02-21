<template>
	<div>
		<button @click="sendMessage">Kirim Pesan</button>
	</div>
</template>

<script>
import Client from 'src/src-wa/Client';

export default {
	data() {
		return {
			client: new Client(),
			phoneNumber: '6285765675657', // ganti dengan nomor telepon yang valid
			message: 'Halo dari Vue.js!',
		};
	},
	methods: {
		async sendMessage() {
			try {
				await this.client.sendMessage(
					`${this.phoneNumber}@c.us`,
					this.message
				);
				console.log('Pesan terkirim!');
			} catch (error) {
				console.error('Gagal mengirim pesan:', error);
			}
		},
	},
	created() {
		this.client.initialize();
	},
};
</script>
