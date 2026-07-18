import { useState, useEffect } from "react"
import { AppShell } from "./components/layout/AppShell"
import { DemoPage } from "./components/DemoPage"
import { LoginPage } from "./components/auth/LoginPage"
import { SignupPage } from "./components/auth/SignupPage"
import { OAuthRedirectHandler } from "./components/auth/OAuthRedirectHandler"
import { RealDashboard } from "./components/dashboard/RealDashboard"
import { LandingPage } from "./components/LandingPage"

const getInitialRoute = () => {
  const path = window.location.pathname
  if (path === "/oauth2/redirect") return "oauth2-redirect"
  if (path.startsWith("/login")) return "login"
  if (path.startsWith("/signup")) return "signup"
  if (path.startsWith("/demo")) return "demo"
  if (path.startsWith("/dashboard")) return "dashboard"
  return "landing"
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute)

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentRoute(getInitialRoute())
    }

    handleNavigation()
    window.addEventListener("popstate", handleNavigation)
    // Listen for path redirects
    return () => window.removeEventListener("popstate", handleNavigation)
  }, [])

  if (currentRoute === "dashboard") {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      window.location.href = "/login"
      return null
    }
    return <RealDashboard />
  }

  if (["login", "signup"].includes(currentRoute)) {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (isAuthenticated) {
      window.location.href = "/dashboard"
      return null
    }
  }

  switch (currentRoute) {
    case "landing":
      return <LandingPage />
    case "login":
      return <LoginPage />
    case "signup":
      return <SignupPage />
    case "oauth2-redirect":
      return <OAuthRedirectHandler />
    case "demo":
      return (
        <AppShell>
          <DemoPage />
        </AppShell>
      )
    default:
      return <LandingPage />
  }
}
