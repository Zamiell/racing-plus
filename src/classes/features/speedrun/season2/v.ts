import { copyArray } from "isaacscript-common";
import { speedrunGetCharacterNum } from "../characterProgress/v";
import { SEASON_2_STARTING_BUILD_INDEXES } from "./constants";

// This is registered in "Season2.ts".
// eslint-disable-next-line isaacscript/require-v-registration
export const v = {
  persistent: {
    selectedBuildIndexes: [] as int[],
    remainingBuildIndexes: [] as int[],

    /** Never start the same build twice in a row. */
    lastSelectedBuildIndex: null as int | null,
  },
};

export function season2GetCurrentBuildIndex(): int | undefined {
  const characterNum = speedrunGetCharacterNum();
  return v.persistent.selectedBuildIndexes[characterNum - 1];
}

export function season2ResetBuilds(): void {
  v.persistent.selectedBuildIndexes = [];
  v.persistent.remainingBuildIndexes = copyArray(
    SEASON_2_STARTING_BUILD_INDEXES,
  );
}
