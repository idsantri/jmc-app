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
			<q-banner v-if="category_menu.length == 0">
				<div
					class="text-center q-mx-auto text-negative text-weight-medium text-italic"
					style="max-width: 400px"
				>
					Tidak ada menu tersedia!
				</div>
			</q-banner>
			<div>
				<q-tabs v-model="tab" shrink>
					<q-tab
						v-for="(item, index) in category_menu"
						:key="index"
						:name="index"
						:label="index"
						no-caps
					/>
				</q-tabs>
				<q-tab-panels
					swipeable
					v-model="tab"
					animated
					class="q-mx-auto"
					style="max-width: 600px"
				>
					<q-tab-panel
						v-for="(item, index) in category_menu"
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
											Rp{{
												digitSeparator(i.price || 0)
											}}
											/ {{ i.unit }}
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
					<!-- <pre>{{ selectedMenus() }}</pre> -->
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
										{{ item.name }}
									</q-item-label>
									<q-item-label caption>
										{{ item.qty }} {{ item.unit }} x
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
												v-model="input.customer_name"
												required
											/>
											<q-input
												class="q-mt-sm"
												dense
												outlined
												label="Antar ke..."
												v-model="input.ship_to"
												required
											/>
											<q-input
												class="q-mt-sm"
												dense
												outlined
												label="Pesan untuk tanggal/jam"
												v-model="input.ship_on"
												type="datetime-local"
												required
											/>

											<q-select
												class="q-mt-sm"
												dense
												outlined
												label="Kurir"
												v-model="input.courier"
												:options="lists['kurir']"
												:loading="LoadingLists['kurir']"
												emit-value
												map-options
												behavior="menu"
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
import { onMounted, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeroImage from 'src/components/HeroImage.vue';
import { getLists } from 'src/api/api-get-lists';
import loadingStore from 'src/stores/loading-store';
import apiPost from 'src/api/api-post';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const canteen = ref({});
const category_menu = ref([]);
const url = ref('');
const owner = ref({});
const input = ref({});
const tab = ref('Makanan');
const lists = ref([]);
const LoadingLists = ref([]);
const { loadingMain } = toRefs(loadingStore());

async function loadData() {
	const data = await apiGet({
		endPoint: `canteens/${route.params.id}`,
		loading,
	});
	canteen.value = data.canteen;
	category_menu.value = data.category_menu;
	url.value = data.url;
	owner.value = data.owner;
	// console.log(data);
}

async function onSubmit() {
	const data = JSON.parse(JSON.stringify(input.value));
	data.canteen_id = canteen.value.id;
	data.orders = JSON.parse(JSON.stringify(selectedMenus()));

	const response = await apiPost({
		endPoint: 'canteens/invoices',
		data,
		loading: loadingMain,
	});

	if (!response) {
		return;
	}
	router.push('/invoices/' + response.invoice.id);
	// console.log(response);
	let message = 'Pesan \n';
	message += `an. ${data.customer_name} \n`;
	message += `untuk hari ${formatTanggalWaktu(data.ship_on)} \n`;
	let orders = '';
	data.orders.forEach((m) => {
		orders += `- ${m.name} (x ${m.qty} ${m.unit})\n`;
	});
	message += orders;
	message += data.courier ? `harap diantar oleh ${data.courier} \n` : '';
	message += data.courier
		? `ke ${data.ship_to}`
		: `harap diantar ke ${data.ship_to}`;

	// console.log(message);
	// console.log(owner.value);
	// return;
	const phoneNumber = owner.value.phone?.replace(/^0/, '62'); // Nomor telepon penerima
	const whatsAppLink = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(
		message
	)}`;
	// Buka tautan WhatsApp di tab baru
	window.open(whatsAppLink, '_blank');
}

onMounted(async () => {
	await loadData();
	await getLists({
		loading: LoadingLists,
		lists,
		sort: true,
		key: 'kurir',
	});
});

function selectedMenus() {
	let selected = [];
	for (const category in category_menu.value) {
		// Menambahkan items yang memiliki 'qty' lebih dari 0 ke array 'selected'
		selected.push(
			...category_menu.value[category]
				.filter((menu) => menu.qty && parseInt(menu.qty) > 0)
				.map((menu) => {
					return {
						category: menu.category,
						name: menu.name,
						price: menu.price,
						qty: menu.qty,
						unit: menu.unit,
					};
				})
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
</script>
<style lang="scss" scoped></style>
