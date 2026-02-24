import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import Practice from './pages/Practice'
import Assessments from './pages/Assessments'
import Resources from './pages/Resources'
import Profile from './pages/Profile'
import Analyze from './pages/Analyze'
import Results from './pages/Results'
import History from './pages/History'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/results" element={<AppShell />}>
        <Route index element={<Results />} />
      </Route>
      <Route path="/dashboard/*" element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="analyze" element={<Analyze />} />
        <Route path="history" element={<History />} />
        <Route path="practice" element={<Practice />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="resources" element={<Resources />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

