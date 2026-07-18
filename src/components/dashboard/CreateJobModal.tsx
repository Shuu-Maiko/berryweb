import { useState, useEffect } from "react"
import { Plus, ShieldAlert, Check } from "lucide-react"
import { CronBuilder } from "./CronBuilder"
import { jobService } from "../../services/job.service"
import { notificationService } from "../../services/notification.service"
import { WebhookConfigurator, type WebhookHeader } from "./WebhookConfigurator"
import { Spinner } from "../ui/Spinner"

interface CreateJobModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateJobModal({ isOpen, onClose, onSuccess }: CreateJobModalProps) {
  const [name, setName] = useState("")
  const [cronString, setCronString] = useState("0 */15 * * * *")
  const [url, setUrl] = useState("")
  const [message, setMessage] = useState("")
  const [jobType, setJobType] = useState<"PRINT_LOG" | "WEBHOOK">("PRINT_LOG")
  const [httpMethod, setHttpMethod] = useState("POST")
  const [headers, setHeaders] = useState<WebhookHeader[]>([{ key: "Content-Type", value: "application/json" }])
  const [payload, setPayload] = useState('{\n  "event": "trigger"\n}')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [notifyOnFailure, setNotifyOnFailure] = useState(true)
  const [notifyOnSuccess, setNotifyOnSuccess] = useState(false)
  const [hasWebhook, setHasWebhook] = useState<boolean | null>(null)
  const [webhookDestination, setWebhookDestination] = useState("")

