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
					<span v-if="account.member_nama">
						(an. {{ account.member_nama }})
					</span>
					/ Saldo Akhir:
					<span class="text-weight-medium">
						Rp.{{ digitSeparator(account.final_balance || 0) }}
					</span>
				</div>
			</q-card-section>
		</q-card>
		<HeadFilterTanggal
			:start-url="`/journals/${params.account_id}`"
			@data-filter="(val) => (dataFilter = val)"
		/>
		<q-card class="q-mt-sm">
			<q-card-section class="bg-blue-grey-3 no-padding">
				<q-toolbar>
					<q-toolbar-title class="text-weight-light text-body1">
						<span class="text-subtitle1 text-weight-medium">
							Data Transaksi
						</span>
						<!-- <br /> <span
							v-html="dataFilter.display"
							enter-class="text-caption"
						></span> -->
					</q-toolbar-title>
					<div v-if="params?.account_id.substring(0, 1) == 3">
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
									@click="menabung"
								>
									<q-item-section avatar>
										<q-icon name="login" />
									</q-item-section>
									<q-item-section>
										<q-item-label> Menabung </q-item-label>
									</q-item-section>
								</q-item>
								<q-item clickable v-close-popup @click="tarik">
									<q-item-section avatar>
										<q-icon name="logout" />
									</q-item-section>
									<q-item-section>
										<q-item-label>
											Tarik Tabungan
										</q-item-label>
									</q-item-section>
								</q-item>

								<q-item
									clickable
									v-close-popup
									@click="transInfak = true"
								>
									<q-item-section avatar>
										<q-icon name="card_giftcard" />
									</q-item-section>
									<q-item-section>
										<q-item-label>Infak</q-item-label>
									</q-item-section>
								</q-item>
							</q-list>
						</q-btn-dropdown>
					</div>
					<div v-if="params?.account_id.substring(0, 1) == 4">
						<q-btn
							icon="add"
							label="Pengeluaran"
							no-caps
							glossy
							class="bg-blue-grey-1 text-blue-grey-10"
							@click="transPendapatan = true"
						/>
					</div>
				</q-toolbar>
			</q-card-section>
			<!-- {{ params?.account_id.substring(0, 1) }} -->
			<q-table
				flat
				:columns="columns"
				:rows="journals"
				row-key="name"
				:loading="loading"
				class="q-pa-sm"
				:rows-per-page-options="[10, 25, 50, 100, 0]"
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
						<q-td key="edit" :props="props">
							<q-btn-dropdown color="blue-grey" dense outline>
								<q-list>
									<q-item
										class="bg-positive text-dark"
										clickable
										v-close-popup
										@click="sendMessage(props.row)"
										:disable="
											account.id.substring(0, 1) != 3
										"
									>
										<q-item-section avatar>
											<q-icon
												color="white"
												name="phone"
											/>
										</q-item-section>
										<q-item-section>
											<q-item-label>
												WhatsApp
											</q-item-label>
										</q-item-section>
									</q-item>
									<q-item
										class="bg-negative text-white"
										clickable
										v-close-popup
										@click="deleteTransaction(props.row)"
									>
										<q-item-section avatar>
											<q-icon
												color="white"
												name="delete"
											/>
										</q-item-section>
										<q-item-section>
											<q-item-label>Hapus</q-item-label>
										</q-item-section>
									</q-item>
								</q-list>
							</q-btn-dropdown>
						</q-td>
						<q-td key="cr_by" :props="props">
							{{ props.row.cr_by }}
						</q-td>
					</q-tr>
				</template>
			</q-table>
		</q-card>
		<q-dialog persistent="" v-model="transModal">
			<TransactionModal
				:data-input="account"
				@success-submit="loadData"
				:trans-status="transStatus"
			/>
		</q-dialog>
		<q-dialog persistent="" v-model="transPendapatan">
			<TransactionPendapatan
				:data-input="account"
				@success-submit="loadData"
			/>
		</q-dialog>
		<q-dialog persistent="" v-model="transInfak">
			<TransactionInfak
				:data-account="account"
				@success-submit="loadData"
			/>
		</q-dialog>
	</q-page>
	<!-- <pre>{{ route }}</pre> -->
</template>
<script setup>
import { useRoute } from 'vue-router';
import HeadFilterTanggal from 'src/components/HeadFilterTanggal.vue';
import { onMounted, ref } from 'vue';
import apiGet from 'src/api/api-get';
import { formatDateShort, isDate } from 'src/utils/format-date';
import { digitSeparator } from 'src/utils/format-number';
import apiDelete from 'src/api/api-delete';
import { notifyError } from 'src/utils/notify';
import TransactionModal from 'src/pages/transactions/TransactionModal.vue';
import TransactionPendapatan from 'src/pages/transactions/TransactionPedapatan.vue';
import TransactionInfak from 'src/pages/transactions/TransactionInfak.vue';

const loading = ref(false);
const dataFilter = ref({});
const route = useRoute();
const params = {
	startDate: route.params.startDate || 0,
	endDate: route.params.endDate || 0,
	account_id: route.params.account_id || null,
};
const transModal = ref(false);
const transPendapatan = ref(false);
const transInfak = ref(false);
const transStatus = ref('');

const journals = ref([]);
const account = ref({});
const startDate = ref(params.startDate);
const endDate = ref(params.endDate);
const loadingAccount = ref(false);

async function deleteTransaction(val) {
	const del = await apiDelete({
		endPoint: `transactions/${val.transaction_id}`,
		rerender: false,
		message: `Yakin mau hapus transaksi ini?<br/>
		Debit: ${digitSeparator(val.debit || 0)}<br/>
		Kredit: ${digitSeparator(val.credit || 0)}<br/>`,
	});
	if (del) {
		await loadData();
	}
}

function menabung() {
	transStatus.value = 'c';
	transModal.value = true;
}
function tarik() {
	transStatus.value = 'd';
	transModal.value = true;
}

async function loadData() {
	const dataA = await apiGet({
		endPoint: `accounts/${params.account_id}`,
		loading: loadingAccount,
	});
	account.value = dataA.account;

	if (isDate(startDate.value) && isDate(endDate.value)) {
		const dataJ = await apiGet({
			endPoint: 'journals',
			loading,
			params: {
				account_id: params.account_id,
				start_date: startDate.value,
				end_date: endDate.value,
			},
		});
		// console.log(data.journals);
		journals.value = dataJ.journals;
		// console.log(account.value);
		// console.log(account.value.id.substring(0, 1));
	}
}

function sendMessage(val) {
	// console.log(val);
	// console.log(account.value);
	const phoneNumber = account.value.user_phone?.replace(/^0/, '62'); // Nomor telepon penerima
	const transaction_id = val.transaction_id;
	const cr_at = val.cr_at;
	const final_balance = digitSeparator(account.value.final_balance || 0);

	const status =
		val.credit > 0
			? `kredit Rp${digitSeparator(val.credit)}`
			: `debit Rp${digitSeparator(val.debit)}`;

	if (!phoneNumber) {
		notifyError('Yang bersangkutan belum memasang nomor telepon');
		return;
	}

	const message = `JMC ${status}, ${cr_at}, ref ${transaction_id}, saldo Anda Rp${final_balance}`;

	// return console.log(message);

	const whatsappLink = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(
		message
	)}`;
	// Buka tautan WhatsApp di tab baru
	window.open(whatsappLink, '_blank');
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
	{
		name: 'edit',
		label: '!',
		align: 'center',
	},
	{
		name: 'cr_by',
		label: 'By',
		align: 'left',
		field: 'cr_by',
	},
];
</script>

<style lang=""></style>
