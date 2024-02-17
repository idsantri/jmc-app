<template>
	<q-card class="full-width" style="max-width: 425px">
		<q-form @submit.prevent="onSubmit">
			<q-card-section class="bg-blue-grey-7 text-blue-grey-11 q-pa-sm">
				<toolbar-form @emit-button="null" :button-setting="true">
					Input Data Anggota &mdash;
					<em> {{ $props.isNew ? 'baru' : 'edit' }}</em>
				</toolbar-form>
			</q-card-section>
			<q-card-section class="no-padding">
				<q-carousel
					v-model="slide"
					transition-prev="slide-right"
					transition-next="slide-left"
					animated
					control-color="primary"
					class="full-width"
					style="height: 65vh"
					swipeable
					infinite
				>
					<!-- identitas -->
					<q-carousel-slide
						:name="carousel.identitas.button"
						class="no-wrap flex-center"
					>
						<div class="text-subtitle2">
							{{ carousel.identitas.title }}
						</div>
						<q-input
							dense
							class="q-mt-sm"
							outlined
							label="ID"
							v-model="input.id"
							hint="Diisi otomatis oleh sistem"
							disable
							filled
						/>
						<q-input
							dense
							hint=""
							class="q-mt-sm"
							outlined
							label="Nama*"
							v-model="input.nama"
							:rules="[
								(val) => !!val || 'Harus diisi!',
								(val) =>
									val?.length >= 4 || 'Setidaknya 4 huruf!',
							]"
							error-color="negative"
							autocapitalize="words"
						/>

						<q-input
							dense
							hint=""
							class="q-mt-sm"
							outlined
							label="Nomor Induk Kependudukan"
							v-model="input.nik"
							:rules="[
								(val) =>
									!val ||
									(val?.length == 16 && !isNaN(val)) ||
									'16 digit angka!',
							]"
							error-color="negative"
						/>
						<input-select-kota-lahir
							:data="input"
							@emit-input="(val) => Object.assign(input, val)"
						/>

						<q-input
							dense
							:hint="
								isDate(input.tgl_lahir)
									? formatDateFull(input.tgl_lahir)
									: ''
							"
							class="q-mt-sm"
							outlined
							label="Tanggal Lahir"
							v-model="input.tgl_lahir"
							type="date"
						/>

						<q-select
							dense
							:hint="
								input.sex == 'L'
									? 'Laki-Laki'
									: input.sex == 'P'
									? 'Perempuan'
									: ''
							"
							class="q-mt-sm"
							outlined
							label="Jenis Kelamin"
							v-model="input.sex"
							:options="['L', 'P']"
							emit-value
							map-options
							error-color="negative"
							behavior="menu"
						/>
						<input-select-kota-lahir
							:data="input"
							@emit-input="(val) => Object.assign(input, val)"
						/>
						<q-input
							dense
							hint=""
							class="q-mt-sm"
							outlined
							label="Email"
							v-model="input.email"
							:rules="[
								(val) =>
									isValidEmail(val) ||
									'Invalid email address',
							]"
							error-color="negative"
						/>
						<q-select
							dense
							class=""
							outlined
							label="Nama Kelompok"
							emit-value
							map-options
							v-model="input.kelompok"
							:options="lists['nama-kelompok']"
							:loading="loading['nama-kelompok']"
							use-input=""
							new-value-mode="add"
							clearable
							behavior="menu"
						/>
					</q-carousel-slide>

					<!-- alamat -->
					<q-carousel-slide
						:name="carousel.alamat.button"
						class="no-wrap flex-center"
					>
						<carousel-alamat
							:data="input"
							@emit-input="(val) => Object.assign(input, val)"
						/>
					</q-carousel-slide>
				</q-carousel>
			</q-card-section>
			<q-card-section class="q-pa-sm">
				<div class="row justify-center">
					<q-btn-toggle
						toggle-color="blue-grey-10"
						text-color="text-blue-grey-11"
						no-caps=""
						glossy
						v-model="slide"
						:options="toggleOptions"
					/>
				</div>
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
					type="submit"
					label="Simpan"
					class="bg-blue-grey-10 text-blue-grey-11"
					no-caps=""
				/>
			</q-card-actions>
		</q-form>
		<!-- <pre>{{ $props.isNew }}</pre>
		<pre>{{ $props.dataPersonalia }}</pre> -->
	</q-card>
</template>
<script setup>
import { onMounted, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { formatDateFull, isDate } from 'src/utils/format-date';
import ToolbarForm from 'src/components/ToolbarForm.vue';
import CarouselAlamat from 'src/components/CarouselAlamat.vue';
import apiDelete from 'src/api/api-delete';
import apiUpdate from 'src/api/api-update';
import apiPost from 'src/api/api-post';
import InputSelectKotaLahir from 'src/components/InputSelectKotaLahir.vue';
import loadingStore from 'src/stores/loading-store';
import { getLists } from 'src/api/api-get-lists';

const props = defineProps({
	dataInput: Object,
	isNew: Boolean,
});
const emit = defineEmits(['successSubmit', 'successDelete']);

const { loadingMain } = toRefs(loadingStore());
const route = useRoute();
const input = ref({});
const alamatDefault = {
	provinsi: 'Banten',
	kabupaten: 'Kota Tangerang Selatan',
	kecamatan: 'Pondok Aren',
};
const lists = ref([]);
const loading = ref([]);

function isValidEmail(email) {
	const regex = /^[A-Za-z0-9+_.-]+@(.+)$/;
	return regex.test(email);
}

onMounted(async () => {
	if (props.isNew) {
		Object.assign(input.value, alamatDefault);
	} else {
		Object.assign(input.value, props.dataInput);
	}
	// console.log(input.value);
	await getLists({
		loading,
		lists,
		sort: true,
		key: 'nama-kelompok',
	});
});

const onSubmit = async () => {
	const data = {
		nama: input.value.nama,
		nik: input.value.nik,
		tgl_lahir: input.value.tgl_lahir,
		tmp_lahir: input.value.tmp_lahir,
		sex: input.value.sex,
		provinsi: input.value.provinsi,
		kabupaten: input.value.kabupaten,
		kecamatan: input.value.kecamatan,
		desa: input.value.desa,
		rt: input.value.rt,
		rw: input.value.rw,
		jl: input.value.jl,
		kode_pos: input.value.kode_pos,
		kelompok: input.value.kelompok,
		email: input.value.email,
	};

	let response = null;
	if (props.isNew) {
		response = await apiPost({
			endPoint: 'members',
			data,
			loading: loadingMain,
		});
	} else {
		response = await apiUpdate({
			endPoint: `members/${route.params.id}`,
			data,
			confirm: true,
			notify: true,
			loading: loadingMain,
		});
	}

	if (response) {
		document.getElementById('btn-close').click();
		emit('successSubmit', response?.member);
	}
};

const handleDelete = async () => {
	const result = await apiDelete({
		endPoint: `members/${route.params.id}`,
		loading: loadingMain,
	});
	if (result) {
		document.getElementById('btn-close').click();
		emit('successDelete');
	}
};

const carousel = {
	identitas: {
		title: 'Identitas Diri',
		button: '1',
	},
	alamat: {
		title: 'Data Alamat',
		button: '2',
	},
};
const slide = ref(carousel.identitas.button);
const toggleOptions = [
	{
		label: carousel.identitas.button,
		value: carousel.identitas.button,
	},
	{
		label: carousel.alamat.button,
		value: carousel.alamat.button,
	},
];
</script>
