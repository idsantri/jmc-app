<template>
	<div class="q-ma-sm" style="max-width: 600px">
		<q-card>
			<q-card-section class="q-pa-sm">
				<q-select
					dense
					outlined
					label="Pilih List"
					v-model="listModel"
					:options="listData"
					emit-value
					map-options
					@update:model-value="(v) => routerPush(v)"
					behavior="menu"
				/>
			</q-card-section>
		</q-card>
		<q-card class="q-mt-sm" v-if="listModel">
			<q-card-section
				class="bg-blue-grey-8 text-blue-grey-1 text-subtitle1 q-pa-sm flex flex-center"
			>
				List {{ listModel.label }}
				<q-space />
				<q-btn flat="" icon="cached" @click="keyReload++" />
			</q-card-section>
			<q-card-section class="q-pa-sm" :key="keyReload">
				<router-view :key="$route.fullPath" />
				<!-- <suspense>
					<template #default>
						<router-view :key="$route.fullPath" />
					</template>
					<template #fallback> loading... </template>
				</suspense> -->
			</q-card-section>
		</q-card>
	</div>

	<!-- <pre>list model:{{ listModel }}</pre> -->
	<!-- <pre>list data:{{ listData }}</pre> -->
</template>
<script setup>
import { ref } from 'vue';
import listData from './lists-data';
import { useRoute, useRouter } from 'vue-router';

const keyReload = ref(0);
const router = useRouter();
const route = useRoute();

const listKey = route.params.listKey;
const listModel = ref(listData.find(({ url }) => url == listKey));

function routerPush(list) {
	router.push(`/settings/lists/${list.url}`);
}
</script>
