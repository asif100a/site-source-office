export const MUST_HAVE_OPTIONS = [
  "CSCS card",
  "Own tools",
  "Own PPE",
] as const;

export type MustHaveOption = (typeof MUST_HAVE_OPTIONS)[number];

export type JobDateRange = {
  from?: Date;
  to?: Date;
};
