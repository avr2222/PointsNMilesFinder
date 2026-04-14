import { CurrencyToggle } from '../shared/CurrencyToggle'
import { formatTimeAgo } from '../../utils/formatters'
import { useDealsStore } from '../../store/dealsStore'

export function Header() {
  const lastUpdated = useDealsStore((s) => s.lastUpdated)

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center text-white text-sm font-bold select-none">
            ✈
          </div>
          <span className="font-bold text-gray-900 text-base leading-none">
            Points<span className="text-brand-600">&amp;</span>Miles
          </span>
        </a>

        {/* Center — last updated */}
        {lastUpdated && (
          <p className="hidden sm:block text-xs text-gray-400 tabular-nums">
            Updated {formatTimeAgo(lastUpdated)}
          </p>
        )}

        {/* Right */}
        <div className="flex items-center gap-2">
          <CurrencyToggle />
          <a
            href="https://github.com/avr2222/PointsNMilesFinder"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex btn-secondary text-xs"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  )
}
