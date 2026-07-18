import { useState, useEffect } from "react"
import { Info, Activity, Clock, Server, CheckCircle2, XCircle } from "lucide-react"
import { Spinner } from "../ui/Spinner"
import { jobService } from "../../services/job.service"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"

interface JobDetailsModalProps {
  secureJobId: string | null
  onClose: () => void
}

export function JobDetailsModal({ secureJobId, onClose }: JobDetailsModalProps) {
  const [details, setDetails] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const [responses, setResponses] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"metrics" | "responses">("metrics")
  const [expandedResponseKey, setExpandedResponseKey] = useState<string | null>(null)

  const [notifyOnFailure, setNotifyOnFailure] = useState(false)
  const [notifyOnSuccess, setNotifyOnSuccess] = useState(false)
  const [updatingSettings, setUpdatingSettings] = useState(false)

  useEffect(() => {
    if (details) {
      setNotifyOnFailure(details.notifyOnFailure)
      setNotifyOnSuccess(details.notifyOnSuccess)
    }
  }, [details])

  const handleToggleSetting = async (type: "failure" | "success", value: boolean) => {
    if (!secureJobId) return

    // Optimistic update
    const prevFailure = notifyOnFailure
    const prevSuccess = notifyOnSuccess

    if (type === "failure") setNotifyOnFailure(value)
    else setNotifyOnSuccess(value)

    setUpdatingSettings(true)
    try {
      await jobService.updateJobSettings(secureJobId, {
        notifyOnFailure: type === "failure" ? value : prevFailure,
        notifyOnSuccess: type === "success" ? value : prevSuccess,
      })
    } catch (err: any) {
      // Revert state
      if (type === "failure") setNotifyOnFailure(prevFailure)
      else setNotifyOnSuccess(prevSuccess)
      alert("Failed to update notification settings.")
    } finally {
      setUpdatingSettings(false)
    }
  }

  useEffect(() => {
    if (!secureJobId) return

    const fetchData = async () => {
      setLoading(true)
      setErrorMsg("")
      try {
        const [detailsRes, historyRes, responsesRes] = await Promise.all([
          jobService.getJobDetails(secureJobId),
          jobService.getJobHistory(secureJobId),
          jobService.getJobResponses(secureJobId).catch(() => []) // Safely default to empty array on failure
        ])
        setDetails(detailsRes)
        const parseTime = (t: string) => new Date(t.endsWith('Z') ? t : t + 'Z').getTime()
        const sortedHistory = historyRes.sort((a: any, b: any) => parseTime(a.createdAt) - parseTime(b.createdAt))
        setHistory(sortedHistory)
        setResponses(responsesRes.sort((a: any, b: any) => parseTime(b.createdAt) - parseTime(a.createdAt)))
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load job details.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [secureJobId])

  if (!secureJobId) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Calculate dynamic Y-axis max to handle massive outliers (like server downtime)
  const rawDurations = history.map(r => r.durationMs).sort((a, b) => a - b)
  const p95 = rawDurations[Math.floor(rawDurations.length * 0.95)] || 1000
  const yMax = Math.max(p95 * 1.5, 5000) // Cap the chart visually at 1.5x the 95th percentile (min 5 seconds)

  // Format data for chart
  const chartData = history.map((run, i) => {
    // Append 'Z' to treat backend timestamps as UTC, fixing the timezone shift bug
    const timestamp = run.createdAt.endsWith('Z') ? run.createdAt : run.createdAt + 'Z'
    const d = new Date(timestamp)
    return {
      name: `Run ${i + 1}`,
      duration: run.durationMs, // Real duration for tooltip
      displayDuration: Math.min(run.durationMs, yMax), // Capped duration to prevent massive SVG rects
      state: run.state,
      date: d.toLocaleString(),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
      <div 
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={handleBackdropClick}
      />

      <div className="relative bg-surface border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-in transform transition-all duration-300 z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 p-4 md:p-5 shrink-0 bg-surface">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-heading text-lg font-bold text-text-primary uppercase tracking-wider leading-tight">
                {details?.name || "Loading Job..."}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">ID:</span>
                <span className="text-[11px] font-bold text-amber-500 font-mono tracking-tight">{secureJobId}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-elevated hover:text-text-primary transition-colors cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-8 bg-surface">
          {errorMsg && (
            <div className="rounded-lg bg-error-bg border border-error/15 p-3 text-xs font-bold text-error flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Spinner size="lg" />
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider animate-pulse">Loading Details...</span>
            </div>
          ) : details ? (
            <>
              {/* Stats Unified Layout */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-2">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    <Clock className="h-3.5 w-3.5 text-primary" /> Schedule
                  </div>
                  <div className="font-mono text-sm font-bold text-text-primary">
                    {details.cronExpression}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    <Server className="h-3.5 w-3.5 text-blue-500" /> Type
                  </div>
                  <div className="text-sm font-bold text-text-primary">
                    {details.jobType === "WEBHOOK" ? "HTTP Webhook" : "Print Log"}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Last Run
                  </div>
                  <div className="text-sm font-bold text-text-primary">
                    {details.lastRunTime ? new Date(details.lastRunTime.endsWith('Z') ? details.lastRunTime : details.lastRunTime + 'Z').toLocaleString() : "Never"}
                  </div>
                  {details.lastRunStatus && (
                    <div className="text-xs font-bold flex items-center gap-1">
                      Status: <span className={details.lastRunStatus === 'SUCCEEDED' ? 'text-success' : 'text-error'}>{details.lastRunStatus}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    <Activity className="h-3.5 w-3.5 text-purple-500" /> Next Run
                  </div>
                  <div className="text-sm font-bold text-text-primary">
                    {details.nextRunTime ? new Date(details.nextRunTime.endsWith('Z') ? details.nextRunTime : details.nextRunTime + 'Z').toLocaleString() : "Unknown"}
                  </div>
                </div>
              </div>

              {/* Target / Payload Info */}
              <div className="px-2 space-y-6">
                {/* Alert Notification Configurations */}
                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                    Discord Notification Alerts
                  </div>
                  <div className="flex flex-wrap gap-4 items-center rounded-lg border border-border/60 bg-surface-elevated/40 px-3 py-2 text-xs font-bold w-full">
                    <label className="flex items-center gap-2 text-text-primary cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={notifyOnFailure}
                        onChange={(e) => handleToggleSetting("failure", e.target.checked)}
                        disabled={updatingSettings}
                        className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer disabled:opacity-50"
                      />
                      <span>On Failure</span>
                    </label>
                    <div className="h-3.5 w-px bg-border/60" />
                    <label className="flex items-center gap-2 text-text-primary cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={notifyOnSuccess}
                        onChange={(e) => handleToggleSetting("success", e.target.checked)}
                        disabled={updatingSettings}
                        className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer disabled:opacity-50"
                      />
                      <span>On Success</span>
                    </label>
                    {updatingSettings && (
                      <span className="text-[9px] text-text-muted font-normal animate-pulse ml-auto">Saving...</span>
                    )}
                  </div>
                </div>

                {details.jobType === "WEBHOOK" && (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                        Target Endpoint
                      </div>
                      <div className="flex items-center rounded-lg border border-border/60 bg-surface-elevated px-3 py-2">
                        <span 
                          className="text-[11px] font-extrabold pr-3 border-r border-border/60 tracking-widest mr-3"
                          style={{ 
                            color: details.httpMethod === 'GET' ? '#10b981' : 
                                   details.httpMethod === 'POST' ? '#3b82f6' : 
                                   details.httpMethod === 'DELETE' ? '#ef4444' : '#f59e0b' 
                          }}
                        >
                          {details.httpMethod || "POST"}
                        </span>
                        <span className="text-xs font-bold text-text-primary font-mono">{details.url}</span>
                      </div>
                    </div>

                    {details.httpHeaders && Object.keys(details.httpHeaders).length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                          HTTP Headers
                        </div>
                        <div className="border border-border/70 rounded-xl overflow-hidden shadow-sm bg-canvas/30">
                          {Object.entries(details.httpHeaders).map(([key, val], i) => (
                            <div key={i} className="flex items-center border-b border-border/60 last:border-0">
                              <div className="flex-[0.8] px-4 py-2.5 text-xs font-mono text-text-secondary border-r border-border/60 bg-surface">
                                {key}
                              </div>
                              <div className="flex-[1.2] px-4 py-2.5 text-xs font-mono text-text-primary truncate">
                                {String(val)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                    {details.jobType === "WEBHOOK" ? "JSON Payload" : "Message Payload"}
                  </div>
                  {details.jobType === "WEBHOOK" ? (
                    <div className="relative rounded-xl border border-neutral-800 overflow-hidden shadow-inner bg-[#0a0a0a]">
                       <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest text-primary/70 bg-primary/10 border border-primary/20 pointer-events-none select-none">
                          JSON
                       </div>
                       <pre className="w-full bg-transparent p-4 text-[13px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                         {details.payload ? (
                           // Pretty print JSON if possible, else show raw
                           (() => {
                             try {
                               return JSON.stringify(JSON.parse(details.payload), null, 2)
                             } catch {
                               return details.payload
                             }
                           })()
                         ) : (
                           <span className="text-neutral-600 italic">No payload configured.</span>
                         )}
                       </pre>
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-text-primary bg-surface-elevated border border-border/60 rounded-lg p-3">
                      {details.message || "No message provided."}
                    </div>
                  )}
                </div>
              </div>

              {/* Tab Header for Metrics & Responses */}
              <div className="mt-4 pt-6 border-t border-border/60">
                <div className="flex items-center justify-between mb-6 border-b border-border/40 pb-3 px-2">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab("metrics")}
                      className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all cursor-pointer ${
                        activeTab === "metrics"
                          ? "border-primary text-text-primary"
                          : "border-transparent text-text-muted hover:text-text-secondary"
                      }`}
                    >
                      Metrics History
                    </button>
                    {details?.jobType === "WEBHOOK" && (
                      <button
                        type="button"
                        onClick={() => setActiveTab("responses")}
                        className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all cursor-pointer ${
                          activeTab === "responses"
                            ? "border-primary text-text-primary"
                            : "border-transparent text-text-muted hover:text-text-secondary"
                        }`}
                      >
                        Webhook Responses ({responses.length})
                      </button>
                    )}
                  </div>

                  {activeTab === "metrics" && (
                    <div className="hidden sm:flex items-center gap-4 text-xs font-bold">
                      <div className="flex items-center gap-1.5 text-text-primary">
                        <span className="w-2.5 h-2.5 rounded bg-success inline-block shadow-sm"></span> Success
                      </div>
                      <div className="flex items-center gap-1.5 text-text-primary">
                        <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block shadow-sm"></span> Pending
                      </div>
                      <div className="flex items-center gap-1.5 text-text-primary">
                        <span className="w-2.5 h-2.5 rounded bg-error inline-block shadow-sm"></span> Failed
                      </div>
                    </div>
                  )}
                </div>

                {activeTab === "metrics" ? (
                  <div className="h-[280px] w-full px-2">
                    {history.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#888888" vertical={false} strokeOpacity={0.2} />
                          <XAxis 
                            dataKey="time" 
                            tick={{ fontSize: 10, fill: '#888888', fontWeight: 600 }} 
                            axisLine={false} 
                            tickLine={false} 
                            minTickGap={20}
                            dy={10}
                          />
                          <YAxis 
                            width={60}
                            tick={{ fontSize: 10, fill: '#888888', fontWeight: 600 }} 
                            axisLine={false} 
                            tickLine={false} 
                            tickFormatter={(v) => `${v}ms`} 
                            dx={-5}
                            domain={[0, yMax]}
                          />
                          <Tooltip 
                            cursor={{ fill: 'rgba(136,136,136,0.1)' }}
                            contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px', padding: '10px 14px' }}
                            labelStyle={{ color: '#aaa', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}
                            formatter={(value: number, name: string, props: any) => [`${props.payload.duration} ms`, 'Duration']}
                            labelFormatter={(label, payload) => {
                              if (payload && payload.length > 0) {
                                return payload[0].payload.date
                              }
                              return label
                            }}
                          />
                          <Bar dataKey="displayDuration" radius={[3, 3, 0, 0]} maxBarSize={40} minPointSize={3}>
                            {chartData.map((entry, index) => {
                              let color = '#ef4444'
                              if (entry.state === 'SUCCEEDED') color = '#10b981'
                              else if (entry.state === 'ENQUEUED' || entry.state === 'PROCESSING') color = '#f59e0b'
                              return <Cell key={`cell-${index}`} fill={color} />
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-text-muted font-semibold uppercase tracking-wider">
                        No history available
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto px-2 space-y-2">
                    {responses.length === 0 ? (
                      <div className="text-center text-xs text-text-muted font-semibold uppercase tracking-wider py-12">
                        No webhook response logs captured yet.
                      </div>
                    ) : (
                      <div className="divide-y divide-border/60">
                        {responses.map((resp, i) => {
                          const isSuccess = resp.httpStatus >= 200 && resp.httpStatus < 300
                          const isExpanded = expandedResponseKey === resp.createdAt
                          const formattedTime = new Date(resp.createdAt.endsWith('Z') ? resp.createdAt : resp.createdAt + 'Z').toLocaleString()

                          return (
                            <div key={resp.createdAt || i} className="py-2.5 first:pt-0 last:pb-0">
                              <div 
                                onClick={() => setExpandedResponseKey(isExpanded ? null : resp.createdAt)}
                                className="flex items-center justify-between cursor-pointer group hover:bg-canvas/30 rounded-lg p-2 transition-all"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                                    isSuccess ? 'bg-success-bg text-success' : 'bg-error-bg text-error'
                                  }`}>
                                    HTTP {resp.httpStatus}
                                  </span>
                                  <span className="text-xs font-semibold text-text-primary truncate">
                                    {formattedTime}
                                  </span>
                                </div>
                                <span className="text-[10px] text-primary group-hover:underline font-bold">
                                  {isExpanded ? 'Collapse' : 'Inspect'}
                                </span>
                              </div>

                              {isExpanded && (
                                <div className="mt-2 p-3 rounded-lg border border-border/85 bg-surface-elevated/70 font-mono text-[10px] text-text-primary whitespace-pre-wrap break-all max-h-[220px] overflow-y-auto shadow-inner animate-slide-up leading-relaxed">
                                  {resp.responseBody || "Empty Response Body"}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
