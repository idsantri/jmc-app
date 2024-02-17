<template lang="">
	<q-page class="q-pa-sm">
		<q-card class="full-width" style="max-width: 600px">
			<q-card-section
				class="bg-blue-grey-6 text-blue-grey-11 q-pa-sm row items-center"
			>
				<div class="text-subtitle1">Data User</div>
				<q-space />
			</q-card-section>
			<div v-if="loading" class="flex flex-center q-pa-lg">
				<q-spinner-cube color="blue-grey-5" size="8em" />
			</div>
			<div v-else>
				<q-markup-table flat bordered class="q-ma-md">
					<tbody>
						<tr>
							<td>Email</td>
							<td>{{ user?.email }}</td>
						</tr>
						<tr>
							<td>Telepon</td>
							<td>{{ user?.phone }}</td>
						</tr>
						<tr>
							<td>Nama</td>
							<td>
								<div v-if="member?.nama">
									{{ member?.nama }}
								</div>
								<div v-else-if="user?.email && !member?.nama">
									<div class="text-negative text-italic">
										Email tidak terhubung ke data Anggota
									</div>
								</div>
							</td>
						</tr>
					</tbody>
				</q-markup-table>

				<!-- roles -->
				<q-card-section>
					<div class="row">
						<div
							class="col-md-6 col-sm-12"
							v-for="(value, role) in user?.roles"
							:key="role"
						>
							<q-toggle
								style="min-width: 150px"
								:label="titleCase(role)"
								:model-value="value"
								@click="setRole(user.id, role, !value)"
							/>
						</div>
					</div>
				</q-card-section>
			</div>

			<q-card-actions class="bg-blue-grey-5 q-pa-sm">
				<q-btn
					label="Hapus"
					color="negative"
					no-caps=""
					@click="deleteUser"
				/>
				<q-space />
			</q-card-actions>
		</q-card>
	</q-page>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { onMounted, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { titleCase } from 'src/utils/format-text';
import apiUpdate from 'src/api/api-update';
import apiDelete from 'src/api/api-delete';
import loadingStore from 'src/stores/loading-store';

const user = ref({});
const member = ref({});
const loading = ref(false);
const route = useRoute();
const router = useRouter();
const { loadingMain } = toRefs(loadingStore());

async function loadData() {
	const data = await apiGet({
		endPoint: `users/${route.params.id}`,
		loading,
	});
	user.value = data.user;
	member.value = data.member;
}

onMounted(async () => {
	await loadData();
});

async function deleteUser() {
	const id = user.value.id;
	const del = await apiDelete({
		endPoint: `users/${id}`,
		rerender: true,
		loading: loadingMain,
	});
	if (del) {
		router.go(-1);
	}
}

async function setRole(id, role, value) {
	user.value.roles[role] = value;
	const data = { role, value };
	const update = await apiUpdate({
		endPoint: `users/${id}/roles`,
		data,
		loading: loadingMain,
		confirm: false,
	});
	if (update) {
	} else {
		return (user.value.roles[role] = !value);
	}
}
</script>
<style lang=""></style>
