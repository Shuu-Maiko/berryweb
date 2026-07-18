import { useState } from "react"
import { Bell, Check } from "lucide-react"
import { cn } from "../../lib/utils"

export interface WebhookAlertsProps {
  initialSlack?: boolean
  initialEmail?: boolean
  initialWebhook?: boolean
  initialWebhookUrl?: string
  initialOnFail?: boolean
  initialOnLag?: boolean
  onSave?: (config: {
    slack: boolean
    email: boolean
    webhook: boolean
    url: string
    onFail: boolean
    onLag: boolean
  }) => void
  className?: string
}

export function WebhookAlerts({
  initialSlack = true,
  initialEmail = false,
  initialWebhook = true,
  initialWebhookUrl = "https://hooks.slack.com/services/T00/B00/X00",
  initialOnFail = true,
  initialOnLag = true,
  onSave,
  className,
}: WebhookAlertsProps) {
  const [alertSlack, setAlertSlack] = useState(initialSlack)
  const [alertEmail, setAlertEmail] = useState(initialEmail)
  const [alertWebhook, setAlertWebhook] = useState(initialWebhook)
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl)
  const [ruleOnFail, setRuleOnFail] = useState(initialOnFail)
  const [ruleOnLag, setRuleOnLag] = useState(initialOnLag)
  const [isTestingAlert, setIsTestingAlert] = useState(false)
  const [alertSuccessToast, setAlertSuccessToast] = useState(false)

  const handleTestAlert = () => {
    setIsTestingAlert(true)
    setTimeout(() => {
      setIsTestingAlert(false)
      setAlertSuccessToast(true)
      onSave?.({
        slack: alertSlack,
        email: alertEmail,
        webhook: alertWebhook,
        url: webhookUrl,
        onFail: ruleOnFail,
        onLag: ruleOnLag,
      })
      setTimeout(() => setAlertSuccessToast(false), 3000)
    }, 1500)
  }

  return (
    <div className={cn("rounded-xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between lg:col-span-6", className)}>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-text-primary flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" /> Webhook Alert Rules
          </h3>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Action Component</span>
        </div>

        <p className="text-xs text-text-muted mb-4">
          Configure alert rules to notify developers on Slack, Discord, or custom API endpoints immediately.
        </p>

        <div className="space-y-4">
          {/* Alert Channels */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-text-secondary block">Select Notification Channels</span>
            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={alertSlack}
                  onChange={(e) => setAlertSlack(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-border text-primary accent-primary"
                />
                Slack
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-border text-primary accent-primary"
                />
                Email
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={alertWebhook}
                  onChange={(e) => setAlertWebhook(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-border text-primary accent-primary"
                />
                Discord / Webhook
              </label>
            </div>
          </div>

          {/* Endpoint Webhook */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-secondary">Webhook Endpoint URL</label>
            <input
              type="text"
              value={webhookUrl}
              disabled={!alertWebhook}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-surface px-3 text-xs text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:opacity-40 disabled:pointer-events-none"
              placeholder="https://yourwebhook.com/alerts"
            />
          </div>

          {/* Alert Trigger Rules */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-text-secondary block">Condition Triggers</span>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 rounded-lg border border-border bg-canvas/30 px-3 py-2 text-xs font-semibold text-text-secondary cursor-pointer select-none hover:bg-surface-elevated transition-colors">
                <input
                  type="checkbox"
                  checked={ruleOnFail}
                  onChange={(e) => setRuleOnFail(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-border text-primary accent-primary"
                />
                On Execution Failure
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-border bg-canvas/30 px-3 py-2 text-xs font-semibold text-text-secondary cursor-pointer select-none hover:bg-surface-elevated transition-colors">
                <input
                  type="checkbox"
                  checked={ruleOnLag}
                  onChange={(e) => setRuleOnLag(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-border text-primary accent-primary"
                />
                On Schedule Lag (&gt;10s)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Test Trigger */}
      <div className="mt-5 border-t border-border/50 pt-4 flex items-center justify-between gap-4">
        <div className="text-[10px] text-text-muted font-medium max-w-[200px]">
          {alertSuccessToast ? (
            <span className="text-success font-bold flex items-center gap-1 animate-fade-in">
              <Check className="h-3.5 w-3.5" /> Test alert sent successfully!
            </span>
          ) : (
            "Save changes or dispatch a mock failure alert to test connections."
          )}
        </div>
        <button
          onClick={handleTestAlert}
          disabled={isTestingAlert}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white px-4 text-xs font-bold cursor-pointer transition-all shadow-sm disabled:opacity-50 disabled:pointer-events-none"
        >
          {isTestingAlert ? (
            <svg className="h-3.5 w-3.5 animate-spin-slow" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            "Save & Send Test Alert"
          )}
        </button>
      </div>
    </div>
  )
}
