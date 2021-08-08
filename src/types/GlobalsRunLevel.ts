import { WarpState } from "../features/optional/quality/showDreamCatcherItem/enums";
import EntityLocation from "./EntityLocation";

export default class GlobalsRunLevel {
  stage: int;
  stageType: int;

  dreamCatcher = {
    items: [] as CollectibleType[],

    /** Bosses are stored as an array of: [entityType, variant] */
    bosses: [] as Array<[int, int]>,

    dreamCatcherSprite: null as Sprite | null,
    itemSprites: [] as Sprite[],
    bossSprites: [] as Sprite[],
    warpState: WarpState.Initial,
  };

  fastTravel = {
    /**
     * We need to manually keep track if the player takes damage for the purposes of the Perfection
     * trinket.
     */
    tookDamage: false,

    /**
     * Used for keeping track of whether or not we are in a Black Market so that we can position
     * the player properly.
     */
    blackMarket: false,

    /**
     * Used for the purposes of fixing the softlock when a player returns from a crawlspace to a
     * room outside of the grid.
     */
    previousRoomIndex: null as int | null,

    /**
     * Used to reposition the player after we subvert their touching of a loading zone and
     * manually teleport them to the right room.
     */
    subvertedRoomTransitionDirection: Direction.NO_DIRECTION,
  };

  trophy = null as EntityLocation | null;

  constructor(stage: int, stageType: int) {
    this.stage = stage;
    this.stageType = stageType;
  }
}
