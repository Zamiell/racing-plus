import { copyArray } from "isaacscript-common";
import { mod } from "../../../mod";
import { speedrunGetCharacterNum } from "../v";
import { SEASON_2_STARTING_BUILD_INDEXES } from "./constants";

const v = {
  persistent: {
    selectedBuildIndexes: [] as int[],
    remainingBuildIndexes: [] as int[],
    /** Never start the same build twice in a row. */
    lastSelectedBuildIndex: null as int | null,
  },
};
export default v;

export function init(): void {
  mod.saveDataManager("season2", v);
}

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
