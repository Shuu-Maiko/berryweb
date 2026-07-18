import { apiClient } from "./api/client"
import type { Job, JobRequest } from "../types/job.types"

function normalizeJob(raw: any): Job {
  return {
    id: raw.secureJobId || raw.id || "",
    name: raw.name || "",
    cronExpression: raw.cronExpression || raw.cronExp || "",
    jobType: raw.jobType || "PRINT_LOG",
    message: raw.message || "",
    url: raw.url || "",
    httpMethod: raw.httpMethod || "GET",
    payload: raw.payload || "",
    httpHeaders: raw.httpHeaders || undefined,
    createdAt: raw.createdAt || raw.start || "",
    end: raw.end || null,
    status: raw.status || undefined,
    lastRunTime: raw.lastRunTime || null,
    lastRunStatus: raw.lastRunStatus || null,
    nextRunTime: raw.nextRunTime || null,
    lastRun: raw.lastRun || null,
    notifyOnFailure: raw.notifyOnFailure !== false,
    notifyOnSuccess: !!raw.notifyOnSuccess,
  }
}

export const jobService = {
  async createJob(job: JobRequest): Promise<any> {
    const payload = {
      ...job,
      url: job.url || "",
      jobType: job.jobType || "PRINT_LOG",
      notifyOnFailure: job.notifyOnFailure !== false,
      notifyOnSuccess: !!job.notifyOnSuccess,
    }
    const response = await apiClient.post("/api/jobs/create", payload)
    return response.data
  },

  async listJobs(signal?: AbortSignal): Promise<Job[]> {
    const response = await apiClient.get("/api/jobs", { signal })
    const data = response.data
    const rawList = Array.isArray(data) ? data : (data?.jobs || [])
    return rawList.map((item: any) => normalizeJob(item))
  },

  async deleteJob(secureJobId: string): Promise<any> {
    const response = await apiClient.delete(`/api/jobs/${secureJobId}`)
    return response.data
  },

  async getJobDetails(secureJobId: string): Promise<Job> {
    const response = await apiClient.get(`/api/jobs/${secureJobId}/details`)
    return normalizeJob(response.data)
  },

  async getJobHistory(secureJobId: string): Promise<any[]> {
    const response = await apiClient.get(`/api/jobs/${secureJobId}/history`)
    return Array.isArray(response.data) ? response.data : (response.data?.history || [])
  },

  async updateJobSettings(secureJobId: string, settings: { notifyOnFailure: boolean; notifyOnSuccess: boolean }): Promise<any> {
    const response = await apiClient.patch(`/api/jobs/${secureJobId}/settings`, settings)
    return response.data
  },

  async getJobResponses(secureJobId: string, limit: number = 100): Promise<any[]> {
    const response = await apiClient.get(`/api/jobs/${secureJobId}/responses`, {
      params: { limit }
    })
    return Array.isArray(response.data) ? response.data : []
  },
}
