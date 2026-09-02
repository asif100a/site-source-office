import { WORKER_HOME_TRADE_VALUES } from "@/constants/workerHome";
import { JobArgs } from "@/store/api/jobApi";
import { WorkerHomeFilter } from "@/types";

export function getWorkerJobFilter(
  filter: WorkerHomeFilter,
): JobArgs["filter"] {
  if (filter === "Best match") return "best-match";
  if (filter === "Nearby") return "nearby";
  if (filter === "Closing soon") return "closing-soon";
  return undefined;
}

export function getWorkerJobTrade(trade: string): JobArgs["trade"] {
  return WORKER_HOME_TRADE_VALUES[
    trade as keyof typeof WORKER_HOME_TRADE_VALUES
  ];
}
