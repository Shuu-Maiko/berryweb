import { useState } from "react"
import { ChevronDown, SlidersHorizontal, Plus } from "lucide-react"

// Dashboard sub-components
import { JobRunsCard } from "./dashboard/JobRunsCard"
import { PerformanceChart } from "./dashboard/PerformanceChart"
import { ConcurrencyCard } from "./dashboard/ConcurrencyCard"
import { FailuresCard } from "./dashboard/FailuresCard"
import { JobsHealthCard } from "./dashboard/JobsHealthCard"
import { JobsTable } from "./dashboard/JobsTable"
import { AuditLogCard } from "./dashboard/AuditLogCard"

// Utility sub-components
import { CronBuilder } from "./dashboard/CronBuilder"
import { ConsoleStreamer } from "./dashboard/ConsoleStreamer"
import { WebhookAlerts } from "./dashboard/WebhookAlerts"
import { ResourceGauges } from "./dashboard/ResourceGauges"

// Interaction overlays
import { CreateJobDrawer } from "./dashboard/CreateJobDrawer"
import { JobDetailsPanel } from "./dashboard/JobDetailsPanel"
import { WebhookConfigurator } from "./dashboard/WebhookConfigurator"
import type { WebhookHeader } from "./dashboard/WebhookConfigurator"
import type { CronJobItem } from "./dashboard/types"

// Auth previews
import { LoginPage } from "./auth/LoginPage"
import { SignupPage } from "./auth/SignupPage"

function WebhookConfiguratorDemo() {
  const [method, setMethod] = useState("POST")
  const [url, setUrl] = useState("https://api.example.com/v1/trigger")
  const [headers, setHeaders] = useState<WebhookHeader[]>([{ key: "Content-Type", value: "application/json" }])
  const [payload, setPayload] = useState('{\n  "hello": "world"\n}')

  return (
    <div className="border border-border rounded-xl bg-surface p-6 shadow-sm overflow-hidden flex flex-col justify-between h-full">
      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded self-start mb-4">WebhookConfigurator Component</span>
      <WebhookConfigurator
        url={url}
        setUrl={setUrl}
        httpMethod={method}
        setHttpMethod={setMethod}
        headers={headers}
        setHeaders={setHeaders}
        payload={payload}
        setPayload={setPayload}
        className="flex-1"
      />
    </div>
  )
}

export function DemoPage() {
  const selectedRange = "Last 24 Hours (Today)"
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<CronJobItem | null>(null)

  return (
    <div className="space-y-6">
      {/* --- DASHBOARD HEADER --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary shadow-sm hover:bg-surface-elevated cursor-pointer">
            <span className="text-text-muted">Changes:</span>
            <span>{selectedRange}</span>
            <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
          </div>
          <span className="text-xs text-text-muted">Last sync: Just now</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white px-3.5 py-1.5 text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Job</span>
          </button>

          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm hover:bg-surface-elevated hover:text-text-primary cursor-pointer">
            <SlidersHorizontal className="h-3.5 w-3.5 text-text-muted" />
            <span>Manage layout</span>
          </button>
        </div>
      </div>

      {/* --- DASHBOARD GRID WORKSPACE --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ================= LEFT COLUMN: DATA VIZ ================= */}
        <div className="space-y-6 lg:col-span-6 xl:col-span-6">
          <JobRunsCard />
          <PerformanceChart />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <ConcurrencyCard />
            <FailuresCard />
          </div>
        </div>

        {/* ================= RIGHT COLUMN: CRON SCHEDULER ================= */}
        <div className="space-y-6 lg:col-span-6 xl:col-span-6">
          <JobsHealthCard />
          <JobsTable
            onSelectJob={(job) => {
              setSelectedJob(job)
              setIsDetailsOpen(true)
            }}
          />
          <AuditLogCard />
        </div>
      </div>

      {/* ================= HORIZONTAL DIVIDER ================= */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border/70" />
        </div>
        <div className="relative flex justify-start">
          <span className="bg-canvas pr-4 text-xs font-bold uppercase tracking-widest text-text-muted">
            Interactive Utility Components
          </span>
        </div>
      </div>

      {/* ================= SECTION 2: STANDALONE WIDGETS SECTION ================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CronBuilder />
          <WebhookConfiguratorDemo />
        </div>
        <ConsoleStreamer />
        <WebhookAlerts />
        <ResourceGauges />
      </div>

      {/* ================= HORIZONTAL DIVIDER ================= */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border/70" />
        </div>
        <div className="relative flex justify-start">
          <span className="bg-canvas pr-4 text-xs font-bold uppercase tracking-widest text-text-muted">
            Authentication Screens Preview
          </span>
        </div>
      </div>

      {/* ================= SECTION 3: AUTH PREVIEWS ================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-border rounded-xl bg-surface p-6 shadow-sm overflow-hidden flex flex-col justify-between max-h-[600px]">
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded self-start mb-4">LoginPage Component</span>
          <div className="border border-border/40 rounded-lg overflow-y-auto max-h-[500px]">
            <LoginPage />
          </div>
        </div>

        <div className="border border-border rounded-xl bg-surface p-6 shadow-sm overflow-hidden flex flex-col justify-between max-h-[600px]">
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded self-start mb-4">SignupPage Component</span>
          <div className="border border-border/40 rounded-lg overflow-y-auto max-h-[500px]">
            <SignupPage />
          </div>
        </div>
      </div>

      {/* ================= POPUP MODALS / DRAWERS ================= */}
      <CreateJobDrawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={(newJob) => {
          console.log("Simulating creation of new job config:", newJob)
        }}
      />

      <JobDetailsPanel
        job={selectedJob}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false)
          setSelectedJob(null)
        }}
        onTrigger={() => {
          console.log(`Simulating manual trigger run on job: ${selectedJob?.name}`)
        }}
        onToggleStatus={() => {
          console.log(`Simulating schedule status toggle on job: ${selectedJob?.name}`)
        }}
      />
    </div>
  )
}
