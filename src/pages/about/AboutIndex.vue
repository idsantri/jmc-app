import { resolveDirective } from 'vue'; import { resolveDirective } from 'vue';
<template>
	<q-page class="q-pa-sm">
		<q-card>
			<q-card-section>
				<div class="text-subtitle1">Tentang Aplikasi</div>
				<div class="text-body1">
					{{ app.APP_NAME_1 }} ({{ app.APP_NAME_2 }})
				</div>
			</q-card-section>
			<q-card-section class="q-pt-none">
				<div
					v-for="(item, index) in releases"
					:key="index"
					class="q-mb-sm"
				>
					<q-list bordered separator>
						<q-item-label header class="bg-blue-grey-1 q-pa-sm"
							>Versi {{ item.ver }}
							<span class="text-caption">
								({{ item.date }})
							</span>
						</q-item-label>

						<q-item
							v-for="(item, index) in item.release"
							:key="index"
						>
							<q-item-section>
								<q-item-label>{{ index }}</q-item-label>
								<q-item-label caption>
									<q-list v-for="(it, id) in item" :key="id">
										<q-item-label>{{
											'- ' + it
										}}</q-item-label>
									</q-list>
								</q-item-label>
							</q-item-section>
						</q-item>
					</q-list>
				</div>
			</q-card-section>
		</q-card>
	</q-page>
</template>
<script setup>
import app from 'src/config/constanta';
const releases = [
	{
		ver: '1.1.0',
		date: 'Maret 2024',
		release: {
			Fitur: ['Warung Online (Upgrade)'],
			'Fixed Bugs': ['Beberapa perbaikan kecil'],
		},
	},
	{
		ver: '1.0.0',
		date: 'Maret 2024',
		release: {
			Fitur: ['Simpan Pinjam (Tabungan)'],
			Hosting: ['Mandiri'],
			Domain: ['Mandiri'],
		},
	},
];
</script>

<style scoped></style>
