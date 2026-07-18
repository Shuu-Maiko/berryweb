import axios from "axios"

const API_BASE = import.meta.env.VITE_API_URL || ""

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Crucial for HttpOnly session cookies
  headers: {
    "Content-Type": "application/json",
  },
})

// Global Request Interceptor to attach token (used for OAuth cross-domain support)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Global Response Interceptor for handling Auth Expirations
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("auth_token")
      // Do not redirect if we are already on login or signup
      const path = window.location.pathname
      if (path !== "/login" && path !== "/signup") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)
