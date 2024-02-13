import { defineStore } from 'pinia';
const loadingStore = defineStore('loading', {
	state: () => {
		return {
			loadingMain: false,
		};
	},
	actions: {
		setLoadingMain(v: boolean) {
			v ? (this.loadingMain = true) : (this.loadingMain = false);
		},
	},
});

export default loadingStore;
