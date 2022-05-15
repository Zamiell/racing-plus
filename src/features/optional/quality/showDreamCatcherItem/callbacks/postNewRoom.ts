import {
  CollectibleType,
  EntityFlag,
  EntityType,
  GeminiVariant,
  MamaGurdyVariant,
  MomVariant,
  RoomType,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  getBosses,
  getCollectibles,
  inStartingRoom,
  isArrayInArray,
  log,
  runNextGameFrame,
  useActiveItemTemp,
} from "isaacscript-common";
import { DreamCatcherWarpState } from "../../../../../enums/DreamCatcherWarpState";
import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import * as sprites from "../sprites";
import v from "../v";
import { warpToNextDreamCatcherRoom } from "../warp";

export function showDreamCatcherItemPostNewRoom(): void {
  if (!config.showDreamCatcherItem) {
    return;
  }

  // This feature requires that fast-travel is enabled. This is because using the Glowing Hour Glass
  // will not work after warping to the Treasure Room (because the screen is still fading in from
  // the stage animation).
  if (!config.fastTravel) {
    return;
  }

  if (!anyPlayerHasCollectible(CollectibleType.DREAM_CATCHER)) {
    return;
  }

  sprites.set();
  checkWarping();
}

function checkWarping() {
  if (v.level.warpState !== DreamCatcherWarpState.WARPING) {
    return;
  }

  if (inStartingRoom()) {
    warpToNextDreamCatcherRoom();
  } else {
    gatherInfoAndGlowingHourGlass();
  }
}

function gatherInfoAndGlowingHourGlass() {
  // We have arrived in a new Treasure Room or Boss Room.
  const roomType = g.r.GetType();
  if (roomType === RoomType.TREASURE) {
    for (const collectibleType of getRoomCollectibles()) {
      v.level.collectibles.push(collectibleType);
    }
  } else if (roomType === RoomType.BOSS) {
    for (const boss of getRoomBosses()) {
      v.level.bosses.push(boss);
    }
  }

  // Hide the boss HP bar, which will show up for a few frames and betray that we traveled to the
  // Boss Room.
  for (const boss of getBosses()) {
    boss.AddEntityFlags(EntityFlag.DONT_COUNT_BOSS_HP);
  }

  // In order to reset all of the state properly, we need to use Glowing Hour Glass (because it is
  // not possible to modify the Planetarium chances via Lua). This has the disadvantage of having to
  // wait 10 frames before the previous room is entered. Additionally, we also have to wait a game
  // frame after entering the new room before triggering the Glowing Hour Glass, or the UI will
  // permanently disappear for some reason.
  runNextGameFrame(() => {
    log("Dream Catcher - Using Glowing Hour Glass.");
    const player = Isaac.GetPlayer();
    useActiveItemTemp(player, CollectibleType.GLOWING_HOUR_GLASS);

    // Cancel the "use item" animation to speed up returning to the starting room.
    const sprite = player.GetSprite();
    sprite.Stop();
  });
}

function getRoomCollectibles() {
  const collectibleTypes: CollectibleType[] = [];

  for (const collectible of getCollectibles()) {
    collectibleTypes.push(collectible.SubType);
  }

  return collectibleTypes;
}

/** Returns an array of: [entityType, variant] */
function getRoomBosses(): Array<[int, int]> {
  const bosses: Array<[int, int]> = [];
  for (const boss of getBosses()) {
    if (!isBossException(boss.Type, boss.Variant)) {
      const bossArray: [int, int] = [boss.Type, boss.Variant];
      if (!isArrayInArray(bossArray, bosses)) {
        bosses.push(bossArray);
      }
    }
  }

  return bosses;
}

function isBossException(type: EntityType, variant: int) {
  switch (type) {
    // 45
    case EntityType.MOM: {
      return variant === MomVariant.STOMP;
    }

    // 79
    case EntityType.GEMINI: {
      return (
        variant === GeminiVariant.GEMINI_BABY ||
        variant === GeminiVariant.STEVEN_BABY ||
        variant === GeminiVariant.BLIGHTED_OVUM_BABY ||
        variant === GeminiVariant.UMBILICAL_CORD
      );
    }

    // 266
    case EntityType.MAMA_GURDY: {
      return (
        variant === MamaGurdyVariant.LEFT_HAND ||
        variant === MamaGurdyVariant.RIGHT_HAND
      );
    }

    default: {
      return false;
    }
  }
}
