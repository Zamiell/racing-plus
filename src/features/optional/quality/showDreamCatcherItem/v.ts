import { anyPlayerHasCollectible, saveDataManager } from "isaacscript-common";
import { config } from "../../../../modConfigMenu";

const v = {
  level: {
    collectibles: [] as CollectibleType[],

    /** Bosses are stored as an array of: [entityType, variant] */
    bosses: [] as Array<[int, int]>,
  },
};
export default v;

export function init(): void {
  saveDataManager("showDreamCatcherItem", v, featureEnabled);
}

function featureEnabled() {
  return config.showDreamCatcherItem;
}

export function shouldCheckForDreamCatcherThings(): boolean {
  return (
    featureEnabled() &&
    anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_DREAM_CATCHER)
  );
}
