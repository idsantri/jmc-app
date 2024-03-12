<template>
	<q-page>
		<hero-image
			:data="{
				image: '/hero.jpg',
				title: 'Warung Online',
				subTitle: 'Jurang Mangu Care',
			}"
		/>
		<q-spinner-cube
			v-if="loading"
			color="blue-grey-12"
			size="8em"
			class="flex q-ma-lg q-mx-auto"
		/>

		<q-list class="row q-gutter-md justify-center q-pa-sm">
			<q-item
				v-for="(item, index) in canteens"
				:key="index"
				class="shadow-2"
				style="width: 450px; border-radius: 5px"
				clickable
				v-ripple
				:to="`warung/${item.id}`"
			>
				<q-item-section thumbnail top class="q-px-sm">
					<img :src="`${url}/${item.image}`" />
				</q-item-section>
				<q-item-section top>
					<q-item-label>{{ item.name }}</q-item-label>
					<q-item-label caption>
						{{ item.description }}
					</q-item-label>
				</q-item-section>
			</q-item>
		</q-list>
		<!-- <pre>
			{{ loading }}
			{{ canteens }}
		</pre
		> -->
	</q-page>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { onMounted, ref } from 'vue';
import HeroImage from 'src/components/HeroImage.vue';
import { useRouter } from 'vue-router';

const canteens = ref([]);
const url = ref('');
const loading = ref(false);
const router = useRouter();

async function loadData() {
	const data = await apiGet({
		endPoint: 'canteens',
		loading,
	});
	canteens.value = data.canteens;
	url.value = data.url;
}

onMounted(async () => {
	await loadData();
	if (canteens.value.length == 0) {
		router.push('/user/account');
	}
});
</script>

<style lang="scss" scoped></style>
