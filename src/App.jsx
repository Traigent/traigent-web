import { Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import GetStarted from './pages/GetStarted'
import Layout from './layout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="get-started" element={<GetStarted />} />
      </Route>
    </Routes>
  )
} 
