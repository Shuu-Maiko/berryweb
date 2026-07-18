import { useState } from "react"
import { AppShell } from "../layout/AppShell"
import { Plus } from "lucide-react"
import { EmptyState } from "./EmptyState"
import { JobsRegistryTable } from "./JobsRegistryTable"
import { CreateJobModal } from "./CreateJobModal"
import { JobDetailsModal } from "./JobDetailsModal"
import { NotificationSettings } from "./NotificationSettings"
import { useJobs } from "../../hooks/useJobs"
import { useDisclosure } from "../../hooks/useDisclosure"

export function RealDashboard() {
  const { jobs, loading, refreshJobs, deleteJob } = useJobs()
  const { isOpen: isCreateOpen, onOpen: openCreate, onClose: closeCreate } = useDisclosure()
  const [detailsJobId, setDetailsJobId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("Dashboard")

  const handleDelete = async (secureJobId: string) => {
    if (!confirm("Are you sure you want to delete this job trigger?")) return
    await deleteJob(secureJobId)
  }

  const renderContent = () => {
    if (activeTab === "Dashboard") {
      return (
        <div className="space-y-6 font-sans animate-fade-in">
          {/* --- HEADER --- */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
            <div>
              <h1 className="font-heading text-lg font-bold text-text-primary uppercase tracking-wider">
                Job Scheduling Console
              </h1>
              <p className="text-xs text-text-muted mt-1">
                Create automated API endpoint invocations and manage active schedulers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white px-3.5 py-1.5 text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95 shadow-primary/25"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Job</span>
              </button>
            </div>
          </div>

          {/* --- WORKSPACE --- */}
          <div className="w-full">
            {loading ? (
              <div className="rounded-xl border border-border bg-surface p-12 text-center text-text-muted shadow-sm">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Loading registry...</span>
                </div>
              </div>
            ) : jobs.length === 0 ? (
              <EmptyState onCreateClick={openCreate} />
            ) : (
              <JobsRegistryTable jobs={jobs} onDelete={handleDelete} onInfo={(id) => setDetailsJobId(id)} />
            )}
          </div>
        </div>
      )
    }

    if (activeTab === "Settings") {
      return <NotificationSettings />
    }

    return null
  }

  return (
    <AppShell currentTab={activeTab} onTabSelect={setActiveTab}>
      {renderContent()}

      {/* ================= CREATE JOB MODAL ================= */}
      <CreateJobModal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onSuccess={refreshJobs}
      />
      
      {/* ================= JOB DETAILS MODAL ================= */}
      <JobDetailsModal
        secureJobId={detailsJobId}
        onClose={() => setDetailsJobId(null)}
      />
    </AppShell>
  )
}
