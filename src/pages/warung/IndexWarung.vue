<template>
	<q-page>
		<div class="">
			<q-parallax>
				<template v-slot:media>
					<img src="https://cdn.quasar.dev/img/parallax2.jpg" />
				</template>

				<template v-slot:content>
					<div class="full-width text-container">
						<div
							class="text-h4 text-white text-center text-blue-grey-10"
						>
							Warung Online
						</div>
						<div
							class="text-h6 text-blue-grey-10 text-weight-thin text-center"
						>
							Jurang Mangu Care
						</div>
					</div>
				</template>
			</q-parallax>
		</div>

		<QList class="row q-gutter-md justify-center q-pa-sm">
			<q-item
				class="shadow-2"
				style="max-width: 500px; border-radius: 5px"
				clickable
				v-ripple
			>
				<q-item-section top thumbnail class="q-pa-sm">
					<img src="https://cdn.quasar.dev/img/mountains.jpg" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Single line item</q-item-label>
					<q-item-label caption lines="4">
						Secondary line text. Lorem ipsum dolor sit amet,
						consectetur adipiscit elit. consectetur adipiscit elit.
						consectetur adipiscit elit. consectetur adipiscit elit.
						consectetur adipiscit elit. consectetur adipiscit elit.
						consectetur adipiscit elit. consectetur adipiscit elit.
						consectetur adipiscit elit. consectetur adipiscit elit.
						consectetur adipiscit elit. consectetur adipiscit elit.
						consectetur adipiscit elit. consectetur adipiscit elit.
						consectetur adipiscit elit. consectetur adipiscit elit.
						consectetur adipiscit elit. consectetur adipiscit elit.
						consectetur adipiscit elit. consectetur adipiscit elit.
					</q-item-label>
				</q-item-section>
			</q-item>
			<q-item
				class="shadow-2"
				style="max-width: 500px; border-radius: 5px"
				clickable
				v-ripple
			>
				<q-item-section top thumbnail class="q-pa-sm">
					<img src="https://cdn.quasar.dev/img/mountains.jpg" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Single line item</q-item-label>
					<q-item-label caption
						>Secondary line text. Lorem ipsum dolor sit amet,
						consectetur adipiscit elit.</q-item-label
					>
				</q-item-section>
			</q-item>
		</QList>
	</q-page>
</template>
<script setup>
import { QList } from 'quasar';
</script>
<style lang="scss" scoped>
.text-container {
	background-color: rgb(255 255 255 / 50%);
}
</style>
