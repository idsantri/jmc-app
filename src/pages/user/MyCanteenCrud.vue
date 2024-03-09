<template lang="">
	<q-card class="full-width" style="max-width: 425px">
		<q-form @submit.prevent="onSubmit">
			<q-card-section class="bg-blue-grey-7 text-blue-grey-11 q-pa-sm">
				<toolbar-form @emit-button="null" :button-setting="false">
					Data Warung &mdash;
					<em> {{ input.id ? 'edit' : 'baru' }}</em>
				</toolbar-form>
			</q-card-section>
			<q-card-section class="q-pa-sm">
				<q-input
					class=""
					dense
					outlined
					label="Nama"
					v-model="input.name"
					required
				/>
				<q-input
					class="q-mt-sm"
					dense
					outlined
					label="Alamat"
					hint="Alamat, lokasi, No lapak, ..."
					v-model="input.address"
					required
					autogrow
				/>
				<q-input
					class="q-mt-sm"
					dense
					outlined
					label="Deskripsi"
					v-model="input.description"
					required
					autogrow
				/>
			</q-card-section>

			<q-card-actions class="flex bg-blue-grey-6">
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
import ToolbarForm from 'src/components/ToolbarForm.vue';
import loadingStore from 'src/stores/loading-store';
import apiUpdate from 'src/api/api-update';
import apiPost from 'src/api/api-post';

const props = defineProps({
	dataInput: Object,
});
const emit = defineEmits(['successSubmit']);
const { loadingMain } = toRefs(loadingStore());
const input = ref({});

onMounted(async () => {
	Object.assign(input.value, props.dataInput);
});

async function onSubmit() {
	// console.log(input.value);
	// return;
	const data = {
		name: input.value.name,
		address: input.value.address,
		description: input.value.description,
	};
	// console.log(data);
	// return;

	let response = null;
	if (input.value.id) {
		response = await apiUpdate({
			endPoint: 'member/canteen',
			data,
			loading: loadingMain,
		});
	} else {
		response = await apiPost({
			endPoint: 'member/canteen',
			data,
			loading: loadingMain,
		});
	}

	if (response) {
		emit('successSubmit');
		document.getElementById('btn-close').click();
	}
}
</script>
<style lang=""></style>
