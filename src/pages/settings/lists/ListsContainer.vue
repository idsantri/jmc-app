<template>
	<div v-if="spinner">
		<q-spinner-cube
			color="blue-grey-12"
			size="8em"
			class="flex q-mx-auto"
		/>
	</div>
	<div v-else>
		<div v-if="selected.mode == 'one'">
			<ListsModeOne
				:data="listGet"
				@update-list="handleUpdate"
				@delete-list="handleDelete"
				@add-list="handleAdd"
			/>
		</div>
		<div v-if="selected.mode == 'two'">
			<ListsModeTwo
				:data="listGet"
				@update-list="handleUpdate"
				@delete-list="handleDelete"
				@add-list="handleAdd"
			/>
		</div>
	</div>

	<!-- <pre>list key{{ listKey }}</pre>
	<pre>list key{{ selected }}</pre> -->
</template>
<script setup>
import { useRoute } from 'vue-router';
import listData from './lists-data';
import { onMounted, ref } from 'vue';
import { kebabToSnakeCase } from 'src/utils/format-text';

import ListsModeOne from 'src/pages/settings/lists/ListsModeOne.vue';
import ListsModeTwo from 'src/pages/settings/lists/ListsModeTwo.vue';

import apiGet from 'src/api/api-get.js';
import apiUpdate from 'src/api/api-update';
import apiDelete from 'src/api/api-delete';
import apiPost from 'src/api/api-post';
import { notifyError } from 'src/utils/notify';

const route = useRoute();
const listKey = route.params.listKey;
const selected = listData.find(({ url }) => url == listKey);
const spinner = ref(false);
const listGet = ref([]);
async function fetchData() {
	const data = await apiGet({
		endPoint: `lists/${selected.url}`,
		loading: spinner,
	});
	// console.log('e', err.value);
	const response = kebabToSnakeCase(selected.url);
	// console.log('r', response);
	listGet.value = data[response];
	// console.log('lg', listGet.value);
}

onMounted(async () => {
	await fetchData();
});

async function handleUpdate(list) {
	// console.log(list);
	const { key, val0, val1, val2, note, id } = list;
	if (!val0) {
		return notifyError('List tidak boleh kosong!');
	}
	const data = { key, val0, val1, val2, note };
	const upd = await apiUpdate({ endPoint: `lists/${id}`, data });
	if (upd) await fetchData();
}

async function handleDelete(list) {
	const del = await apiDelete({ endPoint: `lists/${list.id}` });
	if (del) fetchData();
}

async function handleAdd(list) {
	// console.log(list);
	// console.log(selected);
	const { val0, val1, val2, note } = list;
	if (!val0) {
		return notifyError('List tidak boleh kosong!');
	}
	const data = {
		key: selected.url,
		val0,
		val1: val1 || null,
		val2: val2 || null,
		note: note || null,
	};
	// console.log(data);

	const post = await apiPost({ endPoint: 'lists', data });
	if (post) {
		await fetchData();
	}
}
</script>
