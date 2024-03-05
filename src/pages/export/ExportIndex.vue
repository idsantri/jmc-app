<template lang="">
	<q-page class="q-pa-sm">
		<q-card style="max-width: 600px">
			<q-toolbar class="bg-blue-grey-4 text-subtitle1">
				Export Data (Excel)
				<q-space />
			</q-toolbar>
			<q-card-section class="q-pa-sm">
				<q-list separator bordered>
					<q-item>
						<q-item-section>
							<q-item-label>Data Anggota</q-item-label>
						</q-item-section>
						<q-item-section avatar>
							<q-btn
								icon="download"
								glossy
								@click="downloadMember"
							/>
						</q-item-section>
					</q-item>
					<q-item>
						<q-item-section>
							<q-item-label>Data Akun</q-item-label>
						</q-item-section>
						<q-item-section avatar>
							<q-btn
								icon="download"
								glossy
								@click="downloadAccount"
							/>
						</q-item-section>
					</q-item>
					<q-expansion-item label="Transaksi">
						<q-card>
							<q-form @submit.prevent="downloadTransaction">
								<q-card-section class="q-py-sm">
									<q-input
										dense
										class="q-mt-sm"
										outlined
										label="Dari Tanggal"
										type="date"
										v-model="tInput.start_date"
										required
										:hint="
											formatDateFull(tInput.start_date)
										"
									/>
									<q-input
										dense
										class="q-mt-sm"
										outlined
										label="Sampai Tanggal"
										type="date"
										v-model="tInput.end_date"
										required
										:hint="formatDateFull(tInput.end_date)"
									/>
								</q-card-section>
								<q-card-actions align="right" class="q-px-md">
									<q-btn
										icon="download"
										label="Download"
										no-caps
										glossy
										class="q-px-md"
										type="submit"
										dense
									/>
								</q-card-actions>
							</q-form>
						</q-card>
					</q-expansion-item>
					<q-expansion-item label="Jurnal">
						<q-card>
							<q-form @submit.prevent="downloadJournal">
								<q-card-section class="q-py-sm">
									<q-input
										dense
										class=""
										outlined
										label="ID | No. Rekening"
										v-model="jInput.account_id"
										required
									/>
									<q-input
										dense
										class="q-mt-sm"
										outlined
										label="Dari Tanggal"
										type="date"
										v-model="jInput.start_date"
										required
										:hint="
											formatDateFull(jInput.start_date)
										"
									/>
									<q-input
										dense
										class="q-mt-sm"
										outlined
										label="Sampai Tanggal"
										type="date"
										v-model="jInput.end_date"
										required
										:hint="formatDateFull(jInput.end_date)"
									/>
								</q-card-section>
								<q-card-actions align="right" class="q-px-md">
									<q-btn
										icon="download"
										label="Download"
										no-caps
										glossy
										class="q-px-md"
										type="submit"
									/>
								</q-card-actions>
							</q-form>
						</q-card>
					</q-expansion-item>
				</q-list>
			</q-card-section>
		</q-card>
	</q-page>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import loadingStore from 'src/stores/loading-store';
import { formatDateFull } from 'src/utils/format-date';
import { ref, toRefs } from 'vue';

formatDateFull;
const { loadingMain } = toRefs(loadingStore());
const tInput = ref({});
const jInput = ref({});
async function downloadMember() {
	const data = await apiGet({
		endPoint: 'export/members',
		loading: loadingMain,
	});
	let link = document.createElement('a');
	link.href = data.url;
	link.click();
	link.remove();
}

async function downloadAccount() {
	const data = await apiGet({
		endPoint: 'export/accounts',
		loading: loadingMain,
	});
	let link = document.createElement('a');
	link.href = data.url;
	link.click();
	link.remove();
}

async function downloadTransaction() {
	const data = await apiGet({
		endPoint: 'export/transactions',
		loading: loadingMain,
		params: {
			start_date: tInput.value.start_date,
			end_date: tInput.value.end_date,
		},
	});
	let link = document.createElement('a');
	link.href = data.url;
	link.click();
	link.remove();
}

async function downloadJournal() {
	const data = await apiGet({
		endPoint: 'export/journals',
		loading: loadingMain,
		params: {
			account_id: jInput.value.account_id,
			start_date: jInput.value.start_date,
			end_date: jInput.value.end_date,
		},
	});
	if (!data) return;
	let link = document.createElement('a');
	link.href = data.url;
	link.click();
	link.remove();
}
</script>
<style lang=""></style>
