import { WarpState } from "../features/optional/quality/showDreamCatcherItem/enums";

export default class GlobalsRunLevel {
  stage: int;
  stageType: int;

  dreamCatcher = {
    items: [] as CollectibleType[],
    dreamCatcherSprite: null as Sprite | null,
    itemSprites: [] as Sprite[],
    warpState: WarpState.NOT_WARPING,
    displayFlagsMap: new LuaTable<int, int>(),
  };

  constructor(stage: int, stageType: int) {
    this.stage = stage;
    this.stageType = stageType;
  }
}
