<template>
	<q-page class="q-ma-sm">
		<q-card class="q-mt-sm">
			<q-card-section class="no-padding bg-blue-grey-8 text-blue-grey-1">
				<q-toolbar>
					<q-toolbar-title class="">
						<div class="text-subtitle1">Daftar Menu</div>
						<div class="text-subtitle2">{{ canteen.name }}</div>
					</q-toolbar-title>
					<q-btn
						icon="arrow_back"
						label="Kembali"
						no-caps=""
						outline
						dense
						class="q-px-md"
						to="/user/canteen"
					/>
				</q-toolbar>
			</q-card-section>

			<q-table
				:rows="filteredMenus"
				:loading="loading"
				:columns="columns"
				row-key="name"
			>
				<template v-slot:top-left>
					<div style="width: 250px">
						<q-select
							dense
							class="q-my-xs"
							outlined
							label="Filter Category"
							emit-value
							map-options
							v-model="selectedCategory"
							:options="groupByCategory(menus)"
							:loading="loading"
							clearable
							@update:model-value="filterCategory"
							behavior="menu"
						/>
					</div>
				</template>
				<template v-slot:top-right>
					<q-btn
						label="Baru"
						dense
						class="q-px-md"
						icon="add"
						no-caps=""
						glossy=""
						@click="addMenu"
					/>
				</template>
				<template v-slot:header="props">
					<q-tr :props="props">
						<q-th
							v-for="col in props.cols"
							:key="col.name"
							:props="props"
						>
							{{ col.label }}
						</q-th>
						<q-th>!</q-th>
					</q-tr>
				</template>

				<template v-slot:body="props">
					<q-tr :props="props">
						<q-td
							v-for="col in props.cols"
							:key="col.name"
							:props="props"
						>
							{{ col.value }}
						</q-td>
						<q-td class="">
							<q-btn
								class="q-px-sm full-width"
								no-caps=""
								outline=""
								color="blue-grey-10"
								dense
								@click="updateMenu(props.row)"
								icon="edit"
							/>
						</q-td>
					</q-tr>
				</template>
			</q-table>
		</q-card>
		<q-dialog persistent="" v-model="crudMenu">
			<MyCanteenCrudMenus
				:data-input="menu"
				@success-submit="loadData"
				@success-delete="loadData"
			/>
		</q-dialog>
	</q-page>

	<!-- {{ menus }} -->
	<!-- {{ canteen }} -->
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { onMounted, ref } from 'vue';
import { digitSeparator } from 'src/utils/format-number';
import MyCanteenCrudMenus from './MyCanteenCrudMenus.vue';

const selectedCategory = ref('');
const menus = ref([{}]);
const loading = ref(false);
const canteen = ref({});
const filteredMenus = ref([{}]);
const crudMenu = ref(false);
const menu = ref([]);

async function loadData() {
	crudMenu.value = false;
	const data = await apiGet({
		endPoint: 'member/canteen',
		loading,
	});
	// console.log(data);
	menus.value = data.menus;
	canteen.value = data.canteen;
	filteredMenus.value = menus.value;
	// console.log(data.menus);
}

const columns = [
	{
		name: 'category',
		label: 'Kategori',
		align: 'left',
		field: 'category',
		sortable: true,
	},
	{
		name: 'name',
		label: 'Nama Menu',
		align: 'left',
		field: 'name',
		sortable: true,
	},
	{
		name: 'price',
		label: 'Harga',
		align: 'right',
		field: 'price',
		format: (val) => `Rp${digitSeparator(val || 0)}`,
		sortable: true,
	},
	{
		name: 'unit',
		label: 'Satuan',
		align: 'left',
		field: 'unit',
		sortable: true,
	},
];

function groupByCategory(data) {
	const categories = [];
	data.forEach((item) => {
		if (!categories.includes(item.category)) {
			categories.push(item.category);
		}
	});
	return categories;
}

function filterCategory(v) {
	if (v) {
		// console.log('filter');
		filteredMenus.value = menus.value.filter((obj) => obj.category == v);
	} else {
		filteredMenus.value = menus.value;
	}
}

function updateMenu(val) {
	menu.value = val;
	menu.value.canteen_name = canteen.value.name;
	crudMenu.value = true;
}

function addMenu() {
	menu.value = {};
	menu.value.canteen_name = canteen.value.name;
	crudMenu.value = true;
}

onMounted(async () => {
	await loadData();
});
</script>
