<template>
	<q-list class="text-blue-grey-1">
		<!-- HOME -->
		<!-- <q-item clickable v-ripple to="/profile">
			<q-item-section avatar>
				<q-icon color="blue-grey-1" name="home" />
			</q-item-section>
			<q-item-section>
				<q-item-label overline>Akun Saya</q-item-label>
				<q-item-label caption>Profil, Simpanan, dll...</q-item-label>
			</q-item-section>
		</q-item>
		<q-separator /> -->

		<!-- Kelompok -->
		<!-- <q-item clickable v-ripple to="/groups">
			<q-item-section avatar>
				<q-icon color="blue-grey-1" name="people" />
			</q-item-section>
			<q-item-section>
				<q-item-label>Kelompok</q-item-label>
			</q-item-section>
		</q-item> -->

		<!-- ADMIN -->
		<q-expansion-item
			expand-separator
			label="Admin"
			caption="Menu Admin"
			header-class="text-overline"
			expand-icon-class="text-blue-grey-1"
			default-opened
		>
			<q-item clickable v-ripple to="/members">
				<q-item-section avatar>
					<q-icon color="blue-grey-1" name="people" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Data Anggota</q-item-label>
					<!-- <q-item-label caption>Data Anggota</q-item-label> -->
				</q-item-section>
			</q-item>
		</q-expansion-item>
	</q-list>
</template>

<script setup lang="ts"></script>
