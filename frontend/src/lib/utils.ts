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

  // Format the date in a readable format
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};