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
  asNumber,
  getBosses,
  getCollectibles,
  inStartingRoom,
  isArrayInArray,
  log,
  useActiveItemTemp,
} from "isaacscript-common";
import { DreamCatcherWarpState } from "../../../../../enums/DreamCatcherWarpState";
import { g } from "../../../../../globals";
import { mod } from "../../../../../mod";
import { config } from "../../../../../modConfigMenu";
import * as sprites from "../sprites";
import { v } from "../v";
import { warpToNextDreamCatcherRoom } from "../warp";

export function showDreamCatcherItemPostNewRoom(): void {
  if (!config.ShowDreamCatcherItem) {
    return;
  }

  // This feature requires that fast-travel is enabled. This is because using the Glowing Hourglass
  // will not work after warping to the Treasure Room (because the screen is still fading in from
  // the stage animation).
  if (!config.FastTravel) {
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

  // In order to reset all of the state properly, we need to use Glowing Hourglass (because it is
  // not possible to modify the Planetarium chances via Lua). This has the disadvantage of having to
  // wait 10 frames before the previous room is entered. Additionally, we also have to wait a game
  // frame after entering the new room before triggering the Glowing Hourglass, or the UI will
  // permanently disappear for some reason.
  mod.runNextGameFrame(() => {
    log("Dream Catcher - Using Glowing Hourglass.");
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

function getRoomBosses(): Array<[entityType: EntityType, variant: int]> {
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
      return variant === asNumber(MomVariant.STOMP);
    }

    // 79
    case EntityType.GEMINI: {
      return (
        variant === asNumber(GeminiVariant.GEMINI_BABY) ||
        variant === asNumber(GeminiVariant.STEVEN_BABY) ||
        variant === asNumber(GeminiVariant.BLIGHTED_OVUM_BABY) ||
        variant === asNumber(GeminiVariant.UMBILICAL_CORD)
      );
    }

    // 266
    case EntityType.MAMA_GURDY: {
      return (
        variant === asNumber(MamaGurdyVariant.LEFT_HAND) ||
        variant === asNumber(MamaGurdyVariant.RIGHT_HAND)
      );
    }

    default: {
      return false;
    }
  }
}
