<template lang="">
	<q-page class="q-pa-sm">
		<q-card style="">
			<q-toolbar class="bg-blue-grey-4">
				<q-toolbar-title class="text-center">
					Semua Warung
				</q-toolbar-title>
			</q-toolbar>
			<q-card-section class="q-pa-sm">
				<div v-if="loading" class="flex flex-center">
					<q-spinner-cube color="blue-grey-5" size="8em" />
				</div>
				<div v-else>
					<div v-if="canteens?.length > 0">
						<q-list separator bordered>
							<q-item
								v-for="(canteen, index) in canteens"
								:key="index"
								clickable
								v-ripple
								class=""
								:to="`/canteens/${canteen.id}`"
							>
								<q-item-section avatar class="">
									<q-toggle
										dense
										v-model="canteen.app"
										disable
										color="blue-grey"
									/>
								</q-item-section>
								<q-item-section>
									<q-item-label overline>
										{{ canteen.name }}
									</q-item-label>
									<q-item-label>
										{{ canteen.address }}
									</q-item-label>
									<q-item-label caption>
										{{ canteen.description }}
									</q-item-label>
								</q-item-section>
								<q-item-section thumbnail>
									<img
										style="object-fit: cover"
										class="q-mr-sm"
										:src="
											canteen.image
												? `${url}/${canteen.image}`
												: '/hero.jpg'
										"
									/>
								</q-item-section>
							</q-item>
						</q-list>
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
</script>
<style lang=""></style>
