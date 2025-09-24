import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LandingPage from './pages/landing/page'
import ProfilePage from './pages/profile/page'
import CreateGistPage from './pages/create-gist/page'
import GistDetailPage from './pages/gist-detail/page'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-gist" element={<CreateGistPage />} />
          <Route path="/gist/:gistId" element={<GistDetailPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
