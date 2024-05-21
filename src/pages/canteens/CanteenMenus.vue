<template lang="">
	<div>
		<div v-if="loading" class="flex flex-center">
			<q-spinner-cube color="blue-grey-5" size="8em" />
		</div>
		<q-list v-else bordered separator>
			<q-item v-if="!menus?.length || menus?.length == 0">
				<q-item-section>
					<q-item-label overline class="text-negative text-center">
						Belum ada menu disediakan
					</q-item-label>
				</q-item-section>
			</q-item>
			<q-item v-else v-for="(menu, index) in menus" :key="index">
				<q-item-section>
					<q-item-label caption>
						{{ menu.category }}
					</q-item-label>
					<q-item-label overline>
						{{ menu.name }}
					</q-item-label>
					<q-item-label caption>
						Rp{{ digitSeparator(menu.price || 0) }} /
						{{ menu.unit }}
					</q-item-label>
				</q-item-section>
			</q-item>
		</q-list>
		<!-- <pre>
			{{ menus }}
		</pre
		> -->
	</div>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { digitSeparator } from 'src/utils/format-number';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const loading = ref(false);
const menus = ref([]);
async function loadData() {
	const data = await apiGet({
		endPoint: `canteens/${route.params.id}/menus`,
		loading: loading,
	});
	menus.value = data.menus;
}

onMounted(async () => {
	await loadData();
});
</script>
<style lang=""></style>
