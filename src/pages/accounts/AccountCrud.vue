<template>
	<q-card class="full-width" style="max-width: 425px">
		<q-form @submit.prevent="onSubmit">
			<q-card-section class="bg-blue-grey-7 text-blue-grey-11 q-pa-sm">
				<toolbar-form @emit-button="null" :button-setting="true">
					Input Rekening &mdash;
					<em> {{ $props.isNew ? 'baru' : 'edit' }}</em>
				</toolbar-form>
			</q-card-section>
			<q-banner class="bg-blue-grey-10 text-blue-grey-11">
				Selalu awali nomor rekening dengan &ldquo;4.&rdquo; (empat dan
				titik)
			</q-banner>
			<q-card-section class="q-pa-sm">
				<q-input
					dense
					outlined
					label="No Rekening"
					v-model="input.id"
				/>
				<q-input
					dense
					class="q-mt-sm"
					outlined
					label="Nama Akun/ Rekening"
					v-model="input.name"
				/>
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
import ToolbarForm from 'src/components/ToolbarForm.vue';
import apiDelete from 'src/api/api-delete';
import apiUpdate from 'src/api/api-update';
import apiPost from 'src/api/api-post';
import loadingStore from 'src/stores/loading-store';
import { notifyError } from 'src/utils/notify';

const props = defineProps({
	dataInput: Object,
	isNew: Boolean,
});
const emit = defineEmits(['successSubmit', 'successDelete']);

const { loadingMain } = toRefs(loadingStore());
const input = ref({});

onMounted(async () => {
	Object.assign(input.value, props.dataInput);
	// console.log(input.value);
});

const onSubmit = async () => {
	if (input.value?.id.substring(0, 2) != '4.') {
		notifyError('Awali nomor rekening dengan "4." (empat dan titik)');
		return;
	}
	const data = {
		id: input.value.id,
		name: input.value.name,
		normal_balance: 'C',
	};

	let response = null;
	if (props.isNew) {
		response = await apiPost({
			endPoint: 'accounts',
			data,
			loading: loadingMain,
		});
	} else {
		response = await apiUpdate({
			endPoint: `accounts/${props.dataInput.id}`,
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
		endPoint: `accounts/${input.value.id}`,
		loading: loadingMain,
	});
	if (result) {
		document.getElementById('btn-close').click();
		emit('successDelete');
	}
};
</script>
