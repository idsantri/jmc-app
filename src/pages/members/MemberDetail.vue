<template lang="">
	<q-page class="q-pa-sm">
		<q-card style="max-width: 800px">
			<q-toolbar class="bg-blue-grey-4 text-subtitle1 text-weight-medium">
				Detail Data Anggota
				<q-space />
				<q-btn
					icon="edit"
					label="Edit"
					no-caps
					class="q-px-md text-blue-grey-10 text-weight-regular"
					dense
					color="blue-grey-11"
					@click="crudShow = true"
				/>
			</q-toolbar>
			<q-card-section class="q-pa-sm">
				<div v-if="loading" class="flex flex-center">
					<q-spinner-cube color="blue-grey-5" size="8em" />
				</div>
				<div v-else>
					<table bordered flat class="table-member">
						<tbody>
							<tr>
								<td class="col-label">Nama</td>
								<td class="text-weight-medium">
									{{ member.nama }} ({{ member.sex }})
								</td>
							</tr>
							<tr>
								<td class="col-label">Alamat</td>
								<td class="td-alamat">
									<div class="content-alamat">
										{{ alamat() }}
									</div>
								</td>
							</tr>
							<tr>
								<td class="col-label">Nomor Rekening</td>
								<td>
									<div class="flex flex-center">
										{{ member.account_id }}
										<q-space />
										<div v-if="member.account_id">
											<q-btn
												icon="info"
												glossy
												round
												color="blue-grey"
												outline
												:to="`/journals/${member.account_id}/0`"
											/>
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td class="col-label">Kelompok</td>
								<td>
									<div>
										{{ member.kelompok }}
									</div>
								</td>
							</tr>
							<tr>
								<td class="col-label">Email</td>
								<td>
									<div>
										{{ member.email }}
									</div>
								</td>
							</tr>
						</tbody>
					</table>

					<q-list bordered class="q-mt-sm">
						<q-item class="bg-blue-grey-11">
							<q-item-section>
								<q-item-label class="text-weight-bold">
									User
								</q-item-label>
							</q-item-section>
							<q-item-section avatar>
								<div v-if="!member.user_id">
									<q-btn
										label="Buat User"
										no-caps
										icon="add"
										color="blue-grey-10"
										@click="createUser"
									/>
								</div>
								<div v-else>
									<q-btn
										label="Edit"
										no-caps
										icon="edit"
										color="blue-grey-10"
										@click="editUser"
									/>
								</div>
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>
								<q-item-label>
									<table>
										<!-- <tr>
											<td class="text-italic q-pr-sm">
												Email
											</td>
											<td>
												{{ member.email || '-' }}
											</td>
										</tr> -->
										<tr>
											<td class="text-italic q-pr-sm">
												WhatsApp
											</td>
											<td>
												{{ member.user_phone || '-' }}
											</td>
										</tr>
										<tr>
											<td class="text-italic q-pr-sm">
												Akses
											</td>
											<td>
												{{ member.user_roles || '-' }}
											</td>
										</tr>
									</table>
								</q-item-label>
							</q-item-section>
							<q-item-section avatar>
								<q-btn
									icon="info"
									round
									glossy
									color="blue-grey"
									outline
									:to="`/settings/users/${member.user_id}`"
									:disable="!member.user_id"
								/>
							</q-item-section>
						</q-item>
					</q-list>
				</div>
			</q-card-section>
		</q-card>
		<!-- <pre>{{ member }}</pre> -->
		<q-dialog persistent="" v-model="crudShow">
			<MemberCrud
				:is-new="false"
				:data-input="member"
				@success-submit="loadData"
				@success-delete="$router.push('/members/')"
			/>
		</q-dialog>

		<q-dialog persistent="" v-model="crudUser">
			<UserCrud
				:is-new="newUser"
				:data-input="user"
				@success-submit="loadData"
				@success-delete="loadData"
			/>
		</q-dialog>
	</q-page>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { onMounted, ref } from 'vue';
import { formatAlamatLengkap } from 'src/utils/format-text';
import { useRoute } from 'vue-router';
import MemberCrud from 'src/pages/members/MemberCrud.vue';
import { notifyError } from 'src/utils/notify';
import UserCrud from './UserCrud.vue';

const member = ref({});
const loading = ref(false);
const route = useRoute();
const crudShow = ref(false);
const crudUser = ref(false);
const newUser = ref(false);
const user = ref({});

async function loadData() {
	const data = await apiGet({
		endPoint: `/members/${route.params.id}`,
		loading,
	});
	member.value = data.member;
	// console.log('m', data.member);
	user.value = data.user || {};
	// console.log('u', data.user);
}

function createUser() {
	if (!member.value.email) {
		return notifyError('Anggota belum memiliki email');
	}
	user.value.email = member.value.email;
	user.value.name = member.value.nama;
	// console.log('u', user.value);

	newUser.value = true;
	crudUser.value = true;
}

function editUser() {
	if (!member.value.email) {
		return notifyError('Anggota belum memiliki email');
	}
	user.value.email = member.value.email;
	user.value.name = member.value.nama;
	user.value.phone = member.value.user_phone;
	user.value.id = member.value.user_id;
	// console.log('u', user.value);

	newUser.value = false;
	crudUser.value = true;
}

onMounted(async () => {
	await loadData();
});

function alamat() {
	const alamat = JSON.parse(JSON.stringify(member.value));
	return formatAlamatLengkap(alamat);
}
</script>

<style lang="scss" scoped>
.table-member {
	width: 100%; /*must be set (to any value)*/
	border-collapse: collapse;
	.col-label {
		font-style: italic;
		font-weight: 300;
		width: 120px;
	}
	tr td {
		border-top: 0.5px #cfd8dc dashed;
		border-bottom: 0.5px #cfd8dc dashed;
		padding: 5px;
		height: 55px;
	}
	.td-alamat {
		max-width: 1px;
	}
	.content-alamat {
		word-wrap: break-word; /*old browsers*/
		overflow-wrap: break-word;
	}
}
</style>
