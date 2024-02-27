<template>
	<q-list class="text-blue-grey-1">
		<!-- HOME -->
		<div class="flex flex-center q-my-md">
			<q-img
				src="logo-c.png"
				style="
					width: 40%;
					border: 1px solid whitesmoke;
					border-radius: 50%;
					background-color: whitesmoke;
				"
			/>
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
		<q-expansion-item
			expand-separator
			label="Kelompok Saya"
			header-class="text-overline"
			expand-icon-class="text-blue-grey-1"
			default-opened
		>
			<q-item clickable v-ripple to="/my-group">
				<q-item-section avatar>
					<q-icon color="blue-grey-1" name="people" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Anggota Kelompok</q-item-label>
				</q-item-section>
			</q-item>
			<q-item clickable v-ripple to="/my-group/pengajuan">
				<q-item-section avatar>
					<q-icon color="blue-grey-1" name="request_quote" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Pengajuan Anggota</q-item-label>
				</q-item-section>
			</q-item>
		</q-expansion-item>

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
					<q-item-label>Anggota</q-item-label>
					<!-- <q-item-label caption>Anggota</q-item-label> -->
				</q-item-section>
			</q-item>
			<q-item clickable v-ripple to="/accounts">
				<q-item-section avatar>
					<q-icon color="blue-grey-1" name="account_tree" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Daftar Rekening</q-item-label>
					<!-- <q-item-label caption>Anggota</q-item-label> -->
				</q-item-section>
			</q-item>
			<q-item clickable v-ripple to="/accounts/rekap">
				<q-item-section avatar>
					<q-icon color="blue-grey-1" name="account_balance" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Rekap Rekening</q-item-label>
					<!-- <q-item-label caption>Anggota</q-item-label> -->
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
		<q-item clickable v-ripple>
			<q-item-section avatar>
				<q-icon color="green-1" name="info" />
			</q-item-section>
			<q-item-section>
				<q-item-label>About</q-item-label>
				<q-item-label caption>Tentang Aplikasi</q-item-label>
			</q-item-section>
		</q-item>
	</q-list>
</template>

<script setup lang="ts"></script>
