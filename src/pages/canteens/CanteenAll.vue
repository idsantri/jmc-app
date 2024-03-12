<template lang="">
	<q-page class="q-pa-sm">
		<q-card style="">
			<q-toolbar class="bg-blue-grey-4">
				<q-toolbar-title class="text-center">
					Semua Warung
				</q-toolbar-title>
			</q-toolbar>
			<q-card-section class="no-padding">
				<div v-if="loading" class="flex flex-center">
					<q-spinner-cube color="blue-grey-5" size="8em" />
				</div>
				<div v-else>
					<div v-if="canteens?.length > 0">
						<div class="row flex items-start justify-center">
							<q-card
								v-for="(canteen, index) in canteens"
								:key="index"
								class="q-ma-sm"
								style="width: 400px"
							>
								<q-card-section class="q-pa-sm">
									<div class="flex justify-center">
										<q-img
											class="full-width"
											:src="
												canteen.image
													? `${url}/${canteen.image}`
													: 'https://loremflickr.com/200/100/food'
											"
										/>
									</div>
									<q-list class="q-pt-sm">
										<q-item class="no-padding">
											<q-item-section>
												<q-item-label
													class="text-center"
													overline
												>
													{{ canteen.name }}
												</q-item-label>
												<q-item-label
													lines="3"
													class="text-center"
												>
													{{ canteen.description }}
												</q-item-label>
												<q-item-label
													class="text-center"
													caption
												>
													{{ canteen.address }}
												</q-item-label>
											</q-item-section>
										</q-item>
									</q-list>
								</q-card-section>
								<q-card-actions class="bg-blue-grey-11">
									<q-toggle
										v-model="canteen.app"
										label="Disetujui"
										@click="approveCanteen(canteen)"
									/>
								</q-card-actions>
							</q-card>
						</div>
					</div>
					<div v-else class="text-center q-pa-lg">
						<div class="text-weight-medium">Belum Ada Warung</div>
					</div>
				</div>
			</q-card-section>
		</q-card>
	</q-page>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import apiUpdate from 'src/api/api-update';
import { onMounted, ref } from 'vue';

const canteens = ref([]);
const url = ref('');
const loading = ref(false);

async function loadData() {
	const data = await apiGet({ endPoint: 'canteens/all', loading });
	const c = data.canteens.map((c) => {
		return { ...c, app: c.approved_at ? true : false };
	});
	canteens.value = c;
	url.value = data.url;
}

onMounted(async () => {
	await loadData();
});

async function approveCanteen(item) {
	const status = item.app == true ? 'yes' : 'no';
	const upt = await apiUpdate({
		endPoint: `canteens/${item.id}/approve/${status}`,
	});
	if (!upt) {
		item.app = !item.app;
	}
}
</script>
<style lang=""></style>
