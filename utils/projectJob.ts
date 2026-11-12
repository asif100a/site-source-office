import { ProjectJobDateRange } from "@/types";

const formatProjectDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatProjectJobDateRange = (range: ProjectJobDateRange) => {
  if (!range.from && !range.to) return "Select required days";
  if (range.from && !range.to) return formatProjectDate(range.from);
  if (!range.from && range.to) return formatProjectDate(range.to);

  return `${formatProjectDate(range.from as Date)} - ${formatProjectDate(
    range.to as Date,
  )}`;
};
