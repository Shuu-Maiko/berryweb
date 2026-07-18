import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppShell } from "./components/layout/AppShell"
import { DemoPage } from "./components/DemoPage"
import { LoginPage } from "./components/auth/LoginPage"
import { SignupPage } from "./components/auth/SignupPage"
import { OAuthRedirectHandler } from "./components/auth/OAuthRedirectHandler"
import { RealDashboard } from "./components/dashboard/RealDashboard"
import { LandingPage } from "./components/LandingPage"

// Private Route Guard (Requires authentication)
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

// Public Route Guard (Prevents logged-in users from accessing login/signup)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes protected from logged-in users */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* OAuth Redirect Handler */}
        <Route path="/oauth2/redirect" element={<OAuthRedirectHandler />} />

        {/* Protected Dashboard Console */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <RealDashboard />
            </PrivateRoute>
          }
        />

        {/* Demo View */}
        <Route
          path="/demo"
          element={
            <AppShell>
              <DemoPage />
            </AppShell>
          }
        />

        {/* Fallback all invalid routes to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
