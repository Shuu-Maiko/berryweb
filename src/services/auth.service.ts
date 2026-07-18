import { apiClient } from "./api/client"

export const authService = {
  async signup(name: string, email: string, password: string): Promise<any> {
    const response = await apiClient.post("/api/auth/signup", { name, email, password })
    return response.data
  },

  async login(email: string, password: string): Promise<any> {
    const response = await apiClient.post("/api/auth/login", { email, password })
    localStorage.setItem("isAuthenticated", "true")
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token)
    }
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/api/auth/logout")
    } catch {
      // Ignore failures on logout notification to prevent blocking client logout
    } finally {
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("auth_token")
      window.location.href = "/login"
    }
  },

  getGoogleOAuthUrl(): string {
    return `${apiClient.defaults.baseURL || ""}/oauth2/authorization/google`
  },
}
