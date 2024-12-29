import { atomWithStorage } from "jotai/utils";

import { Score } from "@/types";

export const scoreboardAtom = atomWithStorage<Score | undefined>(
  "scoreboard",
  undefined,
);
