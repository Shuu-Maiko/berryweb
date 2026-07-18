import { apiClient } from "./api/client"
import type { NotificationChannel } from "../types/notification.types"

export const notificationService = {
  async listChannels(): Promise<NotificationChannel[]> {
    const response = await apiClient.get("/api/notifications/channels")
    return Array.isArray(response.data) ? response.data : []
  },

  async createChannel(channel: Omit<NotificationChannel, "id">): Promise<NotificationChannel> {
    const response = await apiClient.post("/api/notifications/channels", channel)
    return response.data
  },

  async deleteChannel(id: number): Promise<void> {
    await apiClient.delete(`/api/notifications/channels/${id}`)
  },
}
