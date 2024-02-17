<template lang="">
	<q-toolbar class="q-px-sm" style="min-height: 0">
		<q-toolbar-title class="text-subtitle1">
			<slot></slot>
		</q-toolbar-title>
		<q-btn
			v-if="props.buttonSetting"
			flat
			round
			dense
			icon="settings"
			@click="buttonSettingClick"
		/>
	</q-toolbar>
</template>
<script setup>
import { useRouter } from 'vue-router';

const emit = defineEmits(['emitButton']);
const props = defineProps({
	buttonSetting: {
		type: Boolean,
		default: true,
	},
});

const router = useRouter();
function buttonSettingClick() {
	emit('emitButton');
	router.push('/settings/lists');
}
</script>
<style lang=""></style>
