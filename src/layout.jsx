import { Outlet, useLocation } from 'react-router-dom'
import ThemeToggle from './components/ThemeToggle'

export default function Layout() {
  const location = useLocation()
  const hideThemeToggle = location.pathname.startsWith('/humanx-2026')

  return (
    <main className="min-h-screen">
      {hideThemeToggle ? null : <ThemeToggle />}
      <Outlet />
    </main>
  )
}
