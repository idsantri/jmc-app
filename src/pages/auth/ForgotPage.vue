<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div class="q-pa-xs">
		<q-card class="my-card q-mb-lg" flat>
			<q-card-section class="no-padding no-margin">
				<p
					class="q-pa-sm no-margin text-blue-grey-10 text-justify bg-blue-grey-2 rounded-borders"
				>
					Tidak masalah. Masukkan email Anda di bawah ini dan kami
					akan mengirimkan instruksi untuk mengatur ulang kata sandi
					Anda.
				</p>
			</q-card-section>
		</q-card>
		<form @submit.prevent="reset">
			<div class="q-gutter-y-md column">
				<q-input
					class="no-margin no-padding"
					bg-color="blue-grey-1"
					outlined
					v-model="email"
					requiblue-grey
					label="Email"
					placeholder="Masukkan email Anda!"
					type="email"
				/>
				<q-btn
					type="submit"
					class="full-width q-pa-sm text-blue-grey-10"
					color="blue-grey-3"
					label="Kirim instruksi"
				/>

				<q-card class="my-card" flat>
					<q-card-section
						class="text-blue-grey-10 text-center bg-blue-grey-2 q-pa-sm"
					>
						<q-btn
							outline
							color="blue-grey-10"
							class="full-width text-weight-regular"
							no-caps
							to="/login"
							label="Kembali ke halaman login"
						/>
						<q-btn
							outline
							color="blue-grey-10"
							class="full-width text-weight-regular q-mt-sm"
							no-caps
							to="/reset-password"
							label="Atur ulang password"
						/>
					</q-card-section>
				</q-card>
			</div>
		</form>
	</div>
	<q-spinner-cube
		v-show="showSpinner"
		color="blue-grey-12"
		size="14em"
		class="absolute-center"
	/>
</template>

<script setup>
import { api } from 'src/api';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { toArray } from 'src/utils/array-object';
import { notifyAlert } from 'src/utils/notify';

const showSpinner = ref(false);
const router = useRouter();
const email = ref('');

const emit = defineEmits(['title', 'errors']);
emit('title', 'Lupa Kata Sandi?');
emit('errors', []);

const reset = async () => {
	emit('errors', []);
	try {
		showSpinner.value = true;
		const response = await api.post('forgot-password', {
			email: email.value,
		});
		const notification = notifyAlert(response.data.message, 0);
		await notification; // tunggu notifikasi ditutup
		router.push('/reset-password');
	} catch (error) {
		emit('errors', toArray(error.response.data.message));
	} finally {
		showSpinner.value = false;
	}
};
</script>
