/**
 * Pure diff function — compares two Deal arrays.
 * Returns categorized sets of changed/new deals.
 * No file I/O — all arguments passed in.
 */
export function diffDeals(newDeals, previousDeals) {
  const previousIds = new Set(previousDeals.map((d) => d.id))
  const previousMap = Object.fromEntries(previousDeals.map((d) => [d.id, d]))

  return {
    newDeals:     newDeals.filter((d) => !previousIds.has(d.id)),
    newHotDeals:  newDeals.filter((d) => d.rating === 'hot' && !previousIds.has(d.id)),
    newBonuses:   newDeals.filter(
      (d) => d.transfer_bonus_active && previousMap[d.id] && !previousMap[d.id].transfer_bonus_active,
    ),
    improvedDeals: newDeals.filter(
      (d) =>
        previousMap[d.id] &&
        d.value_per_point_inr > previousMap[d.id].value_per_point_inr,
    ),
  }
}
