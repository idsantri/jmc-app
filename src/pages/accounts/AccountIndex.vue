<template lang="">
	<q-page class="q-pa-sm">
		<q-card style="max-width: 500px">
			<q-card-section class="bg-blue-grey-4 no-padding">
				<q-toolbar>
					<q-toolbar-title class="q-pa-sm">
						<div class="text-subtitle1 text-weight-medium">
							Daftar Rekening
						</div>

						<div
							class="text-subtitle2 text-italic text-weight-light"
						>
							Tidak Menampilkan Rekening Anggota
						</div>
					</q-toolbar-title>
					<div>
						<q-btn
							icon="add"
							label="Baru"
							no-caps
							glossy
							color="blue-grey-10"
							@click="addNew"
						/>
					</div>
				</q-toolbar>
				<!-- <div class="text-weight-medium">Data Rekening</div>
				<div class="text-italic">
					Tidak Menampilkan Rekening Anggota
				</div> -->
			</q-card-section>
			<q-card-section>
				<q-spinner-cube
					v-if="loading"
					color="blue-grey-12"
					size="14em"
					class="flex flex-center q-mx-auto"
				/>
				<q-markup-table flat v-else>
					<thead>
						<tr>
							<th class="">No Rek.</th>
							<th class="text-left">Nama Akun</th>
							<th class="text-right">Saldo Akhir</th>
							<th>!</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(account, index) in accounts" :key="index">
							<td class="text-center">{{ account?.id }}</td>
							<td class="">{{ account.name }}</td>
							<td class="text-right">
								Rp{{
									digitSeparator(account.final_balance || 0)
								}}
							</td>
							<td class="text-right">
								<q-btn
									dense
									glossy
									icon="edit"
									outline
									round
									class="text-blue-grey-7 q-mr-md"
									@click="editAccount(account)"
									:disable="account.id.substring(0, 1) == 1"
								/>
								<q-btn
									dense
									glossy
									icon="info"
									outline
									round
									class="text-blue-grey-7"
									:to="`/journals/${account.id}/0`"
								/>
							</td>
						</tr>
					</tbody>
				</q-markup-table>
			</q-card-section>
		</q-card>
		<q-dialog persistent="" v-model="crudShow">
			<AccountCrud
				:is-new="isNew"
				:data-input="account"
				@success-submit="loadData"
				@success-delete="loadData"
			/>
		</q-dialog>
	</q-page>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { onMounted, ref } from 'vue';
import AccountCrud from './AccountCrud.vue';
import { digitSeparator } from 'src/utils/format-number';

const loading = ref(false);
const accounts = ref([]);
const account = ref({});
const crudShow = ref(false);
const isNew = ref(false);
async function loadData() {
	const data = await apiGet({ endPoint: 'accounts/not-member', loading });
	console.log(data.accounts);
	accounts.value = data.accounts;
}

function addNew() {
	isNew.value = true;
	account.value = {};
	crudShow.value = true;
}

function editAccount(input) {
	account.value = input;
	isNew.value = false;
	crudShow.value = true;
}

onMounted(async () => {
	await loadData();
});
</script>
<style lang=""></style>
