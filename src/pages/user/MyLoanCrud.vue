<template lang="">
	<q-card class="full-width" style="max-width: 425px">
		<q-form @submit.prevent="onSubmit">
			<q-card-section class="bg-blue-grey-7 text-blue-grey-11 q-pa-sm">
				<toolbar-form @emit-button="null" :button-setting="false">
					Pengajuan Pinjaman
				</toolbar-form>
			</q-card-section>
			<q-card-section class="q-pa-sm">
				<q-input
					class=""
					dense
					outlined
					label="Keperluan"
					v-model="input.keperluan"
					required
					autogrow
				/>

				<CurrencyInput
					v-model="input.nominal"
					outlined
					dense
					label="Nominal"
					class="q-mt-sm"
					required
				/>
				<q-input
					class="q-mt-sm"
					dense
					outlined
					label="Rencana cicilan selama"
					v-model="input.cicilan"
					required
					type="number"
					:hint="
						input.nominal > 0 && input.cicilan > 0
							? '@ Rp' +
							  digitSeparator(
									(input.nominal / input.cicilan).toFixed(2)
							  ) +
							  ' / bulan'
							: ''
					"
				>
					<template v-slot:append>
						<span class="text-caption">Bulan</span>
					</template>
				</q-input>
			</q-card-section>

			<q-card-actions class="flex bg-blue-grey-6">
				<q-btn
					v-if="input.id"
					label="Hapus"
					color="negative"
					no-caps=""
					@click="onDelete"
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
import CurrencyInput from 'src/components/CurrencyInput.vue';
import loadingStore from 'src/stores/loading-store';
import apiPost from 'src/api/api-post';
import { digitSeparator } from 'src/utils/format-number';
import apiUpdate from 'src/api/api-update';
import apiDelete from 'src/api/api-delete';

const props = defineProps({
	dataInput: Object,
});
const emit = defineEmits(['successSubmit', 'successDelete']);

const { loadingMain } = toRefs(loadingStore());
const input = ref({});

async function onSubmit() {
	// console.log(input.value);
	// return;
	const data = {
		keperluan: input.value.keperluan,
		nominal: input.value.nominal,
		cicilan: input.value.cicilan,
	};
	let response = null;
	if (input.value.id) {
		response = await apiUpdate({
			endPoint: `member/loan-applications/${input.value.id}`,
			data,
			loading: loadingMain,
		});
	} else {
		response = await apiPost({
			endPoint: 'member/loan-applications',
			data,
			loading: loadingMain,
		});
	}
	if (response) {
		emit('successSubmit');
		document.getElementById('btn-close').click();
	}
}
async function onDelete() {
	// console.log(input.value);
	// return;
	const del = await apiDelete({
		endPoint: `member/loan-applications/${input.value.id}`,
		loading: loadingMain,
	});
	if (del) {
		emit('successDelete');
		document.getElementById('btn-close').click();
	}
}

onMounted(async () => {
	Object.assign(input.value, props.dataInput);
});
</script>
<style lang=""></style>
