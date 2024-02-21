<template>
	<q-list class="text-blue-grey-1">
		<!-- HOME -->
		<div class="flex flex-center q-my-md">
			<q-img src="src/assets/logo1c.png" style="width: 40%" />
		</div>
		<!-- <q-separator /> -->

		<q-expansion-item
			expand-separator
			label="Akun Saya"
			header-class="text-overline"
			expand-icon-class="text-blue-grey-1"
			default-opened
		>
			<q-item clickable v-ripple to="/my-account">
				<q-item-section avatar>
					<q-icon color="blue-grey-1" name="account_balance_wallet" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Tabungan</q-item-label>
				</q-item-section>
			</q-item>
			<q-item clickable v-ripple to="/my-account/pengajuan">
				<q-item-section avatar>
					<q-icon color="blue-grey-1" name="request_quote" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Pengajuan</q-item-label>
				</q-item-section>
			</q-item>
		</q-expansion-item>
		<!-- <q-separator /> -->

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
			label="Tabungan"
			caption="Simpan - Pinjam"
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
			<q-item clickable v-ripple to="/accounts">
				<q-item-section avatar>
					<q-icon color="blue-grey-1" name="account_tree" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Daftar Rekening</q-item-label>
					<!-- <q-item-label caption>Data Anggota</q-item-label> -->
				</q-item-section>
			</q-item>
			<q-item clickable v-ripple to="/accounts/rekap">
				<q-item-section avatar>
					<q-icon color="blue-grey-1" name="account_balance" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Rekap Rekening</q-item-label>
					<!-- <q-item-label caption>Data Anggota</q-item-label> -->
				</q-item-section>
			</q-item>
		</q-expansion-item>

		<!-- SETTING -->
		<!-- <q-separator dark /> -->
		<q-expansion-item
			expand-separator
			label="Pengaturan"
			caption="Aplikasi dan Pengguna"
			header-class="text-body1 text-green-1"
			expand-icon-class="text-green-1"
		>
			<!-- APP -->
			<q-item clickable v-ripple to="/settings/lists">
				<q-item-section avatar>
					<q-icon color="green-1" name="settings" />
				</q-item-section>
				<q-item-section>
					<q-item-label>List</q-item-label>
					<q-item-label caption>Pengaturan List</q-item-label>
				</q-item-section>
			</q-item>

			<!-- USER -->
			<q-item clickable v-ripple to="/settings/users">
				<q-item-section avatar>
					<q-icon color="green-1" name="manage_accounts" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Pengguna</q-item-label>
					<q-item-label caption>Pengaturan Pengguna</q-item-label>
				</q-item-section>
			</q-item>
		</q-expansion-item>
	</q-list>
</template>

<script setup lang="ts"></script>
