import HomePage from './pages/HomePage.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  )
}
