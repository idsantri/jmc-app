<template lang="">
	<q-page class="q-pa-sm">
		<q-card>
			<q-card-section class="bg-blue-grey-4 text-subtitle1 q-pa-sm">
				Anggota Kelompok
				<span class="text-weight-medium">{{ kelompok }}</span>
			</q-card-section>
			<q-table
				:rows="members"
				:columns="columns"
				row-key="name"
				:loading="loadingTable"
				:filter="filter"
				class="q-pa-sm"
				:rows-per-page-options="[10, 25, 50, 100, 0]"
			>
				<template v-slot:top-right>
					<q-input
						outlined
						dense
						debounce="300"
						v-model="filter"
						placeholder="Cari"
					>
						<template v-slot:append>
							<q-icon name="search" />
						</template>
					</q-input>
				</template>
				<template v-slot:body="props">
					<q-tr :props="props">
						<q-td key="account_id" :props="props">
							{{ props.row.account_id }}
						</q-td>
						<q-td key="nama" :props="props">
							{{ props.row.nama }} ({{ props.row.sex }})
						</q-td>
						<q-td key="alamat" :props="props">
							{{ props.row.desa || '' }}
							{{ props.row.kecamatan || '' }}
							{{ props.row.kabupaten || '' }}
						</q-td>
						<q-td key="final_balance" :props="props">
							Rp{{ digitSeparator(props.row.final_balance || 0) }}
						</q-td>
					</q-tr>
				</template>
			</q-table>
		</q-card>
		<!-- <pre>{{ members }}</pre> -->
	</q-page>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { digitSeparator } from 'src/utils/format-number';
import { onMounted, ref } from 'vue';

const members = ref([]);
const loadingTable = ref(false);
const filter = ref('');
const kelompok = ref('');
async function loadData() {
	const data = await apiGet({
		endPoint: 'kelompok/members',
		loading: loadingTable,
	});
	members.value = data.members;
	kelompok.value = data.kelompok;
}
onMounted(async () => {
	await loadData();
});

const columns = [
	{
		name: 'account_id',
		label: 'No. Rek.',
		align: 'left',
		field: 'account_id',
		sortable: true,
	},
	{
		name: 'nama',
		label: 'Nama',
		align: 'left',
		field: 'nama',
		sortable: true,
	},
	{
		name: 'alamat',
		label: 'Alamat',
		align: 'left',
		field: (r) =>
			`${r.desa || ''} ${r.kecamatan || ''} ${r.kabupaten || ''}`,
		sortable: true,
	},
	{
		name: 'final_balance',
		label: 'Saldo',
		align: 'right',
		field: 'final_balance',
		sortable: true,
	},
];
</script>
<style lang=""></style>
