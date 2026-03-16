import { Routes, Route, Navigate } from 'react-router-dom'
import Homepage from './pages/Homepage'
import GetStarted from './pages/GetStarted'
import OnePager from './pages/OnePager'
import ValueProposition from './pages/ValueProposition'
import Manifesto from './pages/Manifesto'
import Resources from './pages/Resources'
import SmartoptEvidence from './pages/SmartoptEvidence'
import TvlFoundations from './pages/TvlFoundations'
import HumanX2026Deck from './pages/HumanX2026Deck'
import Layout from './layout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="humanx-2026" element={<HumanX2026Deck />} />
        <Route path="get-started" element={<GetStarted />} />
        <Route path="one-pager" element={<OnePager />} />
        <Route path="value-proposition" element={<ValueProposition />} />
        <Route path="manifesto" element={<Manifesto />} />
        <Route path="resources" element={<Resources />} />
        <Route path="resources/smartopt-evidence" element={<SmartoptEvidence />} />
        <Route path="resources/tvl-foundations" element={<TvlFoundations />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
