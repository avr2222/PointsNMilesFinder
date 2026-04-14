import type { DealRating } from '../../types'
import { RATING_EMOJI, RATING_LABEL } from '../../utils/formatters'

interface Props {
  rating: DealRating
  size?: 'sm' | 'md'
}

export function RatingBadge({ rating, size = 'md' }: Props) {
  const cls = {
    hot:  'badge-hot',
    good: 'badge-good',
    skip: 'badge-skip',
  }[rating]

  return (
    <span className={`${cls} ${size === 'sm' ? 'text-[11px]' : ''}`}>
      {RATING_EMOJI[rating]} {RATING_LABEL[rating]}
    </span>
  )
}
