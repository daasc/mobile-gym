export function dayMissing(targetDate: Date) {
  const today = new Date()
  const differenceInTime = targetDate - today
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24))

  return differenceInDays
}
