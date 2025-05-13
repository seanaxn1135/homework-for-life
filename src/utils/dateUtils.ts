/**
 * Base formatter to handle invalid dates and provide a consistent fallback.
 * @param date - The Date object to format.
 * @param options - Intl.DateTimeFormatOptions for formatting.
 * @param fallbackString - String to return if the date is invalid.
 * @returns The formatted date string or the fallback string.
 */
const formatDateWithFallback = (
  date: Date,
  options: Intl.DateTimeFormatOptions,
  fallbackString: string = "" // Default fallback to empty string
): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.warn("Date formatting received an invalid date:", date)
    return fallbackString
  }
  try {
    return date.toLocaleDateString("en-US", options)
  } catch (error) {
    console.error(
      "Error formatting date:",
      date,
      "with options:",
      options,
      error
    )
    return fallbackString // Fallback on formatting error too
  }
}

/**
 * Formats a Date object into "Weekday, Month Day" string.
 * Example: "Tuesday, May 13"
 * @param date - The Date object to format.
 * @returns The formatted date string or an empty string for invalid dates.
 */
export const formatDateToWeekdayMonthDay = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  }
  return formatDateWithFallback(date, options)
}

/**
 * Formats a Date object into "Month Day, Year" string.
 * Example: "October 26, 2023"
 * @param date - The Date object to format.
 * @returns The formatted date string or an empty string for invalid dates.
 */
export const formatDateToMonthDayYear = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  }
  return formatDateWithFallback(date, options)
}
