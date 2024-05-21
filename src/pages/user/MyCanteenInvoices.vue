<template lang="">
	<q-page class="q-ma-sm">
		<q-card>
			<q-card-section class="q-pa-sm">
				<q-table
					flat
					:rows="invoices"
					:loading="loading"
					:columns="columns"
					row-key="name"
					:filter="filter"
					@row-click="
						(evt, row, index) => $router.push(`/invoices/${row.id}`)
					"
					:rows-per-page-options="[10, 25, 50, 100, 0]"
				>
					<template v-slot:top>
						<div>
							<div class="text-subtitle1">Data Pesanan</div>
							<div class="text-subtitle2">{{ canteen.name }}</div>
						</div>
						<q-space />

						<q-input
							outlined
							dense
							debounce="300"
							v-model="filter"
							placeholder="Cari"
							clearable
						>
							<template v-slot:append>
								<q-icon name="search" />
							</template>
						</q-input>
					</template>
				</q-table>
			</q-card-section>
		</q-card>
		<!-- <pre>{{ canteen }}</pre> -->
		<!-- <pre>{{ invoices }}</pre> -->
	</q-page>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { formatDateShort } from 'src/utils/format-date';
import { onMounted, ref } from 'vue';

const loading = ref(false);
const invoices = ref([]);
const canteen = ref({});
const filter = ref('');

async function loadData() {
	const data = await apiGet({
		endPoint: 'member/canteen-invoices',
		loading: loading,
	});
	invoices.value = data.invoices;
	canteen.value = data.canteen;
}

const columns = [
	{
		name: 'ship_on',
		label: 'Tanggal',
		field: 'ship_on',
		sortable: true,
		align: 'left',
		format: (val) => `${formatDateShort(val)}`,
	},
	{
		name: 'customer_name',
		label: 'Atas Nama',
		field: 'customer_name',
		sortable: true,
		align: 'left',
	},
	{
		name: 'ship_to',
		label: 'Kirim Ke',
		field: 'ship_to',
		sortable: true,
		align: 'left',
	},
	{
		name: 'courier',
		label: 'Kurir',
		field: 'courier',
		sortable: true,
		align: 'left',
	},
];
onMounted(async () => {
	await loadData();
});
</script>
<style lang=""></style>
