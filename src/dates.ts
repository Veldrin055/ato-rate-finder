const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',]

export const dateFromMY = (month: string, year: string) => {
  const date = new Date()
  date.setFullYear(Number.parseInt(year), months.indexOf(month), 1)
  date.setHours(0, 1, 0, 0)

  return date
}

export const formatDate = (date: Date) => {
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);

  return `${month} - ${year}`
}