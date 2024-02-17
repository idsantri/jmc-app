<template lang="">
	<q-card>
		<q-card-section class="q-px-sm q-py-sm bg-green-11">
			<q-toolbar class="no-padding" style="min-height: 0">
				<q-toolbar-title class="text-subtitle1">
					<div class="text-subtitle2 text-weight-bold">
						Filter Tanggal
					</div>
				</q-toolbar-title>
				<slot></slot>
			</q-toolbar>
		</q-card-section>
		<q-card-section class="no-padding">
			<div class="row" style="max-width: 1000px; width: 100%">
				<q-input
					class="col-12 col-md-3 q-pa-sm"
					outlined
					dense
					label="Tanggal Awal"
					v-model="startDate"
					:rules="['date']"
					type="date"
				>
				</q-input>
				<q-input
					class="col-12 col-md-3 q-pa-sm"
					outlined
					dense
					label="Tanggal Akhir"
					v-model="endDate"
					:rules="['date']"
					type="date"
				>
				</q-input>
			</div>
		</q-card-section>
	</q-card>
</template>
<script setup>
import { formatDateFull } from 'src/utils/format-date';
import { notifyWarning } from 'src/utils/notify';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
	startUrl: String,
});
const emit = defineEmits(['dataFilter']);

const route = useRoute();
const router = useRouter();
const params = {
	startDate: route.params.startDate || 0,
	endDate: route.params.endDate || 0,
};

const startDate = ref(params.startDate);
const endDate = ref(params.endDate);

const loading = ref([]);
const lists = ref([]);

onMounted(async () => {
	sendEmit();
});

function sendEmit() {
	const display = () => {
		let text = '';
		if (startDate.value)
			text +=
				' ➡️ <em>dari tanggal:</em> <strong>' +
				formatDateFull(startDate.value) +
				'</strong>';
		if (endDate.value)
			text +=
				' ➡️ <em>sampai tanggal:</em> <strong>' +
				formatDateFull(endDate.value) +
				'</strong>';

		return (
			text ||
			'<div class="text-green-13 text-italic">Tentukan filter!</div>'
		);
	};

	const data = {
		startDate: startDate.value || '',
		endDate: endDate.value || '',
		display: display(),
	};

	emit('dataFilter', data);
}

watch(startDate, (newValue, oldValue) => {
	if (newValue > endDate.value) {
		notifyWarning('Tanggal awal haruslah lebih kecil');
		return;
	}
	if (newValue != oldValue) {
		router.push(`${props.startUrl}/${newValue || 0}/${endDate.value}`);
		return;
	}
});

watch(endDate, (newValue, oldValue) => {
	if (startDate.value > newValue) {
		notifyWarning('Tanggal akhir haruslah lebih besar');
		return;
	}

	if (newValue != oldValue) {
		router.push(`${props.startUrl}/${startDate.value}/${newValue || 0}`);
		return;
	}
});
</script>
<style lang=""></style>
