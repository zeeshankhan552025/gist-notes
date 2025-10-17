/**
 * Date utility functions for formatting relative dates across the application
 */

export type DateFormatType = 'created' | 'updated';

interface TimeUnits {
  minutes: number;
  hours: number;
  days: number;
  months: number;
  years: number;
}

/**
 * Calculate time differences in various units
 */
function calculateTimeDifferences(dateString: string): TimeUnits {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();

  return {
    minutes: Math.floor(diffMs / (1000 * 60)),
    hours: Math.floor(diffMs / (1000 * 60 * 60)),
    days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
    months: Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30)),
    years: Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365)),
  };
}

/**
 * Format plural text based on count
 */
function formatPlural(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

/**
 * Format relative date for "created" context
 */
export function formatCreatedDate(dateString: string): string {
  const { hours, days, months } = calculateTimeDifferences(dateString);
  const date = new Date(dateString);

  if (hours < 24) {
    return `Created ${hours} ${formatPlural(hours, 'hour')} ago`;
  } else if (days < 30) {
    return `Created ${days} ${formatPlural(days, 'day')} ago`;
  } else if (months < 12) {
    return `Created ${months} ${formatPlural(months, 'month')} ago`;
  } else {
    return `Created on ${date.toLocaleDateString()}`;
  }
}

/**
 * Format relative date for "updated/last updated" context
 */
export function formatUpdatedDate(dateString: string): string {
  const { minutes, hours, days, months, years } = calculateTimeDifferences(dateString);

  if (minutes < 60) {
    return minutes <= 1 ? 'Last updated a few minutes ago' : `Last updated ${minutes} minutes ago`;
  } else if (hours < 24) {
    return hours === 1 ? 'Last updated an hour ago' : `Last updated ${hours} hours ago`;
  } else if (days < 30) {
    return days === 1 ? 'Last updated a day ago' : `Last updated ${days} days ago`;
  } else if (months < 12) {
    return months === 1 ? 'Last updated a month ago' : `Last updated ${months} months ago`;
  } else {
    return years === 1 ? 'Last updated a year ago' : `Last updated ${years} years ago`;
  }
}

/**
 * Simple created date format (simplified version used in GistDetailPage)
 */
export function formatSimpleCreatedDate(dateString: string): string {
  const { hours, days } = calculateTimeDifferences(dateString);

  if (hours < 24) {
    return hours <= 1 ? 'Created an hour ago' : `Created ${hours} hours ago`;
  } else {
    return days === 1 ? 'Created a day ago' : `Created ${days} days ago`;
  }
}

/**
 * Generic relative date formatter that can handle both created and updated contexts
 */
export function formatRelativeDate(dateString: string, type: DateFormatType = 'updated'): string {
  switch (type) {
    case 'created':
      return formatCreatedDate(dateString);
    case 'updated':
      return formatUpdatedDate(dateString);
    default:
      return formatUpdatedDate(dateString);
  }
}