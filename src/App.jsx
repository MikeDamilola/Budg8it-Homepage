import HomePage from './pages/HomePage.jsx'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage.jsx'
import SignInPage from './pages/SignInPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<DashboardPage />} />
        <Route path="/wallet" element={<DashboardPage />} />
        <Route path="/transactions" element={<DashboardPage />} />
        <Route path="/settings" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
