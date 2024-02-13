<template>
	<div class="q-pa-xs">
		<form @submit.prevent="submitLogin">
			<div class="q-gutter-y-md column">
				<q-input
					bg-color="green-1"
					outlined
					v-model="login"
					required
					label="Login"
					autocomplete="off"
					autocapitalize="none"
					hint="Username atau email Anda!"
				/>
				<q-input
					id="password"
					bg-color="green-1"
					outlined
					v-model="password"
					type="password"
					required
					label="Password"
					autocomplete="off"
					autocapitalize="none"
					readonly
					onfocus="this.removeAttribute('readonly');"
					onblur="this.setAttribute('readonly','true');"
					hint="Password atau kata sandi"
				/>
				<q-btn
					type="submit"
					class="full-width q-pa-sm text-green-10"
					color="green-3"
					label="Login"
				/>

				<q-card class="my-card" flat>
					<q-card-section
						class="text-green-10 text-center bg-green-2 q-pa-sm"
					>
						<q-btn
							outline
							color="green-10"
							class="full-width text-weight-regular"
							no-caps
							to="/register"
							label="Belum punya akun? Daftar!"
						/>
						<q-btn
							outline
							color="green-10"
							class="full-width text-weight-regular q-mt-sm"
							no-caps
							to="/forgot-password"
							label="Lupa password? Atur ulang!"
						/>
					</q-card-section>
				</q-card>
			</div>
		</form>
	</div>
	<q-spinner-cube
		v-show="showSpinner"
		color="green-12"
		size="14em"
		class="absolute-center"
	/>
</template>

<script setup>
import { api, apiTokened } from 'src/api';
import { useRouter } from 'vue-router';
import { onUpdated, ref } from 'vue';
import { toArray } from 'src/utils/array-object';
import authState from '../../stores/auth-store';
import { notifyAlert, notifySuccess } from 'src/utils/notify';

const router = useRouter();
const login = ref('');
const password = ref('');
const showSpinner = ref(false);

const emit = defineEmits(['title', 'errors']);
emit('title', 'Login');
emit('errors', []);

const submitLogin = async () => {
	emit('errors', []);
	try {
		showSpinner.value = true;
		const response = await api.post('login', {
			login: login.value,
			password: password.value,
		});
		authState().token = response.data.token;
		authState().user = response.data.user;
		authState().roles = response.data.roles;
		authState().permissions = response.data.permissions;

		apiTokened.defaults.headers.common['Authorization'] =
			'Bearer ' + authState().getToken;

		notifySuccess(response.data.message);

		const isConfirmed = response.data.user.confirmed_at;
		if (!isConfirmed) {
			router.push('/profile');
		} else {
			router.push('/');
		}
	} catch (error) {
		// console.log('e', error);
		emit('errors', toArray(error.response.data.message));
	} finally {
		showSpinner.value = false;
	}
};

onUpdated(() => {
	const resend = document.querySelector('ul > li > span > a');
	if (!resend) return;
	resend.addEventListener('click', async (e) => {
		console.log('anchor clicked');
		emit('errors', []);
		e.preventDefault();
		const href = resend.href.replace('%2540', '@');
		// console.log(href);
		try {
			showSpinner.value = true;
			const response = await api.get(href);
			const notification = notifyAlert(response.data.message, 0);
			await notification; // tunggu notifikasi ditutup
		} catch (error) {
			emit('errors', toArray(error.response.data.message));
		} finally {
			showSpinner.value = false;
		}
	});
});
</script>

<style scoped lang="scss"></style>
