<template>
	<q-list class="text-blue-grey-1">
		<!-- HOME -->
		<div class="flex flex-center q-my-md">
			<q-img
				src="/logo-c.png"
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
			v-if="anggota"
			expand-separator
			label="Akun Saya"
			header-class="text-overline"
			expand-icon-class="text-blue-grey-1"
			default-opened
		>
			<q-item clickable v-ripple to="/user/account">
				<q-item-section avatar>
					<q-icon color="blue-grey-1" name="account_balance_wallet" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Tabunganku</q-item-label>
				</q-item-section>
			</q-item>
			<q-item clickable v-ripple to="/user/application">
				<q-item-section avatar>
					<q-icon color="blue-grey-1" name="request_quote" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Pengajuanku</q-item-label>
				</q-item-section>
			</q-item>
			<q-item clickable v-ripple to="/user/canteen">
				<q-item-section avatar>
					<q-icon color="blue-grey-1" name="store" />
				</q-item-section>
				<q-item-section>
					<q-item-label>Warungku</q-item-label>
				</q-item-section>
			</q-item>
		</q-expansion-item>
		<!-- <q-separator /> -->

		<!-- Kelompok -->
		<q-expansion-item
			v-if="adminKelompok"
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
			v-if="admin"
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

		<!-- EXPORT -->
		<q-item clickable v-ripple to="/export" v-if="admin">
			<q-item-section avatar>
				<q-icon color="green-1" name="send_to_mobile" />
			</q-item-section>
			<q-item-section>
				<q-item-label>Export</q-item-label>
			</q-item-section>
		</q-item>
		<q-separator />

		<!-- CANTEEN -->
		<q-item clickable v-ripple to="/canteens" v-if="admin">
			<q-item-section avatar>
				<q-icon color="green-1" name="store" />
			</q-item-section>
			<q-item-section>
				<q-item-label>Warung</q-item-label>
				<q-item-label caption>Semua Warung</q-item-label>
			</q-item-section>
		</q-item>
		<q-separator />

		<!-- SETTING -->
		<q-expansion-item
			v-if="admin"
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

		<q-item clickable v-ripple v-if="admin" to="/about">
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

<script setup>
import useAuthStore from 'src/stores/auth-store';
import { onMounted, ref } from 'vue';

const admin = ref(false);
const adminKelompok = ref(false);
const anggota = ref(false);

const { getRoles } = useAuthStore();

onMounted(() => {
	getRoles.forEach((role) => {
		if (role === 'admin') admin.value = true;
		if (role === 'admin kelompok') adminKelompok.value = true;
		if (role === 'anggota') anggota.value = true;
	});
});
</script>
