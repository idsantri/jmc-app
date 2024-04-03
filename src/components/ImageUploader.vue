<template>
	<my-upload
		field="image"
		langType="en"
		:langExt="translate"
		no-circle
		@crop-success="cropSuccess"
		@crop-upload-success="cropUploadSuccess"
		@crop-upload-fail="cropUploadFail"
		v-model="internalShowUploader"
		:width="props.width"
		:height="props.height"
		:url="apiTokened.defaults.baseURL + props.url"
		:params="paramsImage"
		:headers="{
			Authorization: apiTokened.defaults.headers.common.Authorization,
		}"
		withCredentials
		img-format="png"
	>
	</my-upload>
</template>
<script setup>
import myUpload from 'vue-image-crop-upload';
import { notifySuccess } from 'src/utils/notify';
import { onUpdated, ref, watch } from 'vue';
import { apiTokened } from 'src/api';

/**
 * communicate parents children
 * @props
 * @emits
 */
const props = defineProps({
	width: { type: Number, default: 600 },
	height: { type: Number, default: 300 },
	showUploader: { type: Boolean, default: false },
	url: { default: null },
	headers: { default: null },
});
const emit = defineEmits(['updateUploader', 'successUpload']);

// console.log(props);

const internalShowUploader = ref(false);
watch(
	() => props.showUploader,
	(newVal) => {
		internalShowUploader.value = newVal;
	}
);

onUpdated(() => {
	// console.log('updated');
	emit('updateUploader', internalShowUploader.value);
});

/**
 * uploader
 */
const translate = {
	hint: 'Klik atau tarik file gambar ke sini untuk upload',
	loading: 'Uploading…',
	noSupported: 'Browser is not supported, please use IE10+ or other browsers',
	success: 'Upload berhasil',
	fail: 'Upload gagal',
	preview: 'Preview',
	btn: {
		off: 'Gagal',
		close: 'Tutup',
		back: 'Kembali',
		save: 'Simpan',
	},
	error: {
		onlyImg: 'Hanya gambar',
		outOfSize: 'Gambar melebihi batas ukuran: ',
		lowestPx: 'Ukuran gambar terlalu rendah. Setidaknya diharapkan: ',
	},
};

const imgDataUrl = ref('');
const paramsImage = {};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cropSuccess = (imgData, field) => {
	imgDataUrl.value = imgData;
	// console.log(imgData);
	// console.log(field);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cropUploadSuccess = (jsonData, field) => {
	// console.log(jsonData);
	// console.log('field: ' + field);
	notifySuccess(jsonData.message);
	emit('successUpload');
};

/**
 * upload fail
 *
 * [param] status    server api return error status, like 500
 * [param] field
 */
const cropUploadFail = (status, field) => {
	console.log(status);
	console.log('field: ' + field);
};
</script>
_field_field
