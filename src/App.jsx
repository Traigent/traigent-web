import { Navigate, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import GetStarted from './pages/GetStarted'
import OnePager from './pages/OnePager'
import ValueProposition from './pages/ValueProposition'
import Docs from './pages/Docs'
import Layout from './layout'
import Manifesto from './pages/Manifesto'
import Resources from './pages/Resources'
import TraigentEvidence from './pages/TraigentEvidence'
import TvlFoundations from './pages/TvlFoundations'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="get-started" element={<GetStarted />} />
        <Route path="one-pager" element={<OnePager />} />
        <Route path="value-proposition" element={<ValueProposition />} />
        <Route path="docs" element={<Docs />} />
        <Route path="manifesto" element={<Manifesto />} />
        <Route path="resources" element={<Resources />} />
        <Route path="resources/traigent-evidence" element={<TraigentEvidence />} />
        <Route path="resources/tvl-foundations" element={<TvlFoundations />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
} 
