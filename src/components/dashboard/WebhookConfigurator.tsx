import { Trash2, Plus, Server, Key, FileJson, Info } from "lucide-react"

export interface WebhookHeader {
  key: string
  value: string
}

interface WebhookConfiguratorProps {
  url: string
  setUrl: (url: string) => void
  httpMethod: string
  setHttpMethod: (method: string) => void
  headers: WebhookHeader[]
  setHeaders: (headers: WebhookHeader[]) => void
  payload: string
  setPayload: (payload: string) => void
  className?: string
}

export function WebhookConfigurator({
  url,
  setUrl,
  httpMethod,
  setHttpMethod,
  headers,
  setHeaders,
  payload,
  setPayload,
  className = ""
}: WebhookConfiguratorProps) {
  
  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }])
  }

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  const updateHeader = (index: number, field: "key" | "value", val: string) => {
    const newHeaders = [...headers]
    newHeaders[index][field] = val
    setHeaders(newHeaders)
  }

  const showPayload = httpMethod !== "GET" && httpMethod !== "DELETE"

  return (
    <div className={`space-y-7 ${className}`}>
      {/* Unified URL & Method Input */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5 ml-1">
          <Server className="h-3.5 w-3.5 text-primary" /> Target Endpoint
        </label>
        <div className="flex rounded-xl border border-border/70 shadow-sm bg-surface overflow-hidden focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300">
          <select
            value={httpMethod}
            onChange={(e) => setHttpMethod(e.target.value)}
            className="bg-canvas/50 text-[11px] font-extrabold px-3 py-2.5 border-r border-border/60 focus:outline-none cursor-pointer appearance-none text-center min-w-[85px] tracking-widest"
            style={{ 
              color: httpMethod === 'GET' ? '#10b981' : 
                     httpMethod === 'POST' ? '#3b82f6' : 
                     httpMethod === 'DELETE' ? '#ef4444' : '#f59e0b' 
            }}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.yourdomain.com/v1/trigger"
            className="flex-1 bg-transparent px-4 py-2.5 text-xs text-text-primary placeholder-text-muted focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* Headers Editor - Seamless Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5 text-amber-500" /> HTTP Headers
          </label>
          <button
            type="button"
            onClick={addHeader}
            className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary-hover bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-md transition-all shadow-sm"
          >
            <Plus className="h-3 w-3" /> Add Header
          </button>
        </div>
        
        {headers.length === 0 ? (
          <div className="text-[11px] text-text-muted/70 italic bg-canvas/30 border border-border/40 rounded-xl p-3 text-center shadow-inner">
            No custom headers configured.
          </div>
        ) : (
          <div className="border border-border/70 rounded-xl overflow-hidden shadow-sm bg-surface transition-all">
            {headers.map((h, i) => (
              <div key={i} className="flex items-center border-b border-border/60 last:border-0 group relative bg-surface hover:bg-surface-elevated transition-colors duration-200">
                <input
                  type="text"
                  placeholder="Header Key"
                  value={h.key}
                  onChange={(e) => updateHeader(i, "key", e.target.value)}
                  className="h-10 flex-[0.8] bg-transparent px-4 text-xs font-mono text-text-primary placeholder-text-muted/50 focus:bg-primary/5 focus:outline-none transition-colors border-r border-border/60"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={h.value}
                  onChange={(e) => updateHeader(i, "value", e.target.value)}
                  className="h-10 flex-[1.2] bg-transparent px-4 text-xs font-mono text-text-primary placeholder-text-muted/50 focus:bg-primary/5 focus:outline-none transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => removeHeader(i)}
                  className="absolute right-2 p-1.5 text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-all bg-surface shadow-sm border border-border/50 hover:bg-error/10 hover:border-error/30 rounded-lg scale-95 group-hover:scale-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payload Editor - Dark Code Block */}
      {showPayload ? (
        <div className="space-y-2 animate-fade-in">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5 ml-1">
            <FileJson className="h-3.5 w-3.5 text-purple-500" /> JSON Payload
          </label>
          <div className="relative rounded-xl border border-neutral-800 overflow-hidden shadow-inner bg-[#0a0a0a] focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300">
             <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest text-primary/70 bg-primary/10 border border-primary/20 pointer-events-none select-none">
                JSON
             </div>
             <textarea
               value={payload}
               onChange={(e) => setPayload(e.target.value)}
               placeholder={'{\n  "status": "success",\n  "event": "trigger"\n}'}
               className="w-full min-h-[140px] bg-transparent p-4 pr-12 text-[13px] font-mono text-emerald-400 placeholder-neutral-700 focus:outline-none resize-y leading-relaxed"
               style={{ tabSize: 2 }}
               spellCheck={false}
             />
          </div>
          <p className="text-[10px] text-text-muted/70 flex items-center gap-1.5 mt-1.5 ml-1">
            <Info className="h-3 w-3" />
            Payload will be automatically minified and stringified.
          </p>
        </div>
      ) : (
        <div className="bg-canvas/40 border border-border/50 rounded-xl p-4 flex items-start gap-3 animate-fade-in shadow-inner">
          <div className="bg-surface rounded-lg p-1.5 shadow-sm border border-border/50 shrink-0">
            <Info className="h-4 w-4 text-text-secondary" />
          </div>
          <p className="text-[11.5px] text-text-secondary leading-relaxed pt-0.5">
            Payloads are typically not supported or recommended for <strong className="text-text-primary font-mono bg-surface-elevated px-1 py-0.5 rounded border border-border/50">{httpMethod}</strong> requests. This field is disabled to prevent firewall and routing issues.
          </p>
        </div>
      )}
    </div>
  )
}
