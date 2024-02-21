<template lang="">
	<q-page class="q-pa-sm">
		<q-card style="max-width: 500px">
			<q-card-section class="bg-blue-grey-4">Rekap Akun</q-card-section>
			<q-card-section>
				<q-spinner-cube
					v-show="loading"
					color="blue-grey-12"
					size="14em"
					class="flex flex-center q-mx-auto"
				/>
				<q-markup-table flat>
					<tbody>
						<tr v-for="(account, index) in accounts" :key="index">
							<td>{{ account?.account }}</td>
							<td>{{ account?.name }}</td>
							<td class="text-right">
								Rp{{ digitSeparator(account?.final_balance) }}
							</td>
						</tr>
					</tbody>
				</q-markup-table>
			</q-card-section>
		</q-card>
	</q-page>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { digitSeparator } from 'src/utils/format-number';
import { onMounted, ref } from 'vue';

const loading = ref(false);
const accounts = ref([]);

async function loadData() {
	const data = await apiGet({ endPoint: 'accounts/group', loading });
	// accounts.value = data.account_group;
	// console.log(data.account_group);
	const filteredAccount = data.account_group.filter(
		(acc) => acc.account != 2 && acc.account != 5
	);
	accounts.value = filteredAccount;
}
onMounted(async () => {
	await loadData();
});
</script>
<style lang=""></style>
