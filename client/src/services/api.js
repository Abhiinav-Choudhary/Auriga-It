import axios from "axios";

const api = axios.create({
    baseURL: "https://jubilant-potato-pjq45w9v5jx3676j-5000.app.github.dev/api",
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh") &&
            !originalRequest.url.includes("/auth/me")
        ) {
            originalRequest._retry = true;

            try {
                await api.post("/auth/refresh");

                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;