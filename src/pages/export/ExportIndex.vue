<template lang="">
	<q-page class="q-pa-sm">
		<q-card style="max-width: 600px">
			<q-toolbar class="bg-blue-grey-4 text-subtitle1">
				Export Data (Excel)
				<q-space />
			</q-toolbar>
			<q-card-section class="q-pa-sm">
				<q-list separator bordered>
					<q-item>
						<q-item-section>
							<q-item-label>Data Anggota</q-item-label>
						</q-item-section>
						<q-item-section avatar>
							<q-btn icon="download" glossy />
						</q-item-section>
					</q-item>
					<q-item>
						<q-item-section>
							<q-item-label>Data Akun</q-item-label>
						</q-item-section>
						<q-item-section avatar>
							<q-btn icon="download" glossy />
						</q-item-section>
					</q-item>
					<q-expansion-item label="Transaksi">
						<q-card>
							<q-card-section class="q-py-sm">
								<q-input
									dense
									class="q-mt-sm"
									outlined
									label="Dari Tanggal"
									type="date"
								/>
								<q-input
									dense
									class="q-mt-sm"
									outlined
									label="Sampai Tanggal"
									type="date"
								/>
							</q-card-section>
							<q-card-actions align="right" class="q-px-md">
								<q-btn
									icon="download"
									label="Download"
									no-caps
									glossy
									class="q-px-md"
								/>
							</q-card-actions>
						</q-card>
					</q-expansion-item>
					<q-expansion-item label="Jurnal">
						<q-card>
							<q-card-section class="q-py-sm">
								<q-input
									dense
									class=""
									outlined
									label="ID | No. Rekening"
								/>
								<q-input
									dense
									class="q-mt-sm"
									outlined
									label="Dari Tanggal"
									type="date"
								/>
								<q-input
									dense
									class="q-mt-sm"
									outlined
									label="Sampai Tanggal"
									type="date"
								/>
							</q-card-section>
							<q-card-actions align="right" class="q-px-md">
								<q-btn
									icon="download"
									label="Download"
									no-caps
									glossy
									class="q-px-md"
								/>
							</q-card-actions>
						</q-card>
					</q-expansion-item>
				</q-list>
			</q-card-section>
		</q-card>
	</q-page>
</template>
<script setup></script>
<style lang=""></style>
