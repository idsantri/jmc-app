<template lang="">
	<q-page class="q-pa-sm">
		<q-card class="">
			<q-toolbar class="bg-blue-grey-4 text-subtitle1 text-weight-medium">
				Data Anggota
				<q-space />

				<q-btn
					icon="add"
					label="Tambah"
					no-caps
					class="q-px-md text-blue-grey-10 text-weight-regular"
					dense
					color="blue-grey-11"
					@click="crudShow = true"
				/>
			</q-toolbar>
			<q-table
				flat
				:columns="columns"
				:rows="members"
				row-key="name"
				:loading="loadingTable"
				:filter="filter"
				class="q-pa-sm"
				:rows-per-page-options="[10, 25, 50, 100, 0]"
			>
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
						<q-td key="account_id" :props="props">
							<div v-if="props.row.account_id">
								<q-btn
									:label="props.row.account_id"
									size="sm"
									outline
									glossy
									:to="`/journals/${props.row.account_id}/0`"
									color="blue-grey-10"
									class="text-weight-bold"
								/>
							</div>
						</q-td>
						<q-td key="nama" :props="props">
							<div class="content-start justify-center">
								<q-btn
									icon="info"
									class="q-mr-sm"
									glossy
									color="blue-grey-6"
									outline
									size="sm"
									:to="`/members/${props.row.id}`"
								/>
								<span class="text-weight-medium">
									{{ props.row.nama }}
								</span>
							</div>
						</q-td>
						<q-td key="alamat" :props="props">
							{{ props.row.desa || '' }}
							{{ props.row.kecamatan || '' }}
							{{ props.row.kabupaten || '' }}
						</q-td>
						<q-td key="kelompok" :props="props">
							{{ props.row.kelompok }}
						</q-td>
					</q-tr>
				</template>
			</q-table>
		</q-card>

		<!-- <pre>{{ members }}</pre> -->
		<q-dialog persistent="" v-model="crudShow">
			<MemberCrud
				:is-new="true"
				:data-input="{}"
				@success-submit="(v) => $router.push(`/members/${v.id}`)"
				@success-delete="null"
			/>
		</q-dialog>
	</q-page>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import apiGet from 'src/api/api-get.js';
import MemberCrud from 'src/pages/members/MemberCrud.vue';

const members = ref([]);
const loadingTable = ref(false);
const filter = ref('');
const crudShow = ref(false);

async function getData() {
	const data = await apiGet({ endPoint: 'members', loading: loadingTable });
	members.value = data.members;
}
onMounted(async () => {
	await getData();
});

const columns = [
	{
		name: 'account_id',
		label: 'No. Rek.',
		align: 'left',
		field: 'account_id',
		sortable: true,
	},
	{
		name: 'nama',
		label: 'Nama',
		align: 'left',
		field: 'nama',
		sortable: true,
	},
	{
		name: 'alamat',
		label: 'Alamat',
		align: 'left',
		field: (r) =>
			`${r.desa || ''} ${r.kecamatan || ''} ${r.kabupaten || ''}`,
		sortable: true,
	},
	{
		name: 'kelompok',
		label: 'Kelompok',
		align: 'left',
		field: 'kelompok',
		sortable: true,
	},
];
</script>
<style lang="scss" scoped></style>
