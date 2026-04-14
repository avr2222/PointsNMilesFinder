import { useDealsStore } from '../../store/dealsStore'
import { formatDate } from '../../utils/formatters'

export function Footer() {
  const lastUpdated = useDealsStore((s) => s.lastUpdated)

  return (
    <footer className="mt-12 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-gray-500">PointsNMilesFinder</span>
          <span>·</span>
          <span>Data refreshed daily via GitHub Actions</span>
          {lastUpdated && <span>· Last run: {formatDate(lastUpdated)}</span>}
        </div>
        <div className="flex items-center gap-4">
          <span>⚠️ For informational purposes only — verify before booking</span>
          <a
            href="https://github.com/avr2222/PointsNMilesFinder"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            View Source
          </a>
        </div>
      </div>
    </footer>
  )
}
