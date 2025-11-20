import { Routes, Route, Navigate } from 'react-router-dom'
import ConfigPage from './pages/ConfigPage'
import OwnersPrefill from './pages/OwnersPrefill'
import OwnersEdit from './pages/OwnersEdit'
import OwnersList from './pages/OwnersList'
import OwnerDetails from './pages/OwnerDetails'
import OwnerEmailCompose from './pages/OwnerEmailCompose'
import TransitionToDirectors from './pages/TransitionToDirectors'
import DirectorsPrefill from './pages/DirectorsPrefill'
import DirectorsEdit from './pages/DirectorsEdit'
import DirectorsList from './pages/DirectorsList'
import DirectorDetails from './pages/DirectorDetails'
import DirectorEmailCompose from './pages/DirectorEmailCompose'
import VerificationMethod from './pages/VerificationMethod'
import Attestation from './pages/Attestation'
import DocumentUpload from './pages/DocumentUpload'
import Summary from './pages/Summary'
import RequireInit from './components/RequireInit'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<ConfigPage />} />
        <Route path="/config" element={<ConfigPage />} />
        <Route path="/owners/prefill" element={<RequireInit><OwnersPrefill /></RequireInit>} />
        <Route path="/owners/edit" element={<RequireInit><OwnersEdit /></RequireInit>} />
        <Route path="/owners" element={<RequireInit><OwnersList /></RequireInit>} />
        <Route path="/owners/:id" element={<RequireInit><OwnerDetails /></RequireInit>} />
        <Route path="/owners/:id/email" element={<RequireInit><OwnerEmailCompose /></RequireInit>} />
        <Route path="/transition-to-directors" element={<RequireInit><TransitionToDirectors /></RequireInit>} />
        <Route path="/directors/prefill" element={<RequireInit><DirectorsPrefill /></RequireInit>} />
        <Route path="/directors/edit" element={<RequireInit><DirectorsEdit /></RequireInit>} />
        <Route path="/directors" element={<RequireInit><DirectorsList /></RequireInit>} />
        <Route path="/directors/:id" element={<RequireInit><DirectorDetails /></RequireInit>} />
        <Route path="/directors/:id/email" element={<RequireInit><DirectorEmailCompose /></RequireInit>} />
        <Route path="/verification-method" element={<RequireInit><VerificationMethod /></RequireInit>} />
        <Route path="/attestation" element={<RequireInit><Attestation /></RequireInit>} />
        <Route path="/document-upload" element={<RequireInit><DocumentUpload /></RequireInit>} />
        <Route path="/summary" element={<RequireInit><Summary /></RequireInit>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App

