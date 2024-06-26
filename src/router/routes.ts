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

			// export
			{
				path: 'export',
				component: () => import('src/pages/export/ExportIndex.vue'),
			},

			// canteens
			{
				path: 'canteens',
				children: [
					{
						path: '',
						component: () =>
							import('src/pages/canteens/CanteenAll.vue'),
					},
					{
						path: ':id',
						component: () =>
							import('src/pages/canteens/CanteenDetail.vue'),
						redirect: (path) => `/canteens/${path.params.id}/menus`,
						children: [
							{
								path: 'menus',
								component: () =>
									import(
										'src/pages/canteens/CanteenMenus.vue'
									),
							},
							{
								path: 'invoices',
								component: () =>
									import(
										'src/pages/canteens/CanteenInvoices.vue'
									),
							},
						],
					},
				],
			},

			// user (current)
			{
				path: 'user',
				redirect: () => '/user/profile',
				children: [
					{
						path: 'profile',
						component: () => import('src/pages/user/MyProfile.vue'),
					},
					{
						path: 'application',
						component: () => import('src/pages/user/MyLoan.vue'),
					},
					{
						path: 'account/:startDate?/:endDate?',
						component: () => import('src/pages/user/MyJournal.vue'),
					},
					{
						path: 'canteen',
						component: () => import('src/pages/user/MyCanteen.vue'),
					},
					{
						path: 'canteen/menus',
						component: () =>
							import('src/pages/user/MyCanteenMenus.vue'),
					},
					{
						path: 'canteen/invoices',
						component: () =>
							import('src/pages/user/MyCanteenInvoices.vue'),
					},
				],
			},

			//kelompok (group member)
			{
				path: 'my-group',
				children: [
					{
						path: '',
						component: () =>
							import('src/pages/kelompok/KelompokIndex.vue'),
					},
					{
						path: 'pengajuan',
						component: () =>
							import('src/pages/kelompok/LoanApplication.vue'),
					},
				],
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

			// tentang
			{
				path: 'about',
				component: () => import('src/pages/about/AboutIndex.vue'),
				meta: { title: 'Tentang Aplikasi' },
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

	// warung
	{
		path: '/',
		name: 'Warung Online',
		component: () => import('layouts/WarungLayout.vue'),
		children: [
			{
				path: 'warung',
				component: () => import('src/pages/warung/IndexWarung.vue'),
			},
			{
				path: 'warung/:id',
				component: () => import('src/pages/warung/DetailWarung.vue'),
			},
			{
				path: 'invoices/:id',
				component: () => import('src/pages/warung/InvoicePage.vue'),
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
