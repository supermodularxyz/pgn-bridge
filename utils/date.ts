import { formatDistanceToNow, isPast, isValid } from "date-fns";
import locale from "date-fns/locale/en-US";

export const timeAgo = (date: string | number, opts = { short: true }) => {
  if (!isValid(new Date(date))) {
    return null;
  }
  const d = new Date(date);
  const now = new Date();
  const distance = formatDistanceToNow(d, {
    addSuffix: !opts.short,
    locale: {
      ...locale,
      formatDistance: opts.short ? formatDistance : locale.formatDistance,
    },
  });

  return `${distance} ${isPast(d) ? "ago" : ""}`;
};

const formatDistance = (token: string, count: string) =>
  formatDistanceLocale[token as keyof typeof formatDistanceLocale].replace(
    "{{count}}",
    count
  );

const formatDistanceLocale = {
  lessThanXSeconds: "{{count}}s",
  xSeconds: "{{count}}s",
  halfAMinute: "30s",
  lessThanXMinutes: "{{count}}m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}m",
  xMonths: "{{count}}m",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
};
