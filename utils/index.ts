export function formatPayRate(payRate: string) {
  if (payRate.includes("/") || payRate.includes("£") || payRate.includes("$")) {
    return payRate;
  }

  return `£${payRate}/hour`;
}