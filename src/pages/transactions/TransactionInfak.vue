<template lang="">
	<q-card class="full-width" style="max-width: 425px">
		<q-form @submit.prevent="onSubmit">
			<q-card-section class="bg-blue-grey-7 text-blue-grey-11 q-pa-sm">
				<toolbar-form @emit-button="null" :button-setting="false">
					<div class="text-center">Infak</div>
				</toolbar-form>
			</q-card-section>
			<q-banner class="bg-blue-grey-10 text-blue-grey-11 text-center">
				<div class="text-weight-medium">{{ account.member_nama }}</div>
				<div>
					Saldo: Rp{{ digitSeparator(account.final_balance || 0) }}
				</div>
			</q-banner>
			<q-card-section class="q-pa-sm">
				<q-select
					class=""
					dense
					outlined
					label="Rekening Tujuan"
					emit-value
					map-options
					v-model="input.account_infak"
					:options="accountLists"
					:loading="accountLoading"
					option-value="id"
					option-label="name"
					behavior="menu"
					required
				/>

				<CurrencyInput
					v-model="input.nominal"
					outlined
					dense
					label="Nominal Infak"
					class="q-mt-sm"
					required
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
import { digitSeparator } from 'src/utils/format-number';
import apiGet from 'src/api/api-get';
import { useRoute } from 'vue-router';

const props = defineProps({
	dataAccount: Object,
});
const emit = defineEmits(['successSubmit']);
const accountLoading = ref(false);
const accountLists = ref([]);
const route = useRoute();
const { loadingMain } = toRefs(loadingStore());
const input = ref({ description: 'Infak' });
const account = ref({});
async function onSubmit() {
	// console.log(route.params);
	const url = route.params.account_id
		? `members/${account.value.member_id}/infak`
		: 'member/infak';
	// console.log(account.value);
	// return;
	const data = {
		description: input.value.description,
		note: input.value.note,
		account_infak: input.value.account_infak,
		nominal: input.value.nominal,
	};
	// console.log(data);
	// return;
	const post = await apiPost({
		endPoint: url,
		data,
		loading: loadingMain,
	});
	if (post) {
		emit('successSubmit');
		document.getElementById('btn-close').click();
	}
}

async function loadAccount() {
	const data = await apiGet({
		endPoint: 'accounts/lists/4',
		loading: accountLoading,
	});
	accountLists.value = data.accounts;
	// console.log(accountLists.value);
}
onMounted(async () => {
	Object.assign(account.value, props.dataAccount);
	console.log(account.value);
	// console.log(account.value);
	await loadAccount();
});
</script>
<style lang=""></style>
