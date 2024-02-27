import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	// main
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			// members
			{
				path: 'members',
				children: [
					{
						path: '',
						component: () =>
							import('src/pages/members/MemberIndex.vue'),
					},
					{
						path: ':id',
						component: () =>
							import('src/pages/members/MemberDetail.vue'),
					},
				],
			},
			// accounts
			{
				path: 'accounts',
				children: [
					{
						path: '',
						component: () =>
							import('src/pages/accounts/AccountIndex.vue'),
					},
					{
						path: 'rekap',
						component: () =>
							import('src/pages/accounts/AccountRekap.vue'),
					},
				],
			},
			// journals
			{
				path: 'journals',
				children: [
					{
						path: ':account_id/:startDate?/:endDate?',
						component: () =>
							import('src/pages/journals/IndexJournal.vue'),
						meta: {
							parseNumbers: true, // Enable parsing numbers with dot as decimal
						},
					},
				],
			},

			// profile
			{
				path: 'profile',
				component: () => import('src/pages/user/MyProfile.vue'),
			},
			{
				path: 'my-account/pengajuan',
				component: () => import('src/pages/user/MyLoan.vue'),
			},
			{
				path: 'my-account/:startDate?/:endDate?',
				component: () => import('src/pages/user/MyJournal.vue'),
			},

			//kelompok -- group
			{
				path: 'my-group',
				component: () => import('src/pages/kelompok/KelompokIndex.vue'),
			},
			{
				path: 'my-group/pengajuan',
				component: () =>
					import('src/pages/kelompok/LoanApplication.vue'),
			},

			//settings
			{
				path: 'settings',
				children: [
					{
						path: 'lists',
						component: () =>
							import('src/pages/settings/lists/ListsIndex.vue'),
						meta: { title: 'Setting: List' },
						children: [
							{
								path: ':listKey',
								component: () =>
									import(
										'src/pages/settings/lists/ListsContainer.vue'
									),
							},
						],
					},
					{
						path: 'users',
						meta: { title: 'Setting: User' },
						children: [
							{
								path: '',
								component: () =>
									import(
										'src/pages/settings/users/UserIndex.vue'
									),
							},
							{
								path: ':id',
								component: () =>
									import(
										'src/pages/settings/users/UserDetail.vue'
									),
							},
						],
					},
				],
			},
		],
	},

	// auth
	{
		path: '/',
		name: 'Auth',
		component: () => import('layouts/AuthLayout.vue'),
		children: [
			{
				path: 'logout',
				name: 'Logout',
				component: () => import('../pages/auth/LogoutPage.vue'),
				meta: { title: 'Logout' },
			},
			{
				path: 'verify',
				name: 'Verify',
				component: () => import('../pages/auth/VerifyPage.vue'),
				meta: { title: 'Verifikasi Email' },
			},
			{
				path: 'register',
				name: 'Register',
				component: () => import('../pages/auth/RegisterPage.vue'),
				meta: { title: 'Registrasi' },
			},
			{
				path: 'login',
				name: 'Login',
				component: () => import('../pages/auth/LoginPage.vue'),
				meta: { title: 'Login' },
			},
			{
				path: 'forgot-password',
				name: 'Forgot',
				component: () => import('../pages/auth/ForgotPage.vue'),
				meta: { title: 'Lupa Password' },
			},
			{
				path: 'reset-password',
				name: 'Reset',
				component: () => import('../pages/auth/ResetPage.vue'),
				meta: { title: 'Ganti Password' },
			},
		],
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue'),
	},
];

export default routes;
