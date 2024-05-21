<template lang="">
	<q-page class="q-pa-sm">
		<q-card>
			<q-card-section class="bg-blue-grey-11 q-pa-sm flex">
				<div>
					<div class="text-subtitle1">Data Pesanan</div>
					<div class="text-subtitle2">
						{{ invoice.canteen_name }}
					</div>
				</div>
				<q-space />
				<q-btn
					outline
					dense
					label="Kembali"
					no-caps
					class="q-px-md"
					icon="arrow_back"
					@click="$router.go(-1)"
				/>
			</q-card-section>
			<q-card-section class="q-pa-sm">
				<q-markup-table bordered flat>
					<tbody>
						<tr>
							<td>Atas Nama</td>
							<td>{{ invoice.customer_name }}</td>
						</tr>
						<tr>
							<td>Kurir</td>
							<td>{{ invoice.courier }}</td>
						</tr>
						<tr>
							<td>Antar ke</td>
							<td>{{ invoice.ship_to }}</td>
						</tr>
						<tr>
							<td>Tanggal</td>
							<td>{{ formatDateFullDay(invoice.ship_on) }}</td>
						</tr>
						<tr>
							<td>Jam</td>
							<td>
								{{ getTime(invoice.ship_on) }}
							</td>
						</tr>
					</tbody>
				</q-markup-table>
			</q-card-section>
			<q-card-section class="q-pa-sm">
				<!-- <div class="text-subtitle2">Data Pesanan</div> -->
				<q-list bordered separator>
					<q-item v-for="(item, index) in orders" :key="index">
						<q-item-section>
							<q-item-label overline>
								{{ item.name }}
								<span class="text-caption">
									/ {{ item.unit }}
								</span>
							</q-item-label>
							<q-item-label class="flex">
								Rp{{ digitSeparator(item.price) }} x
								{{ item.qty }}
								<q-space />
								Rp{{
									digitSeparator(
										parseInt(item.qty) *
											parseInt(item.price)
									)
								}}
							</q-item-label>
							<!-- <q-item-label caption>Caption</q-item-label> -->
						</q-item-section>
					</q-item>
					<q-item>
						<q-item-section>
							<q-item-label class="text-right">
								Total:
								<span class="text-bold">
									Rp{{
										digitSeparator(
											orders.reduce((total, item) => {
												return (
													total +
													parseInt(item.price) *
														parseInt(item.qty)
												);
											}, 0)
										)
									}}
								</span>
							</q-item-label>
						</q-item-section>
					</q-item>
				</q-list>
			</q-card-section>
		</q-card>
		<!-- <pre>{{ invoice }}</pre> -->
		<!-- <pre>{{ orders }}</pre> -->
	</q-page>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import loadingStore from 'src/stores/loading-store';
import { formatDateFullDay } from 'src/utils/format-date';
import { digitSeparator } from 'src/utils/format-number';
import { onMounted, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { loadingMain } = toRefs(loadingStore());
const invoice = ref({});
const orders = ref([]);

async function loadData() {
	const data = await apiGet({
		endPoint: `canteens/invoices/${route.params.id}`,
		loading: loadingMain,
	});
	invoice.value = data.invoice;
	orders.value = data.orders;
}

onMounted(async () => {
	await loadData();
});

function getTime(dateTime) {
	const date = new Date(dateTime);
	return (
		date.getHours().toString().padStart(2, '0') +
		':' +
		date.getMinutes().toString().padStart(2, '0')
	);
}
</script>
<style lang=""></style>
