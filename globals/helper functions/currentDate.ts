type DateInput = Date | string | number | null | undefined;

export function getDateFormatted(rawDate?: DateInput) {
  const date = rawDate ? new Date(rawDate) : new Date();

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  } as const;

  const formattedDate = date.toLocaleDateString("en-GB", options);

  return formattedDate;
}

export function getRelativeDateFormatted(rawDate?: DateInput) {
  const date = rawDate ? new Date(rawDate) : new Date();

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const elapsedMs = now.getTime() - date.getTime();

  if (elapsedMs < 60_000) {
    return "just now";
  }

  const elapsedMinutes = Math.floor(elapsedMs / 60_000);

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} ${elapsedMinutes === 1 ? "min" : "mins"} ago`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  if (isYesterday(date, now)) {
    return "yesterday";
  }

  if (isSameCalendarDay(date, now)) {
    return `${elapsedHours} ${elapsedHours === 1 ? "hour" : "hours"} ago`;
  }

  return getDateFormatted(date);
}

function isSameCalendarDay(date: Date, comparisonDate: Date) {
  return (
    date.getFullYear() === comparisonDate.getFullYear() &&
    date.getMonth() === comparisonDate.getMonth() &&
    date.getDate() === comparisonDate.getDate()
  );
}

function isYesterday(date: Date, comparisonDate: Date) {
  const yesterday = new Date(comparisonDate);
  yesterday.setDate(comparisonDate.getDate() - 1);

  return isSameCalendarDay(date, yesterday);
}
