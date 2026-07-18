import { useEffect } from "react"
import { Spinner } from "../ui/Spinner"

export function OAuthRedirectHandler() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    // The backend redirect might include a success param or we just assume success if we land here
    // But usually OAuth redirect means success if no error param.
    const error = urlParams.get("error")
    const token = urlParams.get("token")

    if (!error && token) {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("auth_token", token)
      window.location.href = window.location.origin + "/dashboard"
    } else {
      console.error("OAuth login failed")
      window.location.href = window.location.origin + "/login"
    }
  }, [])

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-4">
        {/* Modern clean spinner */}
        <Spinner size="lg" />
        <span className="text-xs font-bold text-text-secondary uppercase tracking-widest animate-pulse-dot">
          Authenticating with Google...
        </span>
      </div>
    </div>
  )
}
