<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar class="bg-blue-grey-9">
				<q-btn
					flat
					dense
					round
					icon="menu"
					aria-label="Menu"
					@click="toggleLeftDrawer"
					class="text-blue-grey-1"
				/>

				<q-toolbar-title class="text-blue-grey-1">
					{{ constanta.APP_NAME_1 }}
				</q-toolbar-title>

				<!-- <q-btn
					round
					flat
					dense
					icon="search"
					color="blue-grey-1"
					to="/cari"
					class="text-blue-grey-1"
				>
					<q-badge
						v-if="badge"
						floating
						color="blue-grey-1"
						rounded
					/>
				</q-btn> -->

				<q-btn-dropdown
					flat
					round
					dense
					dropdown-icon="more_vert"
					class="q-pl-md"
					color="blue-grey-1"
				>
					<q-list>
						<q-item
							clickable
							v-close-popup
							name="install"
							@click="installApp"
							v-if="!pwaIsInstalled"
						>
							<q-item-section>Install</q-item-section>
							<q-item-section avatar>
								<q-icon
									color="blue-grey"
									name="install_mobile"
								/>
							</q-item-section>
						</q-item>

						<q-item clickable v-close-popup to="/profile">
							<q-item-section>Profil</q-item-section>
							<q-item-section avatar>
								<q-icon color="blue-grey" name="3p" />
							</q-item-section>
						</q-item>
						<q-item
							clickable
							v-close-popup
							to="/logout"
							class="text-negative"
						>
							<q-item-section>Keluar</q-item-section>
							<q-item-section avatar>
								<q-icon name="logout" />
							</q-item-section>
						</q-item>
					</q-list>
				</q-btn-dropdown>
			</q-toolbar>
		</q-header>

		<q-drawer
			v-model="leftDrawerOpen"
			show-if-above
			bordered
			class="bg-blue-grey-4"
		>
			<suspense>
				<template #default>
					<SideBar />
				</template>
				<template #fallback>
					<div class="spinner">
						<q-spinner-cube color="blue-grey-8" size="8em" />
					</div>
				</template>
			</suspense>
		</q-drawer>

		<q-page-container :key="componentKey">
			<suspense>
				<template #default>
					<router-view :key="$route.fullPath" />
				</template>
				<template #fallback>
					<div class="spinner">
						<q-spinner-cube color="blue-grey-8" size="8em" />
					</div>
				</template>
			</suspense>
		</q-page-container>

		<!-- hidden elements -->
		<div style="display: none">
			<button @click="componentKey++" id="btn-force-rerender">
				rerender
			</button>
		</div>

		<div v-if="loadingMain">
			<q-dialog v-model="loadingMain" persistent>
				<q-spinner-cube
					color="blue-grey-12"
					size="8em"
					class="flex q-ma-lg q-mx-auto"
				/>
			</q-dialog>
		</div>

		<q-footer bordered class="bg-blue-grey-6 text-blue-grey-11">
			<p class="text-center no-margin q-pa-xs">
				by idsantri {{ m2h('2023-08-01')?.substring(0, 4) }} &mdash; v.
				{{ app.version }}
			</p>
		</q-footer>
	</q-layout>
</template>

<script setup>
import { ref, onMounted, computed, toRefs } from 'vue';
import SideBar from '../components/SideBar.vue';
import constanta from 'src/config/constanta';
import { m2h } from 'src/utils/hijri';
const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => (leftDrawerOpen.value = !leftDrawerOpen.value);
import app from '../../package.json';
import loadingStore from 'src/stores/loading-store';

const componentKey = ref(0);

const { loadingMain } = toRefs(loadingStore());

// const badge = ref(false);

/**
 * ----------------------------------
 * PWA
 * ----------------------------------
 */
const deferredPrompt = ref(null);
onMounted(async () => {
	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		deferredPrompt.value = e;
	});
});

const pwaIsInstalled = computed(() => {
	if (window.matchMedia('(display-mode:standalone)').matches) {
		console.log('this is standalone');
		return true;
	}
	console.log('this is not standalone');
	return false;
});

const installApp = async () => {
	deferredPrompt.value.prompt();
	const { outcome } = await deferredPrompt.value.userChoice;
	if (outcome === 'dismissed') {
		console.log('this is standalone');
		return true;
	}
};
</script>
<style lang="scss">
.spinner {
	text-align: center;
	margin: 30px auto;
}
</style>
