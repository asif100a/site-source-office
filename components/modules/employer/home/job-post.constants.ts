export const MUST_HAVE_OPTIONS = [
  "CSCS card",
  "Own tools",
  "Own PPE",
] as const;

export type MustHaveOption = (typeof MUST_HAVE_OPTIONS)[number];

export const MUST_HAVE_VALUES: Record<MustHaveOption, string> = {
  "CSCS card": "CSCS_CARDS",
  "Own tools": "OWN_TOOLS",
  "Own PPE": "OWN_PPE",
};

export type JobDateRange = {
  from?: Date;
  to?: Date;
};
