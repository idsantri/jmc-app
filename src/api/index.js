import axios from 'axios';
import { baseUrl } from 'src/boot/axios';
import { notifyError } from 'src/utils/notify';

const url = baseUrl.defaults.baseURL;
const api = axios.create({ baseURL: url });

// Tambahkan interceptor untuk menangani kesalahan
api.interceptors.response.use(
	(response) => response,
	(error) => {
		// Tangani kesalahan jaringan atau koneksi di sini
		if (!error.response) {
			// Kesalahan tidak ada respons (seperti jaringan terputus)
			// console.log('e', error);
			notifyError('Tidak dapat terhubung ke server');
		} else {
			// Teruskan kesalahan lain ke blok catch berikutnya
			return Promise.reject(error);
		}
	}
);

const apiTokened = api;
const auth = JSON.parse(sessionStorage.getItem('auth'));
const token = auth ? auth.token : 'FAIL TO GET TOKEN';
apiTokened.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export { api, apiTokened };
