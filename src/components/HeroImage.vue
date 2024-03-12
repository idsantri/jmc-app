<template lang="">
	<q-parallax>
		<template v-slot:media>
			<img :src="props.data.image" />
		</template>

		<template v-slot:content>
			<div class="full-width text-container">
				<div
					class="text-h4 text-white text-center text-blue-grey-10 text-title"
				>
					{{ props.data.title }}
				</div>
				<div
					class="text-h6 text-blue-grey-10 text-weight-thin text-center"
				>
					{{ props.data.subTitle }}
				</div>
			</div>
		</template>
	</q-parallax>
</template>
<script setup>
const props = defineProps({
	data: { type: Object },
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
