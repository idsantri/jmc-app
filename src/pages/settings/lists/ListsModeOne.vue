<template lang="">
	<q-list>
		<div v-for="list in props.data" :key="list.id">
			<q-form @submit.prevent="$emit('updateList', list)">
				<q-item class="no-padding">
					<q-item-section>
						<q-input dense outlined v-model="list.val0" required>
						</q-input>
					</q-item-section>
					<q-item-section side class="no-padding q-ml-sm">
						<q-btn-group push>
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
						</q-btn-group>
					</q-item-section>
				</q-item>
			</q-form>
		</div>
		<div>
			<q-form @submit.prevent="$emit('addList', newList)">
				<q-item class="no-padding">
					<q-item-section>
						<q-input dense outlined v-model="newList.val0" required>
						</q-input>
					</q-item-section>
					<q-item-section side class="no-padding q-ml-sm">
						<q-btn-group push>
							<q-btn
								color="positive"
								glossy
								icon="save"
								type="submit"
							/>
							<q-btn color="grey" glossy icon="delete" disable />
						</q-btn-group>
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
</script>
<style lang=""></style>
