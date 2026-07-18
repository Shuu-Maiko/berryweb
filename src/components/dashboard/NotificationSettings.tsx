import { useState, useEffect } from "react"
import { Bell, Trash2, Plus, ShieldAlert, Check, HelpCircle, Key } from "lucide-react"
import { notificationService } from "../../services/notification.service"
import type { NotificationChannel } from "../../types/notification.types"
import { Spinner } from "../ui/Spinner"

export function NotificationSettings() {
  const [channels, setChannels] = useState<NotificationChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const [channelType, setChannelType] = useState<"DISCORD">("DISCORD")
  const [destination, setDestination] = useState("")
  const [validationError, setValidationError] = useState("")

  useEffect(() => {
    fetchChannels()
  }, [])

  const fetchChannels = async () => {
    setLoading(true)
    setErrorMsg("")
    try {
      const data = await notificationService.listChannels()
      setChannels(data)
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load notification settings.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")
    setErrorMsg("")
    setSuccessMsg("")

    const prefix = "https://discord.com/api/webhooks/"
    if (!destination.trim().startsWith(prefix)) {
      setValidationError(`Discord Webhook URL must begin with: ${prefix}`)
      return
    }

    setSubmitting(true)
    try {
      const newChannel = await notificationService.createChannel({
        channelType,
        destination: destination.trim(),
      })
      setChannels((prev) => [...prev, newChannel])
      setDestination("")
      setSuccessMsg("Webhook integration added successfully!")
      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add webhook integration.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteChannel = async (id: number) => {
    if (!confirm("Are you sure you want to delete this webhook channel?")) return
    setErrorMsg("")
    setSuccessMsg("")
    try {
      await notificationService.deleteChannel(id)
      setChannels((prev) => prev.filter((ch) => ch.id !== id))
      setSuccessMsg("Webhook integration removed.")
      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete webhook integration.")
    }
  }

  const maskDestination = (url: string) => {
    const prefix = "https://discord.com/api/webhooks/"
    if (url.startsWith(prefix)) {
      const parts = url.slice(prefix.length).split("/")
      if (parts.length >= 2) {
        return `${prefix}${parts[0]}/••••••••••••••••`
      }
    }
    return url
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-border/60 pb-5">
        <h1 className="font-heading text-lg font-bold text-text-primary uppercase tracking-wider">
          Notification Settings
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Configure destinations to receive asynchronous job execution alert notifications.
        </p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Container */}
        <div className="lg:col-span-1 bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-heading text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" /> Add Webhook
          </h3>

          <form onSubmit={handleAddChannel} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                Channel Type
              </label>
              <select
                value={channelType}
                onChange={(e) => setChannelType(e.target.value as "DISCORD")}
                disabled
                className="h-9 w-full rounded-md border border-border bg-surface px-3 text-xs font-bold text-text-primary focus:outline-none opacity-60 cursor-not-allowed"
              >
                <option value="DISCORD">Discord Webhook</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                Webhook URL
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value)
                  if (validationError) setValidationError("")
                }}
                placeholder="https://discord.com/api/webhooks/..."
                className="h-9 w-full rounded-md border border-border bg-surface px-3 text-xs text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 font-mono"
              />
              {validationError && (
                <span className="text-[10px] font-bold text-error block animate-fade-in">
                  {validationError}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white px-4 text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer shadow-primary/25 hover:scale-[1.02] active:scale-95"
            >
              {submitting ? (
                <Spinner size="sm" className="border-t-white" />
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Integration</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-border/60">
            <div className="flex gap-2 p-3 bg-surface-elevated/40 rounded-lg border border-border/50 text-[10px] text-text-muted font-medium leading-relaxed">
              <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                Add your Discord webhook URL once. Alerts configured at the job level will route successes/failures directly to this channel.
              </div>
            </div>
          </div>
        </div>

        {/* Channels List */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[300px]">
          <div className="border-b border-border/60 p-4 bg-surface shrink-0">
            <h3 className="font-heading text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> Active Webhook Channels
            </h3>
          </div>

          <div className="flex-1 p-5">
            {loading ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center gap-3">
                <Spinner size="lg" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider animate-pulse">Loading Channels...</span>
              </div>
            ) : channels.length === 0 ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center gap-3 text-center border-2 border-dashed border-border/60 rounded-xl bg-canvas/30 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
                  <Bell className="h-6 w-6" />
                </div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">No Webhooks Configured</h4>
                <p className="text-[10px] text-text-muted max-w-sm mt-0.5 font-medium">
                  Integrate Discord webhooks on the left to receive success/failure triggers for your scheduled jobs.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {channels.map((ch) => (
                  <div
                    key={ch.id}
                    className="flex items-center justify-between border border-border/70 rounded-xl p-4 bg-canvas/20 shadow-sm hover:border-border transition-all animate-scale-in"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10 text-info">
                        <Key className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-extrabold text-info uppercase tracking-widest leading-none">
                          {ch.channelType} Channel
                        </span>
                        <span className="text-xs font-mono text-text-primary truncate font-bold mt-1 max-w-[280px] sm:max-w-md md:max-w-lg">
                          {maskDestination(ch.destination)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteChannel(ch.id)}
                      className="rounded-lg p-2 text-text-muted hover:bg-error/10 hover:text-error transition-all duration-150 cursor-pointer shrink-0"
                      title="Remove Webhook"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
