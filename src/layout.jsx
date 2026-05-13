import { Outlet } from 'react-router-dom'
import TopNav from './components/TopNav'

export default function Layout() {
  return (
    <>
      <TopNav />
      <main>
        <Outlet />
      </main>
    </>
  )
}
