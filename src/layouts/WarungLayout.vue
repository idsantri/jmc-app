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
			<!-- <q-banner
				inline-actions
				class="bg-orange text-white marquee-container q-pa-sm"
			>
				<p class="marquee">
					<span>
						You have lost connection to the internet. This app is
						offline.
					</span>
				</p>

				<template v-slot:action>
					<q-btn flat icon="close" class="q-pa-sm" />
				</template>
			</q-banner> -->
			<router-view />
		</q-page-container>

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
import { m2h } from 'src/utils/hijri';
import app from '../../package.json';
import constanta from 'src/config/constanta';
import { computed, onMounted, ref, toRefs } from 'vue';
import useAuthStore from 'src/stores/auth-store';
import loadingStore from 'src/stores/loading-store';

const auth = useAuthStore();
const isAuthenticate = auth.getToken && auth.getToken.length > 0;
const { loadingMain } = toRefs(loadingStore());

/**
 * ----------------------------------
 * PWA
 * ----------------------------------
 */
const deferredPrompt = ref(null);
onMounted(async () => {
	window.addEventListener('beforeinstallprompt', async (e) => {
		e.preventDefault();
		deferredPrompt.value = e;
		// console.log('e', e);
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

<style lang="scss" scoped>
.marquee-container {
	position: fixed;
	z-index: 999999;
}
.marquee {
	position: relative;
	overflow: hidden;
	margin: 0;
}

.marquee span {
	display: inline-block;
	min-width: 100%; /* this is to prevent shorter text animate to right */
	white-space: nowrap;
	font-size: 1em;
	height: 30px;
	line-height: 30px;
	animation: marquee 6s ease-in-out infinite;
}

@keyframes marquee {
	from {
		transform: translateX(0);
		margin-left: 0;
	}
	to {
		transform: translateX(-100%);
		margin-left: 100%;
	}
}
</style>
