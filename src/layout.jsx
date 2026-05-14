import { Outlet } from 'react-router-dom'
import TopNav from './components/TopNav'
import RouteTracker from './components/RouteTracker'

export default function Layout() {
  return (
    <>
      <RouteTracker />
      <TopNav />
      <main>
        <Outlet />
      </main>
    </>
  )
}
