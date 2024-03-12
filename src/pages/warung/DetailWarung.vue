<template lang="">
	<q-page>
		<hero-image
			:data="{
				image: canteen.image ? `${url}/${canteen.image}` : '/hero.jpg',
				title: canteen.name,
				subTitle: canteen.address,
			}"
		/>
		<q-spinner-cube
			v-if="loading"
			color="blue-grey-12"
			size="8em"
			class="flex q-ma-lg q-mx-auto"
		/>
		<div v-else>
			<q-banner class="bg-blue-grey-2">
				<div
					class="text-center q-mx-auto text-blue-grey-10"
					style="max-width: 400px"
				>
					{{ canteen.description }}
				</div>
			</q-banner>
			<div>
				<q-tabs v-model="menu" shrink>
					<q-tab
						v-for="(item, index) in menus"
						:key="index"
						:name="index"
						:label="index"
						no-caps
					/>
				</q-tabs>
				<q-tab-panels
					swipeable
					v-model="menu"
					animated
					class="q-mx-auto"
					style="max-width: 600px"
				>
					<q-tab-panel
						v-for="(item, index) in menus"
						:key="index"
						:name="index"
						class="q-pa-sm q-mx-auto"
					>
						<q-list class="text-left">
							<q-item v-for="(i, x) in item" :key="x">
								<q-item-section>
									<q-item-label class="flex items-center">
										{{ i.name }}
										<q-space />
										<span class="text-right q-mr-md">
											Rp{{ digitSeparator(i.price || 0) }}
										</span>
										<q-input
											style="width: 50px"
											dense
											type="number"
											outlined
											label="Qty"
											v-model="i.qty"
										/>
									</q-item-label>
								</q-item-section>
							</q-item>
						</q-list>
					</q-tab-panel>
				</q-tab-panels>
			</div>

			<!-- selected menu -->
			<q-card class="q-mt-sm q-mx-auto" style="max-width: 600px">
				<q-card-section
					class="q-pa-sm bg-blue-grey-10 text-blue-grey-11 text-center"
				>
					Pesanan Saya
				</q-card-section>
				<q-card-section class="q-pa-sm">
					<div
						v-if="selectedMenus().length == 0"
						class="q-pa-lg q-px-sm text-center"
					>
						Anda belum menentukan pesanan!
					</div>
					<div v-else>
						<q-list bordered separator>
							<q-item
								v-for="(item, index) in selectedMenus()"
								:key="index"
							>
								<q-item-section>
									<q-item-label>
										{{ item.name }}</q-item-label
									>
									<q-item-label caption>
										{{ item.qty }} x
										{{ digitSeparator(item.price || 0) }}
									</q-item-label>
								</q-item-section>
								<q-item-section side>
									<q-item-label class="text-weight-medium">
										Rp{{
											digitSeparator(
												item.qty * item.price
											)
										}}
									</q-item-label>
								</q-item-section>
							</q-item>
							<q-item class="bg-blue-grey-11">
								<q-item-section>
									<q-item-label
										class="text-blue-grey-10 text-weight-medium"
									>
										Total
									</q-item-label>
								</q-item-section>
								<q-item-section side>
									<q-item-label
										class="text-weight-medium text-blue-grey-10"
									>
										Rp{{
											digitSeparator(
												selectedMenus().reduce(
													(total, item) => {
														return (
															total +
															item.price *
																parseInt(
																	item.qty
																)
														);
													},
													0
												)
											)
										}}
									</q-item-label>
								</q-item-section>
							</q-item>

							<q-item class="q-pa-sm">
								<q-item-section>
									<q-form @submit.prevent="onSubmit">
										<q-item-label
											class="text-blue-grey-10 text-weight-medium"
										>
											<q-input
												class=""
												dense
												outlined
												label="Atas Nama"
												v-model="input.an"
												required
											/>
											<q-input
												class="q-mt-sm"
												dense
												outlined
												label="Antar ke..."
												v-model="input.antar"
												required
											/>
											<q-input
												class="q-mt-sm"
												dense
												outlined
												label="Pesan untuk tanggal/jam"
												v-model="input.waktu"
												type="datetime-local"
												required
											/>
										</q-item-label>
										<q-item-label>
											<div
												v-if="owner.phone"
												class="flex"
											>
												<q-space />
												<q-btn
													type="submit"
													label="Pesan"
													no-caps
													dense
													class="q-ma-sm q-px-lg bg-blue-grey-10 text-blue-grey-1"
												/>
											</div>
											<div
												v-else
												class="text-center q-pa-md text-negative bg-blue-grey-11"
											>
												Pemilik tidak memasang nomor
												telepon!
											</div>
										</q-item-label>
									</q-form>
								</q-item-section>
							</q-item>
						</q-list>
					</div>
				</q-card-section>
			</q-card>
		</div>
	</q-page>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { digitSeparator } from 'src/utils/format-number';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import HeroImage from 'src/components/HeroImage.vue';

const route = useRoute();
const loading = ref(false);
const canteen = ref({});
const menus = ref([]);
const url = ref('');
const owner = ref({});
const input = ref({});
const menu = ref('Makanan');

async function loadData() {
	const data = await apiGet({
		endPoint: `canteens/${route.params.id}`,
		loading,
	});
	canteen.value = data.canteen;
	menus.value = data.menus;
	url.value = data.url;
	owner.value = data.owner;
}

function onSubmit() {
	// console.log(selectedMenus());
	// console.log(input.value);
	let message = 'Pesan \n';
	message += `an. ${input.value.an} \n`;
	message += `untuk hari ${formatTanggalWaktu(input.value.waktu)} \n`;
	let menus = '';
	selectedMenus().forEach((m) => {
		menus += `- ${m.name} (x${m.qty}) \n`;
	});
	message += menus;
	message += `antar ke ${input.value.antar}`;
	// console.log(message);
	// console.log(owner.value);

	const phoneNumber = owner.value.phone?.replace(/^0/, '62'); // Nomor telepon penerima
	const whatsappLink = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(
		message
	)}`;
	// Buka tautan WhatsApp di tab baru
	window.open(whatsappLink, '_blank');
}
onMounted(async () => {
	await loadData();
});

function selectedMenus() {
	let selected = [];
	for (const category in menus.value) {
		// Menambahkan items yang memiliki 'qty' lebih dari 0 ke array 'selected'
		selected.push(
			...menus.value[category].filter(
				(item) => item.qty && parseInt(item.qty) > 0
			)
		);
	}
	return selected;
}

function formatTanggalWaktu(input) {
	// Membuat objek Date dari input
	const tanggal = new Date(input);

	// Opsi untuk format tanggal dalam bahasa Indonesia
	const options = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		timeZoneName: 'short',
		hour12: false,
	};
	return tanggal.toLocaleDateString('id-ID', options);
}

// function selectedMenus2() {
// 	let selected = {};
// 	for (const category in menus.value) {
// 		// Filter items yang memiliki 'qty' lebih dari 0
// 		const itemsWithQty = menus.value[category].filter(
// 			(item) => item.qty && parseInt(item.qty) > 0
// 		);

// 		// Jika kategori memiliki item, tambahkan ke objek 'selected'
// 		if (itemsWithQty.length > 0) {
// 			selected[category] = itemsWithQty;
// 		}
// 	}
// 	return selected;
// }
</script>
<style lang="scss" scoped></style>
