import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Activity, Clock, CheckCircle, Zap, Code, ShieldCheck } from "lucide-react"



export function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()
  
  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true")
  }, [])

  const navigateToApp = () => {
    navigate(isAuthenticated ? "/dashboard" : "/login")
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      
      {/* Background Grid - Harsh Lines */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-grid-mesh opacity-20" />

      {/* NAVBAR: Brutal */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-white/20 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 flex items-center justify-center bg-emerald-500 shadow-brutal border-2 border-emerald-500">
              <span className="text-lg font-black text-black leading-none">B</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase">
              BERRY
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest uppercase text-white/70">
            <a href="#overview" className="hover:text-emerald-500 hover:bg-white/5 px-2 py-1 transition-none">Docs</a>
            <a href="#pricing" className="hover:text-emerald-500 hover:bg-white/5 px-2 py-1 transition-none">Pricing</a>
          </nav>

          <div className="flex items-center gap-6">
            <button
              onClick={navigateToApp}
              className="flex h-10 items-center justify-center gap-2 border-2 border-emerald-500 bg-emerald-500 px-6 text-sm font-black text-black uppercase tracking-widest shadow-brutal hover:bg-black hover:text-emerald-500 transition-none"
            >
              {isAuthenticated ? "DASHBOARD" : "LOGIN"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 pt-24 pb-20 max-w-[1400px] mx-auto px-6 text-left flex flex-col items-start border-x-2 border-white/10 min-h-[70vh] justify-center">
        
        <div className="inline-flex items-center gap-3 border-2 border-emerald-500 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-500 shadow-brutal mb-10">
          <Zap className="h-4 w-4 fill-emerald-500" />
          <span className="uppercase tracking-widest">BERRY ENGINE</span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black tracking-tighter text-white leading-[0.9] uppercase mb-8">
          BERRY
        </h1>

        <p className="max-w-3xl text-xl md:text-3xl text-emerald-500 font-bold leading-tight mb-12 uppercase">
          A simple, fast, distributed Cron job engine.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch gap-6 w-full sm:w-auto">
          <button
            onClick={navigateToApp}
            className="flex h-16 w-full sm:w-auto items-center justify-center gap-3 border-2 border-emerald-500 bg-emerald-500 px-10 text-lg font-black text-black uppercase tracking-widest shadow-brutal hover:bg-black hover:text-emerald-500 transition-none"
          >
            START BUILDING
            <ArrowRight className="h-5 w-5" />
          </button>
          <button className="flex h-16 w-full sm:w-auto items-center justify-center gap-3 border-2 border-white bg-white px-10 text-lg font-black text-black uppercase tracking-widest shadow-brutal-white hover:bg-black hover:text-white hover:border-white transition-none">
            READ DOCS
          </button>
        </div>
      </main>



      {/* TWO-COLUMN CODE & UI SHOWCASE */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-6 py-24 border-x-2 border-white/10">
        <div className="border-2 border-white/20 bg-black shadow-brutal-white overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left: Code Editor Mockup */}
          <div className="lg:w-1/2 p-8 border-b-2 lg:border-b-0 lg:border-r-2 border-white/20 relative">
            <div className="absolute top-0 left-0 bg-white text-black text-xs font-black px-3 py-1 uppercase tracking-widest border-b-2 border-r-2 border-white/20">
              POST /api/v1/jobs
            </div>
            
            <pre className="mt-8 text-base font-mono leading-loose overflow-x-auto text-white">
              <code className="text-emerald-400">const</code> response = <code className="text-emerald-400">await</code> fetch(<code className="text-white">'https://api.berry.sh/v1/jobs'</code>, {'{'}
              <br/>  method: <code className="text-white">'POST'</code>,
              <br/>  headers: {'{'} <code className="text-white">'Authorization'</code>: <code className="text-white">'Bearer YOUR_KEY'</code> {'}'},
              <br/>  body: JSON.stringify({'{'}
              <br/>    <span className="text-gray-400">name</span>: <code className="text-emerald-500">'sync_billing_data'</code>,
              <br/>    <span className="text-gray-400">cronSchedule</span>: <code className="text-emerald-500">'*/15 * * * *'</code>,
              <br/>    <span className="text-gray-400">targetEndpoint</span>: <code className="text-emerald-500">'https://api.myapp.com/sync'</code>,
              <br/>    <span className="text-gray-400">notifyOnFailure</span>: <code className="text-emerald-500">true</code>
              <br/>  {'}'})
              <br/>{'}'});
            </pre>
          </div>

          {/* Right: UI Mockup */}
          <div className="lg:w-1/2 p-8 relative flex flex-col justify-center bg-[#0a0a0a]">
             <div className="absolute top-0 right-0 bg-emerald-500 text-black text-xs font-black px-3 py-1 uppercase tracking-widest border-b-2 border-l-2 border-emerald-500">
              LIVE REGISTRY
            </div>

            <div className="mt-8 space-y-4 w-full">
              {[
                { name: "SYNC_BILLING_DATA", cron: "*/15 * * * *", status: "ACTIVE" },
                { name: "CLEAR_CACHE_NODES", cron: "0 0 * * *", status: "ACTIVE" },
                { name: "GENERATE_REPORTS", cron: "0 8 * * 1-5", status: "PAUSED" }
              ].map((job, idx) => (
                <div key={idx} className="border-2 border-white/20 bg-black p-4 flex items-center justify-between hover:border-emerald-500 hover:translate-x-2 transition-transform duration-75">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 border-2 ${job.status === 'ACTIVE' ? 'border-emerald-500 bg-emerald-500' : 'border-white/20 bg-white/10'}`}>
                      <Clock className={`h-5 w-5 ${job.status === 'ACTIVE' ? 'text-black' : 'text-white'}`} />
                    </div>
                    <div>
                      <div className="text-base font-black text-white">{job.name}</div>
                      <div className="text-xs text-emerald-500 font-bold mt-1">{job.cron}</div>
                    </div>
                  </div>
                  <div className={`text-xs font-black uppercase tracking-widest px-3 py-2 border-2 ${
                    job.status === 'ACTIVE' ? 'border-emerald-500 bg-emerald-500 text-black shadow-brutal' : 'border-white/20 text-white/50'
                  }`}>
                    {job.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENTO GRID */}
      <section className="relative z-10 py-24 border-y-2 border-white/20 bg-black">
        <div className="max-w-[1400px] mx-auto px-6">
          
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-16 border-b-2 border-white/20 pb-8">
            ENGINEERED FOR SCALE.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 border-2 border-white/20 bg-black p-8 group hover:border-emerald-500 hover:shadow-brutal transition-all duration-75 flex flex-col justify-between min-h-[300px]">
              <div className="h-16 w-16 border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center mb-8 shadow-brutal group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all duration-75">
                <Activity className="h-8 w-8 text-black" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white uppercase mb-4">JOBRUNR DISTRIBUTED SCHEDULER</h3>
                <p className="text-lg text-white/70 font-bold leading-relaxed max-w-xl">
                  POWERED BY JOBRUNR UNDER THE HOOD FOR HIGHLY SCALABLE, FAULT-TOLERANT BACKGROUND TASK PROCESSING AND SCHEDULING.
                </p>
              </div>
            </div>

            <div className="border-2 border-white/20 bg-black p-8 group hover:border-white hover:shadow-brutal-white transition-all duration-75 flex flex-col justify-between min-h-[300px]">
              <div className="h-16 w-16 border-2 border-white bg-white flex items-center justify-center mb-8 shadow-brutal-white group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all duration-75">
                <CheckCircle className="h-8 w-8 text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase mb-4">DISCORD NOTIFICATIONS</h3>
                <p className="text-base text-white/70 font-bold leading-relaxed">
                  CONFIGURE DISCORD WEBHOOK DESTINATIONS NATIVELY TO PING YOUR CHANNELS ON SUCCESS OR FAILURE EVENTS.
                </p>
              </div>
            </div>

            <div className="border-2 border-white/20 bg-black p-8 group hover:border-white hover:shadow-brutal-white transition-all duration-75 flex flex-col justify-between min-h-[300px]">
              <div className="h-16 w-16 border-2 border-white bg-white flex items-center justify-center mb-8 shadow-brutal-white group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all duration-75">
                <ShieldCheck className="h-8 w-8 text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase mb-4">DUAL EXECUTION MODES</h3>
                <p className="text-base text-white/70 font-bold leading-relaxed">
                  CHOOSE BETWEEN DIRECT STDOUT "PRINT_LOG" TASKS OR FULL "WEBHOOK" API ENDPOINT DISPATCH RUNS.
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 border-2 border-white/20 bg-black p-8 group hover:border-emerald-500 hover:shadow-brutal transition-all duration-75 flex flex-col justify-between min-h-[300px]">
               <div className="h-16 w-16 border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center mb-8 shadow-brutal group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all duration-75">
                <Code className="h-8 w-8 text-black" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white uppercase mb-4">PAYLOADS & DETAILED RESPONSES</h3>
                <p className="text-lg text-white/70 font-bold leading-relaxed max-w-xl">
                  INSPECT EXACT HTTP STATUS CODES, RAW WEBHOOK RESPONSE BODIES, AND LATENCY METRICS CAPTURED FROM EXECUTIONS.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="relative z-10 py-24 border-b-2 border-white/20 bg-black">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-16 border-b-2 border-white/20 pb-8">
            PRICING.
          </h2>
          
          <div className="border-2 border-emerald-500 bg-emerald-500 p-10 shadow-brutal max-w-lg transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-75">
            <h3 className="text-4xl font-black text-black uppercase mb-2">FREE TIER</h3>
            <div className="text-6xl font-black text-black mb-8">$0<span className="text-2xl">/mo</span></div>
            
            <ul className="space-y-6 mb-10 text-black font-black text-lg uppercase tracking-widest">
              <li className="flex items-center gap-4"><CheckCircle className="h-6 w-6" /> 10 Jobs per person</li>
              <li className="flex items-center gap-4"><CheckCircle className="h-6 w-6" /> Discord Webhooks</li>
              <li className="flex items-center gap-4"><CheckCircle className="h-6 w-6" /> Sub-second Precision</li>
            </ul>
            
            <button
              onClick={navigateToApp}
              className="flex w-full h-16 items-center justify-center gap-3 border-4 border-black bg-black px-10 text-lg font-black text-emerald-500 uppercase tracking-widest shadow-brutal hover:bg-emerald-500 hover:text-black transition-none"
            >
              START FOR FREE
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ENGINE ANIMATION FOOTER */}
      <footer className="relative z-10 border-b-8 border-emerald-500 bg-black pt-24 pb-12">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          


          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t-2 border-white/20">
            <div className="flex items-center gap-4">
              <div className="h-6 w-6 bg-emerald-500 flex items-center justify-center border-2 border-emerald-500 shadow-brutal">
                <span className="text-xs font-black text-black">B</span>
              </div>
              <span className="font-black tracking-widest text-white text-lg uppercase">
                BERRY
              </span>
            </div>
            <div className="text-sm font-bold text-white/50 uppercase tracking-widest">
              © {new Date().getFullYear()} BERRY TECHNOLOGY. NO RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
