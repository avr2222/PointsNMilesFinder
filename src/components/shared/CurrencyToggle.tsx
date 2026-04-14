import { useCurrency } from '../../hooks/useCurrency'

export function CurrencyToggle() {
  const { currency, toggle } = useCurrency()

  return (
    <button
      onClick={toggle}
      className="btn-secondary text-xs font-semibold tabular-nums min-w-[56px]"
      title={`Switch to ${currency === 'INR' ? 'USD' : 'INR'}`}
    >
      {currency === 'INR' ? '₹ INR' : '$ USD'}
    </button>
  )
}
