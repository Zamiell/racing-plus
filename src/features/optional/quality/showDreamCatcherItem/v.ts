import { saveDataManager } from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import { WarpState } from "./enums";

const v = {
  level: {
    items: [] as CollectibleType[],

    /** Bosses are stored as an array of: [entityType, variant] */
    bosses: [] as Array<[int, int]>,

    dreamCatcherSprite: null as Sprite | null,
    itemSprites: [] as Sprite[],
    bossSprites: [] as Sprite[],
    warpState: WarpState.Initial,
  },
};
export default v;

export function init(): void {
  saveDataManager("showDreamCatcherItem", v, featureEnabled);
}

function featureEnabled() {
  return config.showDreamCatcherItem;
}
