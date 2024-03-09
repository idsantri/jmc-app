import {
	createRouter,
	createWebHistory,
	createWebHashHistory,
} from 'vue-router';
import routes from './routes';
import { nextTick } from 'vue';
import authStore from '../stores/auth-store';
import constanta from 'src/config/constanta';

// Jika tidak menggunakan mode SSR, Anda dapat langsung mengekspor instansiasi Router;
// Fungsi di bawah ini juga dapat bersifat async; gunakan async/await atau kembalikan Promise yang menghasilkan instansiasi Router.
export default function createMyRouter(/* { store, ssrContext } */): ReturnType<
	typeof createRouter
> {
	const createHistory = process.env.SERVER
		? createWebHashHistory()
		: process.env.VUE_ROUTER_MODE === 'history'
		? createWebHistory(process.env.VUE_ROUTER_BASE)
		: createWebHashHistory();

	const router = createRouter({
		history: createHistory,
		routes,
		scrollBehavior: () => ({ left: 0, top: 0 }),
	});

	router.beforeEach((to, from, next) => {
		if (to.fullPath === '/') {
			return next('/warung');
		}

		if (to.fullPath.includes('warung')) {
			return next();
		}

		const store = authStore();
		const authRoutes = ['Register', 'Login', 'Forgot', 'Reset', 'Verify'];
		const toAuthRoutes = authRoutes.includes(to.name as string);
		const isAuthenticate =
			store.getToken && (store.getToken as string).length > 0;

		if (!toAuthRoutes && !isAuthenticate) {
			next('/login');
		} else if (toAuthRoutes && isAuthenticate) {
			history.go(-1);
		} else {
			next();
		}
	});

	const DEFAULT_TITLE = constanta.APP_NAME_1;
	router.afterEach((to) => {
		nextTick(() => {
			document.title = to.meta.title
				? `${DEFAULT_TITLE} — ${to.meta.title}`
				: DEFAULT_TITLE;
		});
	});

	return router;
}
