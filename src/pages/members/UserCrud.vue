<template lang="">
	<q-card class="full-width" style="max-width: 425px">
		<q-form @submit.prevent="onSubmit">
			<q-card-section class="bg-blue-grey-7 text-blue-grey-11 q-pa-sm">
				<toolbar-form @emit-button="null" :button-setting="false">
					Input Data User &mdash;
					<em> {{ $props.isNew ? 'baru' : 'edit' }}</em>
				</toolbar-form>
			</q-card-section>
			<q-card-section class="q-pa-sm">
				<q-input
					class=""
					dense
					outlined
					label="Email"
					v-model="input.email"
					required
					disable
					filled
				/>

				<q-input
					class="q-mt-sm"
					dense
					outlined
					label="Password"
					v-model="input.password"
					required
					:rules="[(val) => val.length >= 6 || 'Minimal 6 karakter!']"
				/>
				<q-input
					class="q-mt-sm"
					dense
					outlined
					label="Nomor WA"
					v-model="input.phone"
					required
					hint="08123456789"
					:rules="[(val) => !isNaN(val) || 'Hanya angka!']"
				>
				</q-input>
			</q-card-section>
			<q-card-actions class="flex bg-blue-grey-6">
				<q-btn
					v-show="!$props.isNew"
					label="Hapus"
					class="bg-red text-red-1"
					no-caps=""
					@click="handleDelete"
				/>
				<q-space />
				<q-btn
					label="Tutup"
					v-close-popup
					class="bg-blue-grey-11"
					no-caps=""
					id="btn-close"
				/>
				<q-btn
					v-if="!submitted"
					type="submit"
					label="Simpan"
					class="bg-blue-grey-10 text-blue-grey-11"
					no-caps=""
					icon="save"
				/>
				<q-btn
					v-if="submitted"
					label="Kirim WA"
					class="bg-blue-grey-10 text-blue-grey-11"
					no-caps=""
					icon="call"
					@click="sendMessage"
				/>
			</q-card-actions>
		</q-form>
	</q-card>
</template>
<script setup>
import apiDelete from 'src/api/api-delete';
import apiPost from 'src/api/api-post';
import apiUpdate from 'src/api/api-update';
import ToolbarForm from 'src/components/ToolbarForm.vue';
import loadingStore from 'src/stores/loading-store';
import { notifyConfirm } from 'src/utils/notify';
import { onMounted, ref, toRefs } from 'vue';

const props = defineProps({
	dataInput: Object,
	isNew: Boolean,
});
const emit = defineEmits(['successSubmit', 'successDelete']);
const { loadingMain } = toRefs(loadingStore());
const submitted = ref(false);
const input = ref({});

onMounted(() => {
	Object.assign(input.value, props.dataInput);
	// console.log(input.value);
});

const onSubmit = async () => {
	// console.log(input.value);
	const data = {
		name: input.value.name,
		email: input.value.email,
		phone: input.value.phone,
		password: input.value.password,
	};
	// console.log(data);
	// return;
	let response = null;
	if (input.value.id) {
		response = await apiUpdate({
			endPoint: `users/${input.value.id}`,
			data,
			loading: loadingMain,
		});
	} else {
		response = await apiPost({
			endPoint: 'users',
			data,
			loading: loadingMain,
		});
	}
	if (response) {
		emit('successSubmit');
		submitted.value = true;
		const confirmed = await notifyConfirm(
			'Kirim pesan kepada yang bersakutan?'
		);
		if (confirmed) {
			sendMessage();
		}
	}
};

const handleDelete = async () => {
	const result = await apiDelete({
		endPoint: `users/${input.value.id}`,
		loading: loadingMain,
	});
	if (result) {
		document.getElementById('btn-close').click();
		emit('successDelete');
	}
};

function sendMessage() {
	const phoneNumber = input.value.phone?.replace(/^0/, '62'); // Nomor telepon penerima
	let message = 'Jurang Mangu Care \n';
	message += 'Berikut Akses login Anda di: https://jurangmangucare.my.id \n';
	message += `email: ${input.value.email} \n`;
	message += `password: ${input.value.password}`;

	const whatsappLink = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(
		message
	)}`;
	// Buka tautan WhatsApp di tab baru
	window.open(whatsappLink, '_blank');
}
</script>
<style lang=""></style>
