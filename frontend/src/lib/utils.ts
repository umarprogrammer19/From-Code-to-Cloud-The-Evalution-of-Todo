import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString: string | Date | undefined | null): string => {
  if (!dateString) return 'N/A';

  // Handle different date formats
  let date: Date;

  if (dateString instanceof Date) {
    date = dateString;
  } else if (typeof dateString === 'string') {
    // Try to parse the date string
    date = new Date(dateString);

    // If the date is invalid, try different parsing strategies
    if (isNaN(date.getTime())) {
      // Try replacing 'T' with space and adding 'Z' if needed
      const modifiedDateString = dateString.replace('T', ' ').replace(/\.\d+Z?$/, '');
      date = new Date(modifiedDateString);

      // If still invalid, return 'N/A'
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
    }
  } else {
    // If it's not a string or Date object, return 'N/A'
    return 'N/A';
  }

  // For SSR compatibility, use a consistent format that works on both server and client
  // toLocaleDateString can behave differently on server vs client due to locale/timezone
  // So we'll create a consistent string format
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${month} ${day}, ${year} at ${hours}:${minutes}`;
};