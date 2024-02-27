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
					disable
					filled
					class=""
					dense
					outlined
					label="Keperluan"
					v-model="input.keperluan"
					required
					autogrow
				/>
				<q-input
					class="q-mt-sm"
					dense
					outlined
					label="cicilan selama"
					v-model="input.cicilan"
					required
					type="number"
				>
					<template v-slot:append>
						<span class="text-caption">Bulan</span>
					</template>
				</q-input>
				<CurrencyInput
					disable
					filled
					v-model="input.nominal"
					outlined
					dense
					label="Nominal Pengajuan"
					class="q-mt-sm"
					required
					:hint="
						input.nominal > 0 && input.cicilan > 0
							? '@ Rp' +
							  digitSeparator(
									(input.nominal / input.cicilan).toFixed(2)
							  ) +
							  ' / bulan'
							: ''
					"
				/>

				<div class="flex items-center q-px-sm q-mt-sm">
					<span class="q-mr-sm">Status:</span>
					<q-radio
						v-model="input.status"
						checked-icon="cached"
						unchecked-icon="panorama_fish_eye"
						color="primary"
						:val="null"
						label="Ditinjau"
						class="q-mr-md"
						@update:model-value="input.nominal_disetujui = 0"
					/>
					<q-radio
						v-model="input.status"
						checked-icon="task_alt"
						unchecked-icon="panorama_fish_eye"
						color="positive"
						:val="1"
						label="Disetujui"
						class="q-mr-md"
					/>
					<q-radio
						v-model="input.status"
						checked-icon="do_not_disturb"
						unchecked-icon="panorama_fish_eye"
						color="negative"
						:val="0"
						label="Ditolak"
						class="q-mr-md"
						@update:model-value="input.nominal_disetujui = 0"
					/>
				</div>
				<CurrencyInput
					v-model="input.nominal_disetujui"
					outlined
					dense
					label="Nominal Disetujui"
					class="q-mt-sm"
					required
					:disable="input.status != 1"
					:hint="
						input.nominal_disetujui > 0 && input.cicilan > 0
							? '@ Rp' +
							  digitSeparator(
									(
										input.nominal_disetujui / input.cicilan
									).toFixed(2)
							  ) +
							  ' / bulan'
							: ''
					"
				/>
				<q-input
					class="q-mt-sm"
					dense
					outlined
					label="Keterangan"
					v-model="input.keterangan"
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
import CurrencyInput from 'src/components/CurrencyInput.vue';
import loadingStore from 'src/stores/loading-store';
import { digitSeparator } from 'src/utils/format-number';
import apiUpdate from 'src/api/api-update';

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
		keterangan: input.value.keterangan,
		nominal_disetujui: input.value.nominal_disetujui,
		status: input.value.status,
	};
	// console.log(data);
	// return;
	const response = await apiUpdate({
		endPoint: `kelompok/loan-applications/${input.value.id}`,
		data,
		loading: loadingMain,
	});
	if (response) {
		emit('successSubmit');
		document.getElementById('btn-close').click();
	}
}
</script>
<style lang=""></style>
