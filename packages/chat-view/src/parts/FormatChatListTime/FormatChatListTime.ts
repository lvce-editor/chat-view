import { getRelativeTimeNow } from '../RelativeTimeNow/RelativeTimeNow.ts'

const minute = 60
const hour = minute * 60
const day = hour * 24
const month = day * 30
const year = day * 365
const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T/

const formatAgo = (value: number, singular: string, plural: string): string => {
  return value === 1 ? `${value} ${singular} ago` : `${value} ${plural} ago`
}

const isIsoDateTime = (value: string): boolean => {
  return isoDateTimeRegex.test(value)
}

export const formatChatListTime = (value: string): string => {
  if (!isIsoDateTime(value)) {
    return value
  }

  const timestamp = Date.parse(value)
  if (Number.isNaN(timestamp)) {
    return value
  }

  const seconds = Math.max(1, Math.round((getRelativeTimeNow() - timestamp) / 1000))

  if (seconds < minute) {
    return formatAgo(seconds, 'sec', 'secs')
  }

  if (seconds < hour) {
    const minutes = Math.round(seconds / minute)
    return formatAgo(minutes, 'min', 'mins')
  }

  if (seconds < day) {
    const hours = Math.round(seconds / hour)
    return formatAgo(hours, 'hr', 'hrs')
  }

  if (seconds < month) {
    const days = Math.round(seconds / day)
    return formatAgo(days, 'day', 'days')
  }

  if (seconds < year) {
    const months = Math.round(seconds / month)
    return formatAgo(months, 'mo', 'mos')
  }

  const years = Math.round(seconds / year)
  return formatAgo(years, 'yr', 'yrs')
}
