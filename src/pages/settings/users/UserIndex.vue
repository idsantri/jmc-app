<template>
	<q-page class="q-pa-sm">
		<q-table
			:rows="users"
			:columns="columns"
			row-key="name"
			:loading="loading"
			:filter="filter"
		>
			<!-- @row-click="(evt, row, index) => rowClick(evt, row, index)" -->
			<template v-slot:top-left>
				<div class="text-h6 text-blue-grey-10">Data Pengguna</div>
			</template>
			<template v-slot:top-right>
				<q-input
					outlined
					dense
					debounce="300"
					v-model="filter"
					placeholder="Cari"
				>
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>
			</template>
			<template v-slot:body="props">
				<q-tr :props="props">
					<q-td key="email" :props="props">
						<q-btn
							icon="info"
							class="q-mr-sm"
							glossy
							color="blue-grey-6"
							outline
							size="sm"
							:to="`/settings/users/${props.row.id}`"
						/>
						{{ props.row.email }}
					</q-td>
					<q-td key="member_nama" :props="props">
						<div
							class="content-start justify-center"
							v-if="props.row.member_id"
						>
							<q-btn
								icon="info"
								class="q-mr-sm"
								glossy
								color="blue-grey-6"
								outline
								size="sm"
								:to="`/members/${props.row.member_id}`"
							/>
							<span class="text-weight-medium">
								{{ props.row.member_nama }}
							</span>
							({{ props.row.member_kelompok }})
						</div>
					</q-td>
					<q-td key="roles" :props="props">
						{{ titleCase(props.row.roles || '-') }}
					</q-td>
				</q-tr>
			</template>
		</q-table>
	</q-page>
	<!-- <pre>{{ users }}</pre> -->
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { onMounted, ref } from 'vue';
import { titleCase } from 'src/utils/format-text';

const filter = ref('');
const loading = ref(false);
const users = ref([]);

async function loadData() {
	const data = await apiGet({
		endPoint: 'users',
		loading: loading,
	});
	users.value = data.users;
	// console.log(users.value);
}

onMounted(async () => {
	await loadData();
});

const columns = [
	{
		name: 'email',
		label: 'Email',
		align: 'left',
		field: 'email',
		sortable: true,
		// sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
	},
	{
		name: 'member_nama',
		label: 'Nama Anggota',
		align: 'left',
		field: (r) => `${r.member_nama} (${r.member_kelompok})`,
		sortable: true,
		// sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
	},

	{
		name: 'roles',
		label: 'Akses',
		field: 'roles',
		align: 'left',
		sortable: true,
	},
];
</script>
<style></style>
