export function formatPayRate(payRate: string) {
  if (payRate.includes("/") || payRate.includes("£") || payRate.includes("$")) {
    return payRate;
  }

  return `£${payRate}/hour`;
}

export default function getFormattedWord(
  text: string,
  splitter?: string,
  caseType?: "uppercase" | "lowercase" | "capitalize",
): string {
  if (!text) return "N/A";
  const arr = text.split(splitter || " ");
  if (caseType === "uppercase") return arr.join("").toUpperCase();
  if (caseType === "lowercase") return arr.join("").toLowerCase();
  return arr
    .map((t) => t.slice(0, 1).toUpperCase() + t.slice(1).toLowerCase())
    .join(" ");
}
