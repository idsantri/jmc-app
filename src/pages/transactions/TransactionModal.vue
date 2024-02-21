<template lang="">
	<q-card class="full-width" style="max-width: 425px">
		<q-form @submit.prevent="onSubmit">
			<q-card-section class="bg-blue-grey-7 text-blue-grey-11 q-pa-sm">
				<toolbar-form @emit-button="null" :button-setting="true">
					Transaksi Tabungan
				</toolbar-form>
			</q-card-section>
			<q-banner class="bg-blue-grey-10 text-blue-grey-11 q-pa-sm">
				<table>
					<tbody>
						<tr>
							<td class="text-italic q-pr-md">Nama</td>
							<td>{{ input.member_name }}</td>
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
				<div class="q-gutter-sm q-mt-sm">
					<q-radio
						v-model="status"
						val="1"
						label="Menabung"
						@update:model-value="onUpdateStatus"
					/>
					<q-radio
						v-model="status"
						val="0"
						label="Tarik Tabungan"
						@update:model-value="onUpdateStatus"
					/>
				</div>
				<CurrencyInput
					v-model="input.debit"
					outlined
					dense
					label="Debit"
					class="q-mt-sm"
					:disable="disableDebit"
					required
				/>
				<CurrencyInput
					v-model="input.credit"
					outlined
					dense
					label="Kredit"
					class="q-mt-sm"
					:disable="disableCredit"
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
const status = ref('1');
const disableCredit = ref(true);
const disableDebit = ref(false);
function onUpdateStatus() {
	if (status.value == 1) {
		disableCredit.value = false;
		disableDebit.value = true;
		input.value.debit = 0;
	} else {
		disableCredit.value = true;
		disableDebit.value = false;
		input.value.credit = 0;
	}
}

function dataSubmit() {
	const description = status.value == 1 ? 'Menabung' : 'Tarik Tabungan';
	const via = input.value.via;
	const note = input.value.note;
	const journals = [
		{
			account_id: '1.1',
			debit: status.value == 1 ? input.value.credit : 0,
			credit: status.value == 1 ? 0 : input.value.debit,
		},
		{
			account_id: input.value.account_id,
			debit: status.value == 1 ? 0 : input.value.debit,
			credit: status.value == 1 ? input.value.credit : 0,
		},
	];
	return { description, via, journals, note };
}

async function onSubmit() {
	const data = dataSubmit();
	console.log(data);
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
	console.log(input.value);
	onUpdateStatus();
	await getLists({
		loading,
		lists,
		sort: true,
		key: 'metode-pembayaran',
	});
});
</script>
<style lang=""></style>
