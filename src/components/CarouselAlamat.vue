<template lang="">
	<div class="text-subtitle2">Alamat</div>

	<q-select
		dense
		hint=""
		class="q-mt-sm"
		outlined
		label="Provinsi"
		emit-value
		map-options
		v-model="input.provinsi"
		:options="lists['provinsi']"
		:loading="loading['provinsi']"
		behavior="menu"
	/>

	<q-select
		dense
		hint=""
		class="q-mt-sm"
		outlined
		label="Kabupaten/Kota"
		emit-value
		map-options
		v-model="input.kabupaten"
		:options="lists['kabupaten']"
		:loading="loading['kabupaten']"
		behavior="menu"
	/>

	<q-select
		dense
		hint=""
		class="q-mt-sm"
		outlined
		label="Kecamatan"
		emit-value
		map-options
		v-model="input.kecamatan"
		:options="lists['kecamatan']"
		:loading="loading['kecamatan']"
		behavior="menu"
	/>

	<q-select
		dense
		hint=""
		class="q-mt-sm"
		outlined
		label="Desa/Keluarahan"
		emit-value
		map-options
		v-model="input.desa"
		:options="lists['desa']"
		:loading="loading['desa']"
		use-input=""
		new-value-mode="add"
		behavior="menu"
	/>

	<div class="row">
		<q-input
			dense
			hint=""
			class="q-mt-sm col q-mr-sm"
			outlined
			label="RT"
			v-model="input.rt"
			type="number"
		/>

		<q-input
			dense
			hint=""
			class="q-mt-sm col q-ml-sm"
			outlined
			label="RW"
			v-model="input.rw"
			type="number"
		/>
	</div>

	<q-input
		dense
		hint="Dusun, kampung, jalan, gang, nomor rumah ..."
		class="q-mt-sm"
		outlined
		label="Dusun"
		v-model="input.jl"
		autogrow=""
	/>

	<q-input
		dense
		hint=""
		class="q-mt-sm"
		outlined
		label="Kode Pos"
		v-model="input.kode_pos"
		:rules="[
			(val) =>
				!val || (val?.length == 5 && !isNaN(val)) || '5 digit angka!',
		]"
		error-color="negative"
	/>
</template>
<script setup>
/**
 * @example
 * <carousel-alamat
 * @emit-input="(val) => Object.assign(input, val)"
 * :alamat="input"
 * />
 */
import { apiTokened } from 'src/api';
import { onMounted, ref, watch, watchEffect } from 'vue';

const props = defineProps({
	data: { type: Object },
});
const emit = defineEmits(['emitInput']);

const input = ref({});
const lists = ref([]);
const loading = ref([]);

async function fetchAlamat(request) {
	let params = {};

	if (request === 'provinsi') {
		params = {};
	}
	if (request === 'kabupaten') {
		params.provinsi = input.value.provinsi;
	}

	if (request === 'kecamatan') {
		params.provinsi = input.value.provinsi;
		params.kabupaten = input.value.kabupaten;
	}

	if (request === 'desa') {
		params.provinsi = input.value.provinsi;
		params.kabupaten = input.value.kabupaten;
		params.kecamatan = input.value.kecamatan;
	}

	try {
		loading.value[request] = true;
		const response = await apiTokened.get('alamat', { params });
		lists.value[request] = response.data[request];
	} catch (error) {
		console.log(`Not Found list ${request}`, error);
	} finally {
		loading.value[request] = false;
	}
}

onMounted(async () => {
	Object.assign(input.value, props.data);

	await fetchAlamat('provinsi');
	if (input.value.provinsi) {
		await fetchAlamat('kabupaten');
	}
	if (input.value.kabupaten) {
		await fetchAlamat('kecamatan');
	}
	if (input.value.kecamatan) {
		await fetchAlamat('desa');
	}
});

watchEffect(() => {
	emit('emitInput', input.value);
});

watch(
	() => input.value.provinsi,
	async (newValue, oldValue) => {
		if (newValue != oldValue && typeof oldValue != 'undefined') {
			input.value.kabupaten = '';
			input.value.kecamatan = '';
			input.value.desa = '';
			lists.value.kabupaten = [];
			lists.value.kecamatan = [];
			lists.value.desa = [];
			await fetchAlamat('kabupaten');
		}
	}
);

watch(
	() => input.value.kabupaten,
	async (newValue, oldValue) => {
		if (newValue != oldValue && typeof oldValue != 'undefined') {
			input.value.kecamatan = '';
			input.value.desa = '';
			lists.value.kecamatan = [];
			lists.value.desa = [];
			await fetchAlamat('kecamatan');
		}
	}
);

watch(
	() => input.value.kecamatan,
	async (newValue, oldValue) => {
		if (newValue != oldValue && typeof oldValue != 'undefined') {
			input.value.desa = '';
			lists.value.desa = [];
			await fetchAlamat('desa');
		}
	}
);

// watch(
// 	() => input.value,
// 	(newValue, oldValue) => {
// 		// console.log('watch', newValue, oldValue);
// 		// Lakukan sesuatu dengan nilai baru dan nilai lama dari input.value
// 		emit('emitInput', input.value);
// 	},
// 	{ deep: true }
// );
// const watchInput = (property, callback) => {
// 	watch(
// 		() => input.value[property],
// 		async (newValue, oldValue) => {
// 			if (newValue !== oldValue && typeof oldValue !== 'undefined') {
// 				if (property == 'provinsi') {
// 					input.value.kabupaten = '';
// 					input.value.kecamatan = '';
// 					input.value.desa = '';
// 					lists.value.kabupaten = [];
// 					lists.value.kecamatan = [];
// 					lists.value.desa = [];
// 					await callback('kabupaten');
// 				}
// 				if (property == 'kabupaten') {
// 					input.value.kecamatan = '';
// 					input.value.desa = '';
// 					lists.value.kecamatan = [];
// 					lists.value.desa = [];
// 					await callback('kecamatan');
// 				}
// 				if (property == 'kecamatan') {
// 					input.value.desa = '';
// 					lists.value.desa = [];
// 					await callback('desa');
// 				}
// 			}
// 		}
// 	);
// };

// watchInput('provinsi', fetchAlamat);
// watchInput('kabupaten', fetchAlamat);
// watchInput('kecamatan', fetchAlamat);
</script>

<style lang=""></style>
