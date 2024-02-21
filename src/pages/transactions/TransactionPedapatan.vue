<template lang="">
	<q-card class="full-width" style="max-width: 425px">
		<q-form @submit.prevent="onSubmit">
			<q-card-section class="bg-blue-grey-7 text-blue-grey-11 q-pa-sm">
				<toolbar-form @emit-button="null" :button-setting="true">
					Pengeluaran
				</toolbar-form>
			</q-card-section>
			<q-banner class="bg-blue-grey-10 text-blue-grey-11 q-pa-sm">
				<table>
					<tbody>
						<tr>
							<td class="text-italic q-pr-md">Rekening</td>
							<td>{{ input.name }}</td>
						</tr>
						<tr>
							<td class="text-italic q-pr-md">Saldo</td>
							<td>
								Rp{{ digitSeparator(input.final_balance || 0) }}
							</td>
						</tr>
					</tbody>
				</table>
			</q-banner>
			<q-card-section class="q-pa-sm">
				<q-input
					dense
					outlined
					label="Akun/Rekening"
					v-model="input.account_id"
					disable
				/>
				<q-input
					class="q-mt-sm"
					dense
					outlined
					label="Deskripsi (Keterangan Transaksi)"
					v-model="input.description"
					autogrow
					required
				/>
				<CurrencyInput
					v-model="input.debit"
					outlined
					dense
					label="Nominal (Debit)"
					class="q-mt-sm"
					required
				/>

				<q-select
					class="q-mt-sm"
					dense
					outlined
					label="Via (Metode Pembayaran)"
					emit-value
					map-options
					v-model="input.via"
					:options="lists['metode-pembayaran']"
					:loading="loading['metode-pembayaran']"
					use-input=""
					new-value-mode="add"
					clearable
					behavior="menu"
				/>
				<q-input
					class="q-mt-sm"
					dense
					outlined
					label="Catatan"
					v-model="input.note"
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
import apiPost from 'src/api/api-post';
import { getLists } from 'src/api/api-get-lists';
import { digitSeparator } from 'src/utils/format-number';
const props = defineProps({
	dataInput: Object,
});
const emit = defineEmits(['successSubmit']);
const loading = ref([]);
const lists = ref([]);

const { loadingMain } = toRefs(loadingStore());
const input = ref({});

async function onSubmit() {
	const data = {
		description: input.value.description,
		via: input.value.via,
		note: input.value.note,
		journals: [
			{
				account_id: input.value.account_id,
				debit: input.value.debit,
				credit: 0,
			},
			{
				account_id: '1.1',
				debit: 0,
				credit: input.value.debit,
			},
		],
	};
	// console.log(data);
	// return;
	const post = await apiPost({
		endPoint: 'transactions',
		data,
		loading: loadingMain,
	});
	if (post) {
		emit('successSubmit');
		document.getElementById('btn-close').click();
	}
}

onMounted(async () => {
	Object.assign(input.value, props.dataInput);
	input.value.account_id = input.value.id;
	delete input.value.id;
	// console.log(input.value);
	await getLists({
		loading,
		lists,
		sort: true,
		key: 'metode-pembayaran',
	});
});
</script>
<style lang=""></style>
