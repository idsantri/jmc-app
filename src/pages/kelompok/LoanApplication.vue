<template lang="">
	<q-page class="q-pa-sm">
		<q-card>
			<q-card-section class="bg-blue-grey-4 text-subtitle1 q-pa-sm">
				Pengajuan Pinjaman Kelompok
				<span class="text-weight-medium">{{ kelompok }}</span>
			</q-card-section>
			<q-table
				:rows="loans"
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
				<template v-slot:header="props">
					<q-tr :props="props">
						<q-th key="cr_at" :props="props"> Tanggal </q-th>
						<q-th key="nama" :props="props"> Nama </q-th>
						<q-th key="account_id" :props="props"> No Rek </q-th>
						<q-th key="keperluan" :props="props"> Keperluan </q-th>
						<q-th key="nominal" :props="props">
							Pengajuan (Rp)
						</q-th>
						<q-th key="nominal_disetujui" :props="props">
							Disetujui (Rp)
						</q-th>
						<q-th key="cicilan" :props="props"> Ang. </q-th>
						<q-th key="status" :props="props"> Status </q-th>
					</q-tr>
				</template>
				<template v-slot:body="props">
					<q-tr :props="props">
						<q-td key="cr_at" :props="props">
							{{ formatDateShort(props.row.cr_at) }}
						</q-td>
						<q-td key="nama" :props="props">
							{{ props.row.nama }}
						</q-td>
						<q-td key="account_id" :props="props">
							{{ props.row.account_id }}
						</q-td>
						<q-td key="keperluan" :props="props">
							{{
								props.row.keperluan.length > 30
									? props.row.keperluan.substr(0, 30) +
									  ' &mldr;'
									: props.row.keperluan
							}}
						</q-td>
						<q-td key="nominal" :props="props">
							Rp{{ digitSeparator(props.row.nominal || 0) }}
						</q-td>
						<q-td key="nominal_disetujui" :props="props">
							Rp{{
								digitSeparator(props.row.nominal_disetujui || 0)
							}}
						</q-td>
						<q-td key="cicilan" :props="props">
							{{ props.row.cicilan }}x
						</q-td>
						<q-td key="status" :props="props">
							<q-btn
								outline
								dense
								class="q-px-md"
								no-caps
								color="blue-grey-10"
								glossy
								@click="onClickStatus(props.row)"
							>
								<!-- Ditolak -->
								<q-icon
									v-if="props.row.status == 0"
									name="do_not_disturb"
									color="negative"
								/>
								<!-- Disetujui -->
								<q-icon
									v-else-if="props.row.status == 1"
									name="task_alt"
									color="positive"
								/>
								<!-- Dalam peninjauan -->
								<q-icon v-else name="cached" color="primary" />
							</q-btn>
						</q-td>
					</q-tr>
				</template>
			</q-table>
			<q-banner class="bg-blue-grey-11 q-pa-sm">
				<div class="row wrap justify-around content-center">
					<div class="">
						<q-icon name="cached" color="primary" size="sm" />
						<span class="text-caption q-ml-xs"
							>Dalam Peninjauan</span
						>
					</div>
					<div class="">
						<q-icon name="task_alt" color="positive" size="sm" />
						<span class="text-caption q-ml-xs">Disetujui</span>
					</div>
					<div class="">
						<q-icon
							name="do_not_disturb"
							color="negative"
							size="sm"
						/>
						<span class="text-caption q-ml-xs">Ditolak</span>
					</div>
				</div>
			</q-banner>
		</q-card>
		<!-- <pre>{{ loans }}</pre> -->
		<q-dialog persistent="" v-model="loanCrud">
			<LoanStatusCrud :data-input="loan" @success-submit="loadData" />
		</q-dialog>
	</q-page>
</template>
<script setup>
import apiGet from 'src/api/api-get';
import { formatDateShort } from 'src/utils/format-date';
import { digitSeparator } from 'src/utils/format-number';
import { onMounted, ref } from 'vue';
import LoanStatusCrud from './LoanStatusCrud.vue';

const kelompok = ref('');
const loans = ref([]);
const loan = ref({});
const loadingTable = ref(false);
const filter = ref('');
const loanCrud = ref(false);

async function loadData() {
	const data = await apiGet({
		endPoint: 'kelompok/loan-applications',
		loading: loadingTable,
	});
	kelompok.value = data.kelompok;
	loans.value = data.loans;
}

onMounted(async () => {
	await loadData();
});

function onClickStatus(val) {
	loan.value = val;
	loanCrud.value = true;
}
</script>
<style lang=""></style>
