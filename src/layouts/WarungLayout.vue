<template>
	<q-layout view="hHh lpR fFf">
		<q-header bordered class="bg-blue-grey-9">
			<q-toolbar class="bg-blue-grey-9">
				<q-toolbar-title class="text-blue-grey-1">
					Warung Online {{ constanta.APP_NAME_1 }}
				</q-toolbar-title>
				<q-btn
					v-if="!isAuthenticate"
					icon-right="login"
					label="Login"
					class="bg-blue-grey-11 text-blue-grey-10 q-px-md"
					dense
					no-caps
					to="/login"
				/>
				<q-btn
					v-if="isAuthenticate"
					icon-right="login"
					label="Anggota JMC"
					class="bg-blue-grey-11 text-blue-grey-10 q-px-md"
					dense
					no-caps
					to="/user/account"
				/>
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

						<q-item
							v-if="isAuthenticate"
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

		<q-page-container>
			<router-view />
		</q-page-container>

		<q-footer bordered class="bg-blue-grey-6 text-blue-grey-11">
			<p class="text-center no-margin q-pa-xs">
				by idsantri {{ m2h('2023-08-01')?.substring(0, 4) }} &mdash; v.
				{{ app.version }}
			</p>
		</q-footer>
	</q-layout>
</template>
<script setup>
import { m2h } from 'src/utils/hijri';
import app from '../../package.json';
import constanta from 'src/config/constanta';
import { computed, onMounted, ref } from 'vue';
import useAuthStore from 'src/stores/auth-store';

const auth = useAuthStore();
const isAuthenticate = auth.getToken && auth.getToken.length > 0;

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
