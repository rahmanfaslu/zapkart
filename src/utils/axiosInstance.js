import axios from "axios";

const API_BASE_URL = "https://shigify-backend.onrender.com";

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Request interceptor to add bearer token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response interceptor for handling 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Don't retry refresh token endpoint itself
            if (originalRequest.url === "/api/users/refresh-token") {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Queue the request while refreshing
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Try to refresh the token - send refreshToken in body as fallback
                const user = JSON.parse(localStorage.getItem("user"));
                console.log("Attempting token refresh...");
                const res = await api.post("/api/users/refresh-token", {
                    refreshToken: user?.refreshToken
                });

                console.log("Refresh response received:", res.data);

                // Update token in localStorage
                if (res.data?.token || res.data?.accessToken) {
                    const newToken = res.data.token || res.data.accessToken;
                    const updatedUser = { ...user, token: newToken };
                    localStorage.setItem("user", JSON.stringify(updatedUser));

                    // Update header for retrying original request
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }

                processQueue(null);
                isRefreshing = false;

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                isRefreshing = false;

                // Refresh failed - clear storage and redirect to login
                localStorage.removeItem("user");
                window.dispatchEvent(new CustomEvent("auth:sessionExpired"));

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
