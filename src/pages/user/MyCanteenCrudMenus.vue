<template lang="">
	<q-card class="full-width" style="max-width: 425px">
		<q-form @submit.prevent="onSubmit">
			<q-card-section class="bg-blue-grey-7 text-blue-grey-11 q-pa-sm">
				<toolbar-form @emit-button="null" :button-setting="false">
					Input Menu
					<span class="text-bold">{{ input.canteen_name }}</span>
					&mdash;
					<em> {{ input.id ? 'edit' : 'baru' }}</em>
				</toolbar-form>
			</q-card-section>
			<q-card-section class="q-pa-sm">
				<q-select
					dense
					outlined
					label="Kategori"
					v-model="input.category"
					:options="lists['kategori-menu-warung']"
					:loading="LoadingLists['kategori-menu-warung']"
					emit-value
					map-options
					behavior="menu"
				>
					<template v-slot:after>
						<q-btn
							dense
							flat
							icon="settings"
							to="/settings/lists/kategori-menu-warung"
						/>
					</template>
				</q-select>

				<q-input
					class="q-mt-sm"
					label="Nama Menu"
					dense
					outlined
					v-model="input.name"
					required
				/>

				<CurrencyInput
					class="q-mt-sm"
					v-model="input.price"
					outlined
					dense
					label="Harga"
					required
				/>
				<q-select
					class="q-mt-sm"
					dense
					outlined
					label="Satuan"
					v-model="input.unit"
					:options="lists['satuan']"
					:loading="LoadingLists['satuan']"
					emit-value
					map-options
					behavior="menu"
				>
					<template v-slot:after>
						<q-btn
							dense
							flat
							icon="settings"
							to="/settings/lists/satuan"
						/>
					</template>
				</q-select>
			</q-card-section>
			<q-card-actions class="flex bg-blue-grey-6">
				<q-btn
					v-show="input.id"
					label="Hapus"
					class="bg-red text-red-1"
					no-caps=""
					@click="handleDelete"
				/>
				<q-space />
				<q-btn
					label="Tutup"
					v-close-popup
					class="bg-blue-grey-11"
					no-caps=""
					id="btn-close"
				/>
				<q-btn
					type="submit"
					label="Simpan"
					class="bg-blue-grey-10 text-blue-grey-11"
					no-caps=""
					icon="save"
				/>
			</q-card-actions>
		</q-form>
	</q-card>
</template>
<script setup>
import apiDelete from 'src/api/api-delete';
import { getLists } from 'src/api/api-get-lists';
import apiPost from 'src/api/api-post';
import apiUpdate from 'src/api/api-update';
import CurrencyInput from 'src/components/CurrencyInput.vue';
import ToolbarForm from 'src/components/ToolbarForm.vue';
import loadingStore from 'src/stores/loading-store';
import { onMounted, ref, toRefs } from 'vue';

const props = defineProps({
	dataInput: Object,
});
const emit = defineEmits(['successSubmit', 'successDelete']);

const { loadingMain } = toRefs(loadingStore());
const input = ref({});
const lists = ref([]);
const LoadingLists = ref([]);

onMounted(async () => {
	Object.assign(input.value, props.dataInput);
	// console.log(input.value);
	await getCategories();
	await getSatuan();
});

async function getCategories() {
	await getLists({
		loading: LoadingLists,
		lists,
		sort: true,
		key: 'kategori-menu-warung',
	});
}
async function getSatuan() {
	await getLists({
		loading: LoadingLists,
		lists,
		sort: true,
		key: 'satuan',
	});
}

const onSubmit = async () => {
	// console.log(input.value);
	const data = {
		category: input.value.category,
		name: input.value.name,
		price: input.value.price,
		unit: input.value.unit,
	};
	// console.log(data);
	// return;
	let response = null;
	if (input.value.id) {
		response = await apiUpdate({
			endPoint: `member/canteen-menus/${input.value.id}`,
			data,
			loading: loadingMain,
		});
	} else {
		response = await apiPost({
			endPoint: 'member/canteen-menus',
			data,
			loading: loadingMain,
		});
	}
	if (response) {
		emit('successSubmit');
	}
};

const handleDelete = async () => {
	const result = await apiDelete({
		endPoint: `member/canteen-menus/${input.value.id}`,
		loading: loadingMain,
	});
	if (result) {
		document.getElementById('btn-close').click();
		emit('successDelete');
	}
};
</script>
<style lang=""></style>
