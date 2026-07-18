import { useState, useEffect, useCallback } from "react"
import { jobService } from "../services/job.service"
import type { Job } from "../types/job.types"
import axios from "axios"

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadJobs = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError(null)
    try {
      const data = await jobService.listJobs(signal)
      setJobs(data)
    } catch (err: any) {
      if (axios.isCancel(err) || err.name === "CanceledError") {
        return // Ignored cancellation to prevent false error states on unmount
      }
      console.error("Error loading jobs:", err)
      setError(err.message || "Failed to load jobs list.")
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [])

  const deleteJob = useCallback(async (secureJobId: string): Promise<boolean> => {
    try {
      await jobService.deleteJob(secureJobId)
      setJobs((prev) => prev.filter((j) => j.id !== secureJobId))
      return true
    } catch (err: any) {
      alert(err.message || "Failed to delete job.")
      return false
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    loadJobs(controller.signal)
    return () => {
      controller.abort()
    }
  }, [loadJobs])

  return {
    jobs,
    loading,
    error,
    refreshJobs: loadJobs,
    deleteJob,
  }
}
