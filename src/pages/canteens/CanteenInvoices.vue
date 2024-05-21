<template lang="">
	<q-table
		flat
		:rows="invoices"
		:loading="loading"
		:columns="columns"
		row-key="name"
		:filter="filter"
		@row-click="(evt, row, index) => $router.push(`/invoices/${row.id}`)"
		:rows-per-page-options="[10, 25, 50, 100, 0]"
	>
		<template v-slot:top>
			<q-input
				outlined
				dense
				debounce="300"
				v-model="filter"
				placeholder="Cari"
				clearable
				class="full-width"
			>
				<template v-slot:append>
					<q-icon name="search" />
				</template>
			</q-input>
		</template>
	</q-table>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { formatDateShort } from 'src/utils/format-date';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const loading = ref(false);
const invoices = ref([]);
const filter = ref('');
const route = useRoute();

async function loadData() {
	const data = await apiGet({
		endPoint: `canteens/${route.params.id}/invoices`,
		loading: loading,
	});
	invoices.value = data.invoices;
	// console.log(data);
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
