type formatTimestamp = (timestamp: Date) => string;

export const formatTimestamp: formatTimestamp = (timestamp) => {

  // Adjust for Indian Standard Time (IST, UTC+5:30)
  // const ISTOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
  // const ISTDateObject = new Date(timestamp.getTime() + ISTOffset);

  // Format the date as "DD/MM/YYYY hh:mm AM/PM"
  const formattedDate = timestamp.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formattedDate.toUpperCase();
};

export const extractYearAndMonth = (dateString: string): string => {
  // Create a Date object from the date string
  const date = new Date(dateString);

  // Get the year and month from the Date object
  const year = date.getFullYear();
  // JavaScript months are zero-based (0 for January, 11 for December)
  const month = date.toLocaleString('en-US', { month: 'short' });

  // Return the year and month as character like jan as string
  return `${year} ${month}`;
}