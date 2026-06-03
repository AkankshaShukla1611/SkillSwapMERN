import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({ baseURL: API_URL });

if (typeof window !== 'undefined') {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  let refreshing: Promise<string | null> | null = null;
  api.interceptors.response.use(
    (r) => r,
    async (error) => {
      const original = error.config;
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;
        if (!refreshing) {
          const rt = localStorage.getItem('refresh');
          refreshing = rt
            ? axios
                .post(`${API_URL}/auth/refresh`, { refreshToken: rt })
                .then((res) => {
                  localStorage.setItem('access', res.data.access);
                  localStorage.setItem('refresh', res.data.refresh);
                  return res.data.access as string;
                })
                .catch(() => {
                  localStorage.removeItem('access');
                  localStorage.removeItem('refresh');
                  return null;
                })
                .finally(() => {
                  refreshing = null;
                })
            : Promise.resolve(null);
        }
        const newToken = await refreshing;
        if (newToken) {
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        }
      }
      return Promise.reject(error);
    }
  );
}

export const API_BASE = API_URL;
