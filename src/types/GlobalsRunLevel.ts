import { WarpState } from "../features/optional/quality/showDreamCatcherItem/enums";

export default class GlobalsRunLevel {
  stage: int;
  stageType: int;

  dreamCatcher = {
    items: [] as CollectibleType[],
    /** Bosses are stored as an array of "[entityType, variant]". */
    bosses: [] as Array<[EntityType, int]>,
    dreamCatcherSprite: null as Sprite | null,
    itemSprites: [] as Sprite[],
    bossSprites: [] as Sprite[],
    warpState: WarpState.INITIAL,
    displayFlagsMap: new LuaTable<int, int>(),
  };

  constructor(stage: int, stageType: int) {
    this.stage = stage;
    this.stageType = stageType;
  }
}
