import { Notify } from 'quasar';
import { Dialog } from 'quasar';

const notifySuccess = (message: string) => {
	Notify.create({
		type: 'positive',
		message: message,
	});
};

const notifyError = (message: string) => {
	Notify.create({
		type: 'negative',
		message: message,
	});
};

const notifyWarning = (message: string) => {
	Notify.create({
		type: 'warning',
		message: message,
		html: true,
	});
};

const notifyAlert = (message: string, delay = 10) => {
	return new Promise<void>((resolve) => {
		Notify.create({
			message: message,
			// type: 'warning',
			timeout: 1000 * delay,
			html: true,
			icon: 'announcement',
			multiLine: true,
			closeBtn: true,
			position: 'center',
			onDismiss: resolve, // resolve promise ketika notifikasi ditutup
		});
	});
};

async function notifyConfirm(message: string, persistent: boolean) {
	return new Promise<boolean>((resolve) => {
		Dialog.create({
			title: 'Konfirmasi',
			message: message,
			cancel: true,
			persistent: persistent,
			html: true,
		})
			.onOk(async () => {
				resolve(true);
			})
			.onCancel(() => {
				resolve(false);
			})
			.onDismiss(() => {
				resolve(false);
			});
	});
}

const notifyWarningExpired = () => {
	notifyWarning('Sesi telah berakhir.');
	notifyWarning('Anda perlu keluar lalu masuk lagi!');
};

export {
	notifySuccess,
	notifyError,
	notifyWarning,
	notifyAlert,
	notifyConfirm,
	notifyWarningExpired,
};
