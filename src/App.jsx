import { Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import GetStarted from './pages/GetStarted'
import OnePager from './pages/OnePager'
import ValueProposition from './pages/ValueProposition'
import TableDemo from './pages/TableDemo'
import Pitch from './pages/Pitch'
import PitchFull from './pages/PitchFull'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import ROICalculator from './pages/ROICalculator'
import TTMCalculator from './pages/TTMCalculator'
import FAQ from './pages/FAQ'
import Compare from './pages/Compare'
import About from './pages/About'
import Pricing from './pages/Pricing'
import Layout from './layout'
import ExternalRedirect from './components/ExternalRedirect'

export default function App() {
  return (
    <Routes>
      <Route path="table-demo" element={<TableDemo />} />
      {/* Pitch decks — no layout/nav, full-bleed slides */}
      <Route path="pitch" element={<Pitch />} />
      <Route path="pitch-full" element={<PitchFull />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="get-started" element={<GetStarted />} />
        <Route path="one-pager" element={<OnePager />} />
        <Route path="value-proposition" element={<ValueProposition />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="roi" element={<ROICalculator />} />
        <Route path="ttm" element={<TTMCalculator />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="compare" element={<Compare />} />
        <Route path="about" element={<About />} />
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
        <Route path="pricing" element={<Pricing />} />
      </Route>
    </Routes>
  )
} 
