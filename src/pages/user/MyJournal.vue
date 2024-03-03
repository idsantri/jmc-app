<template lang="">
	<q-page class="q-pa-sm">
		<q-card class="q-mb-sm">
			<q-card-section class="q-pa-sm">
				<div v-if="loadingAccount">
					<q-skeleton type="text" />
				</div>
				<div v-else>
					No Rekening:
					<span class="text-weight-medium">{{ account.id }} </span>
					/ {{ account.name }}
					<span v-if="account.member_name">
						(an. {{ account.member_name }})
					</span>
					/ Saldo Akhir:
					<span class="text-weight-medium">
						Rp.{{ digitSeparator(account.final_balance || 0) }}
					</span>
					/ {{ kelompok.member_kelompok }} ({{
						kelompok.member_name
					}})
				</div>
			</q-card-section>
		</q-card>
		<HeadFilterTanggal
			:start-url="`/my-account`"
			@data-filter="(val) => (dataFilter = val)"
		/>

		<q-card class="q-mt-sm">
			<q-card-section class="bg-blue-grey-3 no-padding">
				<q-toolbar>
					<q-toolbar-title class="text-weight-light text-body1">
						<span class="text-subtitle1 text-weight-medium">
							Data Transaksi
						</span>
					</q-toolbar-title>

					<q-btn-dropdown
						class="bg-blue-grey-10 text-blue-grey-11 q-px-md"
						dense
						label="Menu"
						no-caps
					>
						<q-list>
							<q-item
								clickable
								v-close-popup
								@click="modelInfak = true"
							>
								<q-item-section avatar>
									<q-icon name="card_giftcard" />
								</q-item-section>
								<q-item-section>
									<q-item-label>Infak</q-item-label>
								</q-item-section>
							</q-item>

							<q-item
								clickable
								v-close-popup
								to="/my-account/pengajuan"
							>
								<q-item-section avatar>
									<q-icon name="request_quote" />
								</q-item-section>
								<q-item-section>
									<q-item-label>
										Pengajuan Pinjaman
									</q-item-label>
								</q-item-section>
							</q-item>
						</q-list>
					</q-btn-dropdown>
				</q-toolbar>
			</q-card-section>
			<!-- {{ params?.account_id.substring(0, 1) }} -->
			<q-table
				flat
				:rows="journals"
				row-key="name"
				:loading="loading"
				class="q-pa-sm"
				:rows-per-page-options="[10, 25, 50, 100, 0]"
				:columns="columns"
			>
				<template v-slot:body="props">
					<q-tr :props="props">
						<q-td key="cr_at" :props="props">
							{{ formatDateShort(props.row.cr_at) }}
						</q-td>
						<q-td key="debit" :props="props">
							{{ digitSeparator(props.row.debit || 0) }}
						</q-td>
						<q-td key="credit" :props="props">
							{{ digitSeparator(props.row.credit || 0) }}
						</q-td>
						<q-td key="balance" :props="props">
							{{ digitSeparator(props.row.balance || 0) }}
						</q-td>
					</q-tr>
				</template>
			</q-table>
		</q-card>
		<q-dialog persistent="" v-model="modelInfak">
			<TransactionInfak
				:data-account="account"
				@success-submit="loadData"
			/>
		</q-dialog>
	</q-page>
</template>
<script setup>
import HeadFilterTanggal from 'src/components/HeadFilterTanggal.vue';
import apiGet from 'src/api/api-get';
import { formatDateShort, isDate } from 'src/utils/format-date';
import { digitSeparator } from 'src/utils/format-number';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import TransactionInfak from 'src/pages/transactions/TransactionInfak.vue';

const journals = ref([]);
const account = ref({});
const kelompok = ref({});
const loading = ref(false);
const loadingAccount = ref(false);
const route = useRoute();
const params = {
	startDate: route.params.startDate || 0,
	endDate: route.params.endDate || 0,
};
const modelInfak = ref(false);
const startDate = ref(params.startDate);
const endDate = ref(params.endDate);

async function loadData() {
	const dataA = await apiGet({
		endPoint: 'member/account',
		loading: loadingAccount,
	});
	account.value = dataA.account;
	kelompok.value = dataA.kelompok;
	if (isDate(startDate.value) && isDate(endDate.value)) {
		const dataJ = await apiGet({
			endPoint: 'member/journal',
			loading,
			params: {
				start_date: startDate.value,
				end_date: endDate.value,
			},
		});
		// console.log(data.journals);
		journals.value = dataJ.journals;
	}
}
onMounted(async () => {
	await loadData();
});

const columns = [
	{
		name: 'cr_at',
		label: 'Tanggal',
		align: 'left',
		field: 'cr_at',
		sortable: true,
	},
	{
		name: 'debit',
		label: 'Debit',
		align: 'right',
		field: 'debit',
	},
	{
		name: 'credit',
		label: 'Kredit',
		align: 'right',
		field: 'credit',
	},
	{
		name: 'balance',
		label: 'Saldo',
		align: 'right',
		field: 'balance',
	},
];
</script>
<style lang=""></style>
