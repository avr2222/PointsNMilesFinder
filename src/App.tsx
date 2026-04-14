import { Header }    from './components/layout/Header'
import { Footer }    from './components/layout/Footer'
import { Dashboard } from './components/dashboard/Dashboard'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <Dashboard />
      </main>
      <Footer />
    </div>
  )
}