  useEffect(() => {
    if (isOpen) {
      notificationService
        .listChannels()
        .then((data) => {
          if (data.length > 0) {
            setHasWebhook(true)
            setWebhookDestination(data[0].destination)
          } else {
            setHasWebhook(false)
            setWebhookDestination("")
          }
        })
        .catch(() => {
          setHasWebhook(false)
          setWebhookDestination("")
        })
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")
    try {
      let finalPayload = undefined
      let finalHeaders: Record<string, string> | undefined = undefined

      if (jobType === "WEBHOOK") {
        if (httpMethod !== "GET" && httpMethod !== "DELETE" && payload.trim()) {
          try {
            // Ensure payload is valid JSON before sending
            const parsed = JSON.parse(payload)
            // Stringify it as required by the backend
            finalPayload = JSON.stringify(parsed)
          } catch (e) {
            throw new Error("Invalid JSON in Payload field.")
          }
        }
        
        finalHeaders = headers.reduce((acc, h) => {
          if (h.key.trim()) acc[h.key.trim()] = h.value.trim()
          return acc
        }, {} as Record<string, string>)
      }

      await jobService.createJob({
        name,
        cronString,
        url: jobType === "WEBHOOK" ? url : "",
        message: jobType === "PRINT_LOG" ? message : "",
        jobType,
        httpMethod: jobType === "WEBHOOK" ? httpMethod : undefined,
        httpHeaders: finalHeaders,
        payload: finalPayload,
        notifyOnFailure,
        notifyOnSuccess,
      })

      setSuccessMsg("Successfully scheduled job!")
      // Clear local states
      setName("")
      setUrl("")
      setMessage("")
      setCronString("0 */15 * * * *")
      setJobType("PRINT_LOG")
      setHttpMethod("POST")
      setHeaders([{ key: "Content-Type", value: "application/json" }])
      setPayload('{\n  "event": "trigger"\n}')
      setNotifyOnFailure(true)
      setNotifyOnSuccess(false)
      
      // Trigger parent reload
      onSuccess()
      
      // Auto close modal after positive feedback
      setTimeout(() => {
        setSuccessMsg("")
        onClose()
      }, 1500)
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to schedule job.")
    } finally {
      setLoading(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
      {/* Backdrop with fade-in animation */}
      <div 
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={handleBackdropClick}
      />

      {/* Modal Container with scale-in animation */}
      <div className="relative bg-surface border border-border rounded-xl shadow-2xl w-full max-w-lg md:max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-in transform transition-all duration-300 z-10">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/60 p-4 md:p-5 shrink-0 bg-surface">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus className="h-4 w-4" />
            </div>
            <h3 className="font-heading text-sm font-bold text-text-primary uppercase tracking-wider">
              Schedule a Job
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-elevated hover:text-text-primary transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5">
          {errorMsg && (
            <div className="rounded-lg bg-error-bg border border-error/15 p-3 text-xs font-bold text-error flex items-center gap-2 animate-fade-in">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="rounded-lg bg-success-bg border border-success/15 p-3 text-xs font-bold text-success flex items-center gap-2 animate-fade-in">
              <Check className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form id="create-job-form" onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => {
                  setJobType(e.target.value as "PRINT_LOG" | "WEBHOOK")
                }}
                className="h-9 w-full rounded-md border border-border bg-surface px-3 text-xs font-bold text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              >
                <option value="PRINT_LOG">Print Console Log</option>
                <option value="WEBHOOK">HTTP Webhook Trigger</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                Job Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. backup-db"
                className="h-9 w-full rounded-md border border-border bg-surface px-3 text-xs text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {jobType === "WEBHOOK" ? (
              <div className="animate-fade-in pb-2">
                <WebhookConfigurator
                  url={url}
                  setUrl={setUrl}
                  httpMethod={httpMethod}
                  setHttpMethod={setHttpMethod}
                  headers={headers}
                  setHeaders={setHeaders}
                  payload={payload}
                  setPayload={setPayload}
                />
              </div>
            ) : (
              <div className="space-y-1.5 animate-fade-in">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                  Log Message
                </label>
                <input
                  type="text"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Starting database backup..."
                  className="h-9 w-full rounded-md border border-border bg-surface px-3 text-xs text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                Schedule Pattern
              </label>
              <input
                type="text"
                required
                value={cronString}
                onChange={(e) => setCronString(e.target.value)}
                placeholder="e.g. */15 * * * *"
                className="h-9 w-full rounded-md border border-border bg-surface px-3 text-xs font-mono text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Inline CronBuilder helper */}
            <div className="pt-1.5">
              <CronBuilder
                onExpressionChange={(cron) => setCronString(cron)}
                className="p-4 border border-border/80 shadow-none lg:col-span-1"
              />
            </div>

            {/* Notification Toggles */}
            <div className="border-t border-border/60 pt-4 mt-2 space-y-3">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                Discord Alerts (Notification Channel)
              </label>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-6 bg-surface-elevated/40 border border-border/50 rounded-lg p-3">
                <label className="flex items-center gap-2 text-xs text-text-primary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={notifyOnFailure}
                    onChange={(e) => setNotifyOnFailure(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                  />
                  <span>Notify on Failure</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-text-primary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={notifyOnSuccess}
                    onChange={(e) => setNotifyOnSuccess(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                  />
                  <span>Notify on Success</span>
                </label>
              </div>

              {/* Informative notice about global settings channel routing */}
              <div className="text-[10px] font-medium leading-relaxed rounded-md border p-2.5 flex items-start gap-2 bg-canvas/20 border-border/60">
                {hasWebhook === null ? (
                  <span className="text-text-muted">Checking notification channels...</span>
                ) : hasWebhook ? (
                  <>
                    <span className="text-success font-bold shrink-0">✓</span>
                    <span className="text-text-secondary">
                      Alerts route to: <code className="text-[9px] font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded select-all">{webhookDestination.startsWith("https://") ? webhookDestination.split("/").slice(0, 6).join("/") + "/••••••••" : webhookDestination}</code> (configured in Settings).
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-warning font-bold shrink-0">⚠️</span>
                    <span className="text-warning">
                      No Webhook configured. Go to <strong>Settings</strong> to add your Discord Webhook URL.
                    </span>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-border/60 p-4 md:p-5 bg-canvas/30 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary px-4 py-2 text-xs font-bold cursor-pointer transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-job-form"
            disabled={loading}
            className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white px-5 text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Spinner size="sm" className="border-t-white" />
            ) : (
              "Schedule Trigger Job"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
