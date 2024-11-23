// export function formatDate(date: string) {
//   return new Date(date)
//     .toLocaleDateString('en-US', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric',
//     })
//     .replaceAll(',', '')
//     .replaceAll(' ', '-');
// }

import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInWeeks,
  isThisYear,
  format,
} from 'date-fns';

export function formatDate(date: Date | string): string {
  const _date = new Date(date);
  const now = new Date();

  // Calculate differences
  const diffInMinutes = differenceInMinutes(now, _date);
  const diffInHours = differenceInHours(now, _date);
  const diffInDays = differenceInDays(now, _date);
  const diffInWeeks = differenceInWeeks(now, _date);

  // Within a day
  if (diffInMinutes < 60) {
    return diffInMinutes === 0 ? 'just now' : `${diffInMinutes} min ago`;
  }

  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  // Within a week
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  // Within a month (up to 4 weeks)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  // Within the current year
  if (isThisYear(_date)) {
    return format(_date, 'dd-MMM'); // e.g., "11-Nov" or "02-May"
  }

  // Older than the current year
  return format(_date, 'dd-MMM-yyyy'); // e.g., "11-Nov-2025"
}
