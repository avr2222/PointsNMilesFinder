interface Props {
  onReset: () => void
}

export function EmptyState({ onReset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">No deals match your filters</h3>
      <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or search query.</p>
      <button onClick={onReset} className="btn-primary">
        Reset Filters
      </button>
    </div>
  )
}
