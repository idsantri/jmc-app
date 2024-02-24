<template lang="">
	<q-page class="q-pa-sm">
		<q-card style="max-width: 600px">
			<q-card-section class="bg-blue-grey-11 no-padding">
				<q-toolbar>
					<q-toolbar-title class="text-weight-light text-body1">
						<span class="text-subtitle1 text-weight-medium">
							Permohonan Pinjaman
						</span>
					</q-toolbar-title>

					<q-btn
						class="bg-blue-grey-10 text-blue-grey-11 q-px-md"
						dense
						label="Baru"
						icon="add"
						no-caps
						@click="newLoan"
					/>
				</q-toolbar>
			</q-card-section>
			<q-card-section class="q-pa-sm" style="min-height: 70px">
				<div v-if="loadingLoan">
					<q-spinner-cube
						color="blue-grey-12"
						size="8em"
						class="flex q-ma-lg q-mx-auto"
					/>
				</div>
				<div v-else>
					<q-list v-if="loans.length" bordered separator>
						<q-item v-for="(loan, index) in loans" :key="index">
							<q-item-section>
								<q-item-label class="flex">
									<table>
										<tr>
											<td class="col-label">Tanggal</td>
											<td>
												{{
													formatDateShort(loan.cr_at)
												}}
											</td>
										</tr>
										<tr>
											<td class="col-label">Keperluan</td>
											<td>{{ loan.keperluan }}</td>
										</tr>
										<tr>
											<td class="col-label">Nominal</td>
											<td>
												Rp{{
													digitSeparator(
														loan.nominal || 0
													)
												}}
												&mdash;
												<span class="text-italic">
													({{ loan.cicilan }} kali
													angsuran = @ Rp{{
														digitSeparator(
															(
																loan.nominal /
																loan.cicilan
															).toFixed(2)
														)
													}}
													/ bulan)
												</span>
											</td>
										</tr>
										<tr>
											<td class="col-label">Status</td>
											<td>
												<span
													v-if="loan.status == 0"
													class="flex justify-start"
												>
													Ditolak
													<q-icon
														name="do_not_disturb"
														color="negative"
														class="q-pl-sm"
													/>
												</span>
												<span
													v-else-if="loan.status == 1"
													class="flex justify-start"
												>
													Disetujui
													<q-icon
														name="task_alt"
														color="positive"
														class="q-pl-sm"
													/>
												</span>
												<span
													v-else
													class="flex justify-start"
												>
													Dalam peninjauan
													<q-icon
														name="cached"
														color="primary"
														class="q-pl-sm"
													/>
												</span>
											</td>
										</tr>
										<tr>
											<td class="col-label">
												Keterangan
											</td>
											<td>
												{{ loan.keterangan || '-' }}
											</td>
										</tr>
									</table>
									<q-space />
									<div class="flex flex-center">
										<span
											v-if="
												loan.status != 0 &&
												loan.status != 1
											"
										>
											<q-btn
												icon="edit"
												round
												class=""
												glossy
												outline
												@click="editLoan(loan)"
											/>
										</span>
									</div>
								</q-item-label>
								<q-item-label
									v-if="loan.status != 0 && loan.status != 1"
									class="bg-blue-grey-1 q-pa-sm"
								>
									<q-btn
										no-caps
										dense
										class="q-px-md text-blue-grey-10"
										icon="call"
										glossy
										outline
										@click="sendText(loan)"
									/>
									<span class="q-ml-sm"
										>Ajukan kepada Ketua
										{{ account.member_kelompok }}
										({{ kelompok.member_name }})</span
									>
								</q-item-label>
							</q-item-section>
						</q-item>
					</q-list>
					<div v-else>
						<q-banner class="text-center text-primary">
							Anda belum pernah mengajukan pinjam. <br />
							Silakan ajukan pinjaman jika Anda membutuhkan!
						</q-banner>
					</div>
				</div>
			</q-card-section>
		</q-card>

		<!-- <pre>{{ account }}</pre>
		<pre>{{ kelompok }}</pre> -->
		<!-- <pre>{{ loans }}</pre> -->

		<q-dialog persistent="" v-model="loanCrud">
			<MyLoanCrud
				:data-input="loan"
				@success-submit="loadData"
				@success-delete="loadData"
			/>
		</q-dialog>
	</q-page>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { formatDateShort } from 'src/utils/format-date';
import { digitSeparator } from 'src/utils/format-number';
import { onMounted, ref } from 'vue';
import MyLoanCrud from './MyLoanCrud.vue';
import { notifyError } from 'src/utils/notify';

const loanCrud = ref(false);
const account = ref({});
const kelompok = ref({});
const loans = ref([]);
const loan = ref({});
const loadingAccount = ref(false);
const loadingLoan = ref(false);

function newLoan() {
	loan.value = {};
	loanCrud.value = true;
}

function editLoan(val) {
	loan.value = val;
	loanCrud.value = true;
}

async function loadData() {
	const data = await apiGet({
		endPoint: 'member/account',
		loading: loadingAccount,
	});
	// console.log(data);
	account.value = data.account;
	kelompok.value = data.kelompok;

	const dataLoan = await apiGet({
		endPoint: 'member/loan-applications',
		loading: loadingLoan,
	});
	// console.log(dataLoan);
	loans.value = dataLoan.loans;
}
onMounted(async () => {
	await loadData();
});

function sendText(loan) {
	// console.log('l', loan);
	// console.log('a', account.value);
	// console.log('k', kelompok.value);

	const phoneNumber = kelompok.value.user_phone?.replace(/^0/, '62'); // Nomor telepon penerima
	if (!phoneNumber) {
		notifyError('Ketua kelompok bersangkutan belum memasang nomor telepon');
		return;
	}
	// const transaction_id = val.transaction_id;
	// const cr_at = val.cr_at;
	// const final_balance = digitSeparator(account.value.final_balance || 0);

	// const status =
	// 	val.credit > 0
	// 		? `kredit Rp${digitSeparator(val.credit)}`
	// 		: `debit Rp${digitSeparator(val.debit)}`;

	let message = `Yang terhormat anggota JMC Kelompok ${account.value.member_kelompok} \n`;
	message += `via Ketua Kelompok ${account.value.member_kelompok} \n`;
	message += `Dengan ini, saya *${account.value.member_name}* (ID Anggota ${account.value.member_id}, No Rekening ${account.value.id}) \n`;
	message += `mengajukan pinjaman sebesar *Rp${digitSeparator(
		loan.nominal
	)}*\n`;
	message += `Dana tersebut saya butuhkan untuk keperluan ${loan.keperluan}\n`;
	message += `Saya berjanji akan melunasi pinjaman ini dalam dalam jangka waktu ${loan.cicilan} bulan \n`;
	message += 'Demikian harap maklum. Terima kasih.';

	// return console.log(message);

	const whatsappLink = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(
		message
	)}`;
	// Buka tautan WhatsApp di tab baru
	window.open(whatsappLink, '_blank');
}
</script>
<style lang="scss" scoped>
.col-label {
	font-style: italic;
	padding-right: 5pt;
}
</style>
