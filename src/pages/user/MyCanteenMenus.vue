<template>
	<div class="q-ma-sm" style="max-width: 600px">
		<q-card>
			<q-card-section class="q-pa-sm">
				<q-select
					dense
					outlined
					label="Pilih Kategori Menu"
					v-model="categoryMenu"
					:options="['Makanan', 'Minuman', 'Camilan', 'Lainnya']"
					emit-value
					map-options
					@update:model-value="(v) => (selectedMenu = menus[v] || [])"
					:loading="loading"
					behavior="menu"
				/>
			</q-card-section>
		</q-card>
		<q-card class="q-mt-sm">
			<q-card-section class="no-padding bg-blue-grey-8 text-blue-grey-1">
				<q-toolbar>
					<q-toolbar-title class="text-subtitle1">
						Daftar Menu&nbsp;<span class="text-weight-medium">{{
							categoryMenu
						}}</span>
					</q-toolbar-title>
					<q-btn
						icon="arrow_back"
						label="Kembali"
						no-caps=""
						outline
						to="/user/canteen"
					/>
				</q-toolbar>
			</q-card-section>
			<q-card-section class="q-pa-sm">
				<div v-if="loading">
					<q-spinner-cube
						color="blue-grey-12"
						size="8em"
						class="flex q-mx-auto"
					/>
				</div>
				<div v-else>
					<div v-if="!categoryMenu">
						<div class="q-pa-lg text-center text-weight-medium">
							Silakan Pilih Menu!
						</div>
					</div>
					<div v-else>
						<q-list separator bordered>
							<div
								v-for="(menu, index) in selectedMenu"
								:key="menu.id"
							>
								<q-form @submit.prevent="updateMenu(menu)">
									<q-item
										:class="
											index % 2 == 0
												? 'q-pa-sm'
												: 'q-pa-sm bg-blue-grey-1'
										"
									>
										<q-item-section
											class="q-gutter-sm q-mr-sm"
										>
											<q-input
												label="Nama"
												dense
												outlined
												v-model="menu.name"
												required
											/>
											<CurrencyInput
												v-model="menu.price"
												outlined
												dense
												label="Harga"
												required
											/>
										</q-item-section>
										<q-item-section
											side
											class="q-gutter-sm no-padding"
										>
											<q-btn
												color="positive"
												glossy
												icon="save"
												type="submit"
											/>
											<q-btn
												color="negative"
												glossy
												icon="delete"
												@click="deleteMenu(menu.id)"
											/>
										</q-item-section>
									</q-item>
								</q-form>
							</div>
							<div>
								<q-form @submit.prevent="addMenu">
									<q-item
										class="q-pa-sm"
										:class="
											selectedMenu.length % 2 == 0
												? ''
												: 'bg-blue-grey-1'
										"
									>
										<q-item-section
											class="q-gutter-sm q-mr-sm"
										>
											<q-input
												dense
												outlined
												v-model="newMenu.name"
												required
											/>
											<CurrencyInput
												v-model="newMenu.price"
												outlined
												dense
												label="Harga"
												required
											/>
										</q-item-section>
										<q-item-section
											side
											class="q-gutter-sm no-padding"
										>
											<q-btn
												type="submit"
												color="positive"
												glossy
												icon="save"
											/>
											<q-btn
												color="grey"
												glossy
												icon="delete"
												disable
											/>
										</q-item-section>
									</q-item>
								</q-form>
							</div>
						</q-list>
					</div>
				</div>
			</q-card-section>
		</q-card>
		<div class="text-center q-pa-md">
			<q-btn
				icon="arrow_back"
				label="Kembali"
				no-caps=""
				outline
				to="/user/canteen"
			/>
		</div>
	</div>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { onMounted, ref } from 'vue';
import CurrencyInput from 'src/components/CurrencyInput.vue';
import apiDelete from 'src/api/api-delete';
import apiUpdate from 'src/api/api-update';
import apiPost from 'src/api/api-post';

const categoryMenu = ref('');
const selectedMenu = ref([]);
const menus = ref({});
const loading = ref(false);
const newMenu = ref({});

async function loadData() {
	const data = await apiGet({
		endPoint: 'member/canteen',
		loading,
	});
	menus.value = data.menus;
	selectedMenu.value = menus.value[categoryMenu.value] || [];
	// console.log('c', categoryMenu.value);
	// console.log('s', selectedMenu.value);
}

async function updateMenu(v) {
	const data = {
		name: v.name,
		price: v.price,
	};
	const upd = await apiUpdate({
		endPoint: `member/canteen-menus/${v.id}`,
		loading,
		data,
	});
	if (upd) await loadData();
}

async function deleteMenu(id) {
	const del = await apiDelete({
		endPoint: `member/canteen-menus/${id}`,
		rerender: false,
	});
	if (del) {
		await loadData();
	}
}

async function addMenu() {
	const data = {
		category: categoryMenu.value,
		name: newMenu.value.name,
		price: newMenu.value.price,
	};
	const add = await apiPost({
		endPoint: 'member/canteen-menus',
		loading,
		data,
	});
	if (add) {
		await loadData();
		newMenu.value.name = '';
		newMenu.value.price = null;
	}
}

onMounted(async () => {
	await loadData();
});
</script>
