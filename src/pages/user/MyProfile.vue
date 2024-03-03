<template lang="">
	<q-page class="q-pa-sm">
		<q-card style="max-width: 600px">
			<q-card-section class="bg-blue-grey-7 text-blue-grey-11 q-pa-sm">
				<div class="flex items-center">
					<div class="text-subtitle2">Profil Pengguna</div>
					<q-space />
				</div>
			</q-card-section>

			<q-card-section class="q-pa-sm">
				<div v-if="loading">
					<q-spinner-cube
						color="blue-grey-12"
						size="8em"
						class="flex q-ma-lg q-mx-auto"
					/>
				</div>
				<div v-else>
					<q-list bordered separator class="">
						<q-item class="q-pa-sm">
							<q-item-section>
								<q-item-label>
									<table>
										<!-- <tr>
											<td
												class="text-italic text-caption q-pr-md"
											>
												Nama
											</td>
											<td>{{ user.name }}</td>
										</tr> -->
										<tr>
											<td
												class="text-italic text-caption q-pr-md"
											>
												Email
											</td>
											<td>{{ user.email }}</td>
										</tr>
										<tr>
											<td
												class="text-italic text-caption q-pr-md"
											>
												Username
											</td>
											<td>{{ user.username }}</td>
										</tr>
										<tr>
											<td
												class="text-italic text-caption q-pr-md"
											>
												Telepon
											</td>
											<td>{{ user.phone || '-' }}</td>
										</tr>
									</table>
								</q-item-label>
								<q-item-label class="bg-blue-grey-1">
									<div class="float-right">
										<q-btn
											label="User"
											icon="edit"
											no-caps
											dense
											class="q-my-xs q-mx-sm q-px-sm"
											@click="showUserModal"
										/>
										<q-btn
											label="Password"
											icon="edit"
											no-caps
											dense
											class="q-my-xs q-mx-sm q-px-sm"
											@click="changePassword"
										/>
									</div>
								</q-item-label>
							</q-item-section>
						</q-item>
						<q-item class="q-pa-sm">
							<q-item-section>
								<q-item-label
									class="q-pa-sm text-weight-medium text-overline bg-blue-grey-11"
								>
									User Group
								</q-item-label>
								<q-item-label>
									<div
										class="fit row wrap justify-start items-start content-start"
									>
										<div
											v-for="(item, index) in user.roles"
											:key="index"
											class="col-6"
										>
											<q-toggle
												:model-value="item"
												color="blue-grey"
												:label="titleCase(index)"
												disable
											/>
										</div>
									</div>
								</q-item-label>
							</q-item-section>
						</q-item>

						<q-item class="q-pa-sm">
							<q-item-section>
								<q-item-label
									class="q-pa-sm text-weight-medium text-overline bg-blue-grey-11"
								>
									Data Anggota
								</q-item-label>
								<q-item-label
									v-if="member.nama"
									class="flex items-center justify-between"
								>
									<table>
										<tr>
											<td
												class="text-italic text-caption q-pr-md"
											>
												Nama
											</td>
											<td>{{ member.nama }}</td>
										</tr>
										<tr>
											<td
												class="text-italic text-caption q-pr-md"
											>
												Kelompok
											</td>
											<td>{{ member.kelompok }}</td>
										</tr>
										<tr>
											<td
												class="text-italic text-caption q-pr-md"
											>
												No. Rekening
											</td>
											<td>{{ member.account_id }}</td>
										</tr>
									</table>
									<div>
										<q-btn
											icon="home"
											round
											outline
											to="/"
											glossy
											class="blue-grey-10"
										/>
									</div>
								</q-item-label>
								<q-item-label
									v-else
									class="text-negative text-center text-italic bg-blue-grey-1 q-pa-xl"
								>
									<div>
										Email Anda tidak terhubung ke data
										Anggota.
									</div>
									<div class="text-weight-medium">
										Hubungi Admin!
									</div>
								</q-item-label>
							</q-item-section>
						</q-item>
					</q-list>
				</div>
			</q-card-section>
		</q-card>

		<!-- MODAL -->
		<q-dialog v-model="crudShow">
			<q-card class="full-width" style="max-width: 425px">
				<q-form @submit.prevent="submit">
					<q-card-section
						class="bg-blue-grey-7 text-blue-grey-11 q-pa-sm"
					>
						Update Username
					</q-card-section>
					<q-card-section>
						<div v-if="loadingCrud">
							<q-dialog v-model="loadingCrud" persistent="">
								<q-spinner-cube
									color="blue-grey-12"
									size="8em"
									class="flex q-ma-lg q-mx-auto"
								/>
							</q-dialog>
						</div>
						<q-input
							dense
							outlined
							label="Nama"
							v-model="newUser.name"
							hint=""
						/>
						<q-input
							class="q-mt-sm"
							dense
							outlined
							label="Username"
							v-model="newUser.username"
							hint="Anda bisa login dengan username atau email"
						/>

						<q-input
							class="q-mt-sm"
							dense
							outlined
							label="Nomor Telepon"
							v-model="newUser.phone"
							hint="08123456789"
						/>
					</q-card-section>
					<q-card-actions class="flex bg-blue-grey-6">
						<q-space />
						<q-btn
							label="Tutup"
							v-close-popup
							class="bg-blue-grey-11"
							no-caps=""
							id="btn-close"
						/>
						<q-btn
							type="submit"
							label="Simpan"
							class="bg-blue-grey-10 text-blue-grey-11"
							no-caps=""
						/>
					</q-card-actions>
				</q-form>
			</q-card>
		</q-dialog>
	</q-page>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import apiGet from 'src/api/api-get';
import apiUpdate from 'src/api/api-update';
import { titleCase } from 'src/utils/format-text';
import { notifyAlert } from 'src/utils/notify';

const user = ref({});
const loading = ref(false);
const crudShow = ref(false);
const loadingCrud = ref(false);
const newUser = ref({});
const member = ref({});

async function loadUser() {
	const data = await apiGet({ endPoint: 'user', loading });
	user.value = data.user;
}

async function loadMember() {
	const data = await apiGet({ endPoint: 'member', loading });
	member.value = data.member;
}

onMounted(async () => {
	await loadUser();
	await loadMember();
	// console.log(member.value);
});

async function submit() {
	const response = await apiUpdate({
		endPoint: 'user',
		data: {
			username: newUser.value.username,
			name: newUser.value.name,
			phone: newUser.value.phone,
		},
		confirm: true,
		notify: true,
		loading: loadingCrud,
	});
	if (response) {
		document.getElementById('btn-close').click();
		await loadUser();
	}
}

function showUserModal() {
	Object.assign(newUser.value, user.value);
	crudShow.value = true;
}
const changePassword = async () => {
	await notifyAlert(
		'Untuk mengganti password, silakan <strong>logout (keluar)</strong>. Pada halaman login, klik <strong>lupa password</strong>.<br/>Ikuti petunjuk yang diberikan.<br/><br/>Atau, Anda bisa minta bantuan Admin jika email Anda tidak valid.',
		0
	);
};
</script>
<style lang=""></style>
