<template lang="">
	<q-list separator bordered>
		<div v-for="(list, index) in props.data" :key="list.id">
			<q-form @submit.prevent="$emit('updateList', list)">
				<q-item
					:class="
						index % 2 == 0 ? 'q-pa-sm' : 'q-pa-sm bg-blue-grey-1'
					"
				>
					<q-item-section class="q-gutter-sm q-mr-sm">
						<q-input dense outlined v-model="list.val0" required />
						<q-input dense outlined v-model="list.val1" required />
					</q-item-section>
					<q-item-section side class="q-gutter-sm no-padding">
						<q-btn
							color="positive"
							glossy
							icon="save"
							type="submit"
						/>
						<q-btn
							color="negative"
							glossy
							icon="delete"
							@click="$emit('deleteList', list)"
						/>
					</q-item-section>
				</q-item>
			</q-form>
		</div>
		<div>
			<q-form @submit.prevent="$emit('addList', newList)">
				<q-item
					class="q-pa-sm"
					:class="props.data.length % 2 == 0 ? '' : 'bg-blue-grey-1'"
				>
					<q-item-section class="q-gutter-sm q-mr-sm">
						<q-input
							dense
							outlined
							v-model="newList.val0"
							required
						/>
						<q-input
							dense
							outlined
							v-model="newList.val1"
							required
						/>
					</q-item-section>
					<q-item-section side class="q-gutter-sm no-padding">
						<q-btn
							type="submit"
							color="positive"
							glossy
							icon="save"
						/>
						<q-btn color="grey" glossy icon="delete" disable />
					</q-item-section>
				</q-item>
			</q-form>
		</div>
	</q-list>
	<!-- <pre>{{ props.data }}</pre> -->
</template>
<script setup>
import { ref } from 'vue';

const newList = ref({});
const props = defineProps({
	data: {
		type: Array,
		required: true,
	},
});

/**
 * TODO:
 * validasi input
 */
</script>
<style lang=""></style>
