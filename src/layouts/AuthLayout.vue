<template>
	<q-layout>
		<q-page-container>
			<q-page>
				<q-card class="my-card q-pa-md bg-blue-grey-5 text-blue-grey-1">
					<q-card-section class="no-padding q-mb-md">
						<div class="flex flex-center">
							<q-img
								src="src/assets/logo1c.png"
								style="width: 100px"
							/>
						</div>
						<div class="container-title">
							<h1 class="title">{{ constanta.APP_NAME_1 }}</h1>
							<h2 class="text-subtitle1 text-center q-ma-none">
								{{ constanta.APP_NAME_2 }}
							</h2>
						</div>
						<q-separator dark />
						<h3 class="sub-title">{{ title }}</h3>
					</q-card-section>

					<q-card
						flat
						v-if="errors.length > 0"
						class="q-ma-xs"
						id="error"
					>
						<q-card-section
							class="q-pa-xs bg-blue-grey-2 text-negative"
						>
							<ul class="q-my-xs">
								<li
									v-for="(error, index) in errors"
									:key="index"
								>
									<span v-html="error"></span>
								</li>
							</ul>
						</q-card-section>
					</q-card>

					<q-card-section class="no-padding no-margin">
						<router-view
							@title="handleTitle"
							@errors="handleErrors"
						/>
					</q-card-section>
				</q-card>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script setup>
import constanta from 'src/config/constanta';
import { ref } from 'vue';

const title = ref('Autentikasi');
const handleTitle = (value) => (title.value = value);

const errors = ref([]);
const handleErrors = (value) => (errors.value = value);
</script>

<style scoped>
.title {
	font-size: 2em;
	margin: 0 auto;
	padding: 0;
	text-align: center;
	height: 40px;
	line-height: 40px;
}

.sub-title {
	font-size: 1.7em;
	margin: 0 auto;
	padding: 0;
	font-weight: 500;
	text-align: center;
	height: 30px;
	line-height: 30px;
	margin-top: 10px;
}

.my-card {
	margin: 2em auto;
	margin-top: 10vh;
	width: 400px;
	max-width: 95vw;
}

.container-title {
	margin-bottom: 10px;
}
</style>
