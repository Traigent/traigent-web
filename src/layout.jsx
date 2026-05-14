import { Outlet } from 'react-router-dom'
import TopNav from './components/TopNav'
import RouteTracker from './components/RouteTracker'
import ScrollToTop from './components/ScrollToTop'

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <RouteTracker />
      <TopNav />
      <main>
        <Outlet />
      </main>
    </>
  )
}
