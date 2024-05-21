<template lang="">
	<q-page class="q-pa-sm">
		<q-card>
			<q-card-section class="bg-blue-grey-8 text-blue-grey-11 no-padding">
				<q-toolbar>
					<q-toolbar-title class=""> Warung Online </q-toolbar-title>
					<q-btn
						v-if="!canteen?.name"
						icon="add"
						label="Buat Warung"
						class="q-px-sm bg-blue-grey-11 text-blue-grey-10"
						dense
						no-caps
						@click="crudCanteen = true"
					/>
					<q-btn-dropdown
						v-else
						icon="edit"
						label="Edit Warung"
						class="q-px-sm bg-blue-grey-11 text-blue-grey-10"
						dense
						no-caps
					>
						<q-list>
							<q-item
								clickable
								v-close-popup
								to="/user/canteen/menus"
							>
								<q-item-section>
									<q-item-label>Daftar Menu</q-item-label>
								</q-item-section>
							</q-item>

							<q-item
								clickable
								v-close-popup
								@click="crudCanteen = true"
							>
								<q-item-section>
									<q-item-label>Data Warung</q-item-label>
								</q-item-section>
							</q-item>

							<q-item
								clickable
								v-close-popup
								@click="showUploadImage()"
							>
								<q-item-section>
									<q-item-label> Upload Gambar </q-item-label>
								</q-item-section>
							</q-item>
						</q-list>
					</q-btn-dropdown>
				</q-toolbar>
			</q-card-section>
			<q-card-section class="q-pa-sm">
				<div v-if="loading" class="flex flex-center">
					<q-spinner-cube color="blue-grey-5" size="8em" />
				</div>
				<div v-else>
					<div v-if="!canteen?.name">
						<div
							class="text-center q-pa-lg text-negative text-italic"
						>
							Anda Tidak memiliki Warung
						</div>
					</div>
					<div v-else>
						<hero-image
							:data="{
								image: canteen.image
									? `${url}/${canteen.image}`
									: '/hero.jpg',
								title: canteen.name,
								subTitle: canteen.address,
							}"
						/>
						<q-banner
							v-if="!canteen.approved_at"
							class="bg-blue-grey-10 text-blue-grey-11 text-center"
						>
							Warung Anda belum tayang. <br />Menunggu persetujuan
							dari Admin!
						</q-banner>
						<q-list
							class="q-mt-sm q-mx-auto"
							style="max-width: 500px"
						>
							<q-item
								class="shadow-2 full-width"
								style="border-radius: 5px"
								:disable="!canteen.approved_at"
								v-ripple
								clickable
								:to="`/warung/${canteen.id}`"
							>
								<q-item-section top thumbnail class="q-pa-sm">
									<img
										:src="
											canteen.image
												? `${url}/${canteen.image}`
												: '/hero.jpg'
										"
										style="object-fit: cover"
									/>
								</q-item-section>
								<q-item-section>
									<q-item-label>
										{{ canteen.name }}
									</q-item-label>
									<q-item-label caption>
										{{ canteen.description }}
									</q-item-label>
								</q-item-section>
							</q-item>
						</q-list>

						<q-btn
							no-caps
							class="full-width q-mt-sm"
							to="/user/canteen/invoices"
							label="Daftar Pesanan"
						/>

						<q-banner class="no-padding">
							<div
								class="text-center text-weight-medium text-h6 bg-blue-grey-2 text-blue-grey-10"
							>
								Daftar Menu
							</div>
						</q-banner>

						<div
							v-if="menus.length == 0"
							class="text-center q-pa-lg"
						>
							<div class="text-weight-medium">
								Tambahkan Menu:
							</div>
							<div class="text-italic">
								&rightarrow; Klik Edit Warung &rightarrow; Klik
								Daftar Menu
							</div>
						</div>

						<div v-else>
							<q-card
								class="q-my-sm"
								v-for="(item, index) in menus"
								:key="index"
							>
								<q-card-section
									class="text-bold q-pa-sm bg-blue-grey-11"
								>
									{{ index }}
								</q-card-section>
								<q-card-section class="q-pa-sm">
									<ul class="no-margin">
										<li
											v-for="(itm, ind) in item"
											:key="ind"
											class=""
										>
											{{ itm.name }} &mdash;
											<span class="text-italic">
												Rp{{
													digitSeparator(itm.price)
												}}
												/ {{ itm.unit }}
											</span>
										</li>
									</ul>
								</q-card-section>
							</q-card>
						</div>
					</div>
				</div>
			</q-card-section>
		</q-card>
		<q-dialog persistent="" v-model="crudCanteen">
			<MyCanteenCrud
				:data-input="canteen"
				@success-submit="loadData"
				@success-delete="loadData"
			/>
		</q-dialog>
		<image-uploader
			:show-uploader="showUploader"
			:url="urlImage"
			:width="800"
			:height="600"
			@update-uploader="updateUploader"
			@success-upload="successUpload"
		/>
	</q-page>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { onMounted, ref } from 'vue';
import MyCanteenCrud from './MyCanteenCrud.vue';
import ImageUploader from 'src/components/ImageUploader.vue';
import { digitSeparator } from 'src/utils/format-number';
import HeroImage from 'src/components/HeroImage.vue';

const canteen = ref({});
const crudCanteen = ref(false);
const loading = ref(false);
const url = ref('');
const showUploader = ref(false);
const urlImage = ref('');
const menus = ref({});
function updateUploader(value) {
	showUploader.value = value;
}

async function successUpload() {
	showUploader.value = false;
	await loadData();
}

function showUploadImage() {
	urlImage.value = '/member/canteen/image';
	showUploader.value = true;
}

async function loadData() {
	const data = await apiGet({
		endPoint: 'member/canteen',
		loading,
	});
	canteen.value = data.canteen;
	url.value = data.url;
	menus.value = data.category_menu;
	// console.log(menus.value);
}

onMounted(async () => {
	await loadData();
});
</script>
<style lang="scss" scoped></style>
