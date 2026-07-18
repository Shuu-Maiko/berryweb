import { useState } from "react"
import { authService } from "../../services/auth.service"
import { Terminal, ShieldCheck, Mail, Lock, LogIn } from "lucide-react"
import { GoogleIcon } from "../ui/icons/GoogleIcon"
import { Spinner } from "../ui/Spinner"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    try {
      await authService.login(email, password)
      window.location.href = "/dashboard"
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = authService.getGoogleOAuthUrl()
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm animate-pulse-dot">
            <Terminal className="h-5 w-5" strokeWidth={2.5} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-xl font-extrabold text-text-primary font-heading uppercase tracking-wider">
          Sign in to Berry
        </h2>
        <p className="mt-2 text-center text-xs text-text-muted">
          Secure, automated task scheduling platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-6 border border-border rounded-xl shadow-sm sm:px-10">
          {errorMsg && (
            <div className="mb-4 rounded-lg bg-error-bg border border-error/15 p-3 text-xs font-bold text-error flex items-center gap-2 animate-fade-in">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-surface pl-10 pr-3 text-xs text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-surface pl-10 pr-3 text-xs text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <Spinner size="sm" className="border-t-white" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4" /> Sign In
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface px-2 text-text-muted font-semibold">Or continue with</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleGoogleLogin}
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-xs font-bold text-text-secondary hover:text-text-primary transition-all cursor-pointer shadow-xs"
              >
                <GoogleIcon className="h-4 w-4" />
                <span>Google Single Sign-On</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-xs text-text-muted">
              New to Berry?{" "}
              <a href="/signup" className="font-bold text-primary hover:underline">
                Create account
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
