<template lang="">
	<q-page class="q-pa-sm">
		<q-card class="">
			<q-card-section class="q-pa-sm">
				<q-img
					class="full-width"
					:src="
						canteen.image ? `${url}/${canteen.image}` : '/hero.jpg'
					"
				/>
			</q-card-section>
			<q-card-section v-if="loading" class="flex flex-center">
				<q-spinner-cube color="blue-grey-5" size="8em" />
			</q-card-section>
			<q-card-section v-else class="q-pa-sm">
				<div class="text-center text-subtitle1">
					{{ canteen.name }}
				</div>
				<div class="text-center text-subtitle2">
					{{ canteen.address }}
				</div>
				<div class="text-center text-caption">
					{{ canteen.description }}
				</div>
			</q-card-section>
			<q-card-actions class="bg-blue-grey-11 flex">
				<q-toggle
					v-model="approved"
					label="Disetujui"
					@click="approveCanteen"
				/>
				<q-space />
				<q-btn
					icon="info"
					outline
					round
					dense
					class="text-blue-grey-11 bg-blue-grey-14"
					glossy
					:to="`/warung/${canteen.id}`"
				/>
			</q-card-actions>
			<q-card-section class="no-padding">
				<q-tabs
					v-model="tab"
					no-caps
					class="bg-blue-grey-7 text-white shadow-2"
				>
					<q-route-tab
						label="Menu"
						name="menus"
						:to="`/canteens/${route.params.id}/menus`"
					/>
					<q-route-tab
						label="Pesanan"
						name="invoices"
						:to="`/canteens/${route.params.id}/invoices`"
					/>
				</q-tabs>
				<div class="q-pa-sm">
					<!-- swipe tak jalan -->
					<!-- <router-view /> -->
					<suspense>
						<template #default>
							<router-view />
						</template>
						<template #fallback>
							<q-spinner-cube
								color="green-12"
								size="8em"
								class="flex q-mx-auto"
							/>
						</template>
					</suspense>
				</div>
			</q-card-section>
		</q-card>
	</q-page>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import apiUpdate from 'src/api/api-update';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const canteen = ref({});
const url = ref('');
const route = useRoute();
const approved = ref(false);
const tab = ref('menus');
const loading = ref(false);
async function loadData() {
	const data = await apiGet({
		endPoint: `canteens/${route.params.id}`,
		loading: loading,
	});
	canteen.value = data.canteen;
	url.value = data.url;
}

onMounted(async () => {
	await loadData();
	approved.value = canteen.value.approved_at ? true : false;
});

async function approveCanteen() {
	const status = approved.value == true ? 'yes' : 'no';
	const upt = await apiUpdate({
		endPoint: `canteens/${canteen.value.id}/approve/${status}`,
	});
	if (!upt) {
		approved.value = !approved.value;
	}
}
</script>
<style lang=""></style>
