import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import LandingPage from './pages/landing/page'

function App() {
  return (
    <AuthProvider>
      <LandingPage />
    </AuthProvider>
  )
}

export default App
