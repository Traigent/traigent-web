import { Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import GetStarted from './pages/GetStarted'
import OnePager from './pages/OnePager'
import ValueProposition from './pages/ValueProposition'
import Investors from './pages/Investors'
import TableDemo from './pages/TableDemo'
import Demos from './pages/Demos'
import Academy from './pages/Academy'
import CourseLanding from './pages/CourseLanding'
import Resources from './pages/Resources'
import Specifications from './pages/Specifications'
import Layout from './layout'
import ExternalRedirect from './components/ExternalRedirect'

export default function App() {
  return (
    <Routes>
      {/* Investors page has its own layout/nav */}
      <Route path="investors" element={<Investors />} />
      <Route path="table-demo" element={<TableDemo />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="get-started" element={<GetStarted />} />
        <Route path="one-pager" element={<OnePager />} />
        <Route path="value-proposition" element={<ValueProposition />} />
        <Route path="demos" element={<Demos />} />
        <Route path="academy" element={<Academy />} />
        <Route path="academy/agents-in-production" element={<CourseLanding />} />
        <Route path="resources" element={<Resources />} />
        <Route path="specifications" element={<Specifications />} />
        <Route
          path="privacy"
          element={<ExternalRedirect to="https://portal.traigent.ai/privacy" label="privacy" />}
        />
        <Route
          path="terms"
          element={<ExternalRedirect to="https://portal.traigent.ai/terms" label="terms" />}
        />
        <Route
          path="refund"
          element={<ExternalRedirect to="https://portal.traigent.ai/refund" label="refund" />}
        />
        <Route
          path="pricing"
          element={<ExternalRedirect to="https://portal.traigent.ai/pricing" label="pricing" />}
        />
      </Route>
    </Routes>
  )
} 
