<template>
	<div class="q-pa-xs" style="height: 12rem"></div>
	<q-spinner-cube
		v-show="showSpinner"
		color="blue-grey-12"
		size="14em"
		class="absolute-center"
	/>
</template>
<script setup>
import authState from '../../stores/auth-store';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { notifyConfirm } from 'src/utils/notify';
import apiPost from 'src/api/api-post';

const emit = defineEmits(['title', 'errors']);
emit('title', 'Keluar');
emit('errors', []);

const showSpinner = ref(true);
const router = useRouter();

onMounted(async () => {
	const confirm = await notifyConfirm('Keluar dari Aplikasi?', true);
	if (confirm) {
		const out = await apiPost({ endPoint: 'logout' });
		if (!out) {
			router.go(-1);
			return;
		}
		authState().$reset();
		router.push('/login');
	} else {
		router.go(-1);
	}
});
</script>
