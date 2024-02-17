<template lang="">
	<q-select
		class="q-mt-sm"
		dense
		hint="Kota kelahiran"
		outlined
		label="Tempat Lahir"
		v-model="input.tmp_lahir"
		:options="options"
		emit-value
		map-options
		error-color="negative"
		:loading="loading"
		input-debounce="100"
		use-input
		clearable=""
		new-value-mode="add"
		@filter="filterFunction"
		@update:model-value="onInput"
		behavior="menu"
	/>
	<!-- <pre>{{ input }}</pre> -->
</template>
<script setup>
/**
 * @example
 * <input-select-kota-lahir
 * @emit-input="(val) => Object.assign(input, val)"
 * :tmp_lahir="input" />
 */

import getData from 'src/api/api-get';
import { onMounted, ref } from 'vue';

const props = defineProps({
	data: { type: Object },
});
const emit = defineEmits(['emitInput']);

const input = ref({});
const options = ref([]);
const loading = ref(false);

function onInput(val) {
	// console.log(val);
	// console.log(input.value);
	// emit('emitInput', val);
	emit('emitInput', input.value);
}

onMounted(async () => {
	// console.log('props', props.tmp_lahir);
	Object.assign(input.value, props.data);
	// console.log('input', input.value);
});

async function filterFunction(val, update) {
	if (!val) {
		update(() => {
			options.value = [];
		});
		return;
	}
	const data = await getData({
		endPoint: 'alamat/kabupaten-kota',
		loading,
		params: {
			q: val,
		},
	});
	// console.log(data);
	update(
		() => (options.value = data.kabupaten_kota),
		(menuRef) => {
			if (val !== '' && menuRef.options.length) {
				menuRef.setOptionIndex(-1);
				menuRef.moveOptionSelection(1, true);
			}
		}
	);
}
</script>
<style lang=""></style>
