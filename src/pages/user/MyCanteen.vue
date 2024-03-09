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
								@click="showUploadImage('lg')"
							>
								<q-item-section>
									<q-item-label>
										Upload Gambar Besar
									</q-item-label>
								</q-item-section>
							</q-item>

							<q-item
								clickable
								v-close-popup
								@click="showUploadImage('sm')"
							>
								<q-item-section>
									<q-item-label>
										Upload Gambar Kecil
									</q-item-label>
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
						<q-parallax>
							<template v-slot:media>
								<img
									:src="
										canteen.image_lg
											? `${url}/${canteen.image_lg}`
											: 'https://loremflickr.com/1000/500/food'
									"
								/>
							</template>
							<!-- src="https://picsum.photos/1000/500?store" -->

							<template v-slot:content>
								<div class="full-width text-container">
									<div
										class="text-h4 text-white text-center text-blue-grey-10 text-title"
									>
										{{ canteen.name }}
									</div>
									<div
										class="text-h6 text-black text-weight-thin text-center"
									>
										{{ canteen.address }}
									</div>
								</div>
							</template>
						</q-parallax>
						<q-banner
							v-if="!canteen.approved_at"
							class="bg-blue-grey-10 text-blue-grey-11 text-center"
						>
							Warung Anda belum tayang. <br />Menunggu persetujuan
							dari Admin!
						</q-banner>
						<q-list class="flex flex-center q-mt-sm">
							<q-item
								class="shadow-2 full-width"
								style="max-width: 500px; border-radius: 5px"
								:disable="!canteen.approved_at"
								v-ripple
								clickable
								:to="`/warung/${canteen.id}`"
							>
								<q-item-section top thumbnail class="q-pa-sm">
									<img
										:src="
											canteen.image_sm
												? `${url}/${canteen.image_sm}`
												: 'https://loremflickr.com/100/50/food'
										"
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
					</div>
				</div>
			</q-card-section>
			<q-card-section class="no-padding" v-if="canteen?.name">
				<q-banner class="q-pa-sm">
					<div
						class="text-center text-weight-medium text-h6 bg-blue-grey-2 text-blue-grey-10"
					>
						Daftar Menu
					</div>
				</q-banner>
				<div class="row justify-center">
					<div v-if="menus?.length > 0">
						<div
							v-for="(item, index) in menus"
							:key="index"
							class="full-width"
							style="max-width: 500px"
						>
							<q-card class="q-ma-sm">
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
											</span>
										</li>
									</ul>
								</q-card-section>
							</q-card>
						</div>
					</div>
					<div v-else class="text-center q-pa-lg">
						<div class="text-weight-medium">Tambahkan Menu:</div>
						<div class="text-italic">
							&rightarrow; Klik Edit Warung &rightarrow; Klik
							Daftar Menu
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
			:width="Number(widthImage)"
			:height="Number(heightImage)"
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

const canteen = ref({});
const crudCanteen = ref(false);
const loading = ref(false);
const url = ref('');
const showUploader = ref(false);
const urlImage = ref('');
const widthImage = ref('');
const heightImage = ref('');
const menus = ref({});
function updateUploader(value) {
	showUploader.value = value;
}

async function successUpload() {
	showUploader.value = false;
	await loadData();
}

function showUploadImage(size) {
	// console.log(size);
	urlImage.value = `/member/canteen/image?size=${size}`;
	if (size == 'sm') {
		widthImage.value = 100;
		heightImage.value = 50;
	} else {
		widthImage.value = 1000;
		heightImage.value = 500;
	}
	showUploader.value = true;
}

async function loadData() {
	const data = await apiGet({
		endPoint: 'member/canteen',
		loading,
	});
	canteen.value = data.canteen;
	url.value = data.url;
	menus.value = data.menus;
	// console.log(data);
}

onMounted(async () => {
	await loadData();
});
</script>
<style lang="scss" scoped>
.text-container {
	background-color: rgb(255 255 255 / 50%);
}

.text-title {
	text-shadow: -1px -1px 3px #eceff1, 1px -1px 3px #eceff1,
		-1px 1px 3px #eceff1, 1px 1px 3px #eceff1;
}
</style>
