export function daysUntil(targetDate: Date) {
  const today = new Date()
  const differenceInTime = targetDate - today
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24))
  let days = `${differenceInDays} dias restantes`

  if (differenceInDays === 1) {
    days = 'Último dia'
  } else if (differenceInDays <= 0) {
    days = `${Math.abs(differenceInDays)} dias expirado`
    if (differenceInDays === 0) {
      days = `Expirado`
    }
    if (differenceInDays === -1) {
      days = `${Math.abs(differenceInDays)} dia expirado`
    }
  }

  return days
}
