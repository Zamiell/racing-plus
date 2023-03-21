import {
  CollectibleType,
  EntityFlag,
  EntityType,
  GeminiVariant,
  MamaGurdyVariant,
  ModCallback,
  MomVariant,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  anyPlayerHasCollectible,
  asNumber,
  game,
  getBosses,
  getCollectibles,
  getEffects,
  getPlayers,
  inRoomType,
  inStartingRoom,
  isArrayInArray,
  log,
  movePlayersToCenter,
  setFloorDisplayFlags,
  setPlayerHealth,
  useActiveItemTemp,
} from "isaacscript-common";
import { DreamCatcherWarpState } from "../../../../enums/DreamCatcherWarpState";
import { EffectVariantCustom } from "../../../../enums/EffectVariantCustom";
import { mod } from "../../../../mod";
import { config } from "../../../../modConfigMenu";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import { DREAM_CATCHER_FEATURE_NAME } from "./showDreamCatcher/constants";
import {
  showDreamCatcherDrawSprites,
  showDreamCatcherResetSprites,
  showDreamCatcherSetSprites,
} from "./showDreamCatcher/sprites";
import { v } from "./showDreamCatcher/v";
import {
  showDreamCatcherCheckStartWarp,
  showDreamCatcherWarpToNextRoom,
} from "./showDreamCatcher/warp";

export class ShowDreamCatcher extends ConfigurableModFeature {
  configKey: keyof Config = "ShowDreamCatcher";
  v = v;

  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    this.checkArrivedFloor();
    showDreamCatcherDrawSprites();
    this.repositionPlayer();
  }

  checkArrivedFloor(): void {
    if (!v.level.arrivedOnNewFloor) {
      return;
    }
    v.level.arrivedOnNewFloor = false;

    showDreamCatcherCheckStartWarp();
  }

  repositionPlayer(): void {
    if (v.level.warpState !== DreamCatcherWarpState.REPOSITIONING_PLAYER) {
      return;
    }

    v.level.warpState = DreamCatcherWarpState.FINISHED;

    const hud = game.GetHUD();

    movePlayersToCenter();

    // Fix the bug where the fast-travel pitfalls will be misaligned due to being spawned before the
    // player's position was updated.
    const customPitfalls = getEffects(EffectVariantCustom.PITFALL_CUSTOM);
    const players = getPlayers();
    customPitfalls.forEach((pitfall, i) => {
      const player = players[i];
      if (player !== undefined) {
        pitfall.Position = player.Position;
      }
    });

    // After using Glowing Hourglass, the minimap will be bugged. Earlier, we saved the minimap
    // data, so now we can restore it since we are finished warping. (The bug only happens with the
    // vanilla minimap.)
    if (MinimapAPI === undefined) {
      setFloorDisplayFlags(v.level.floorDisplayFlags);
    }

    // Restore the player's health.
    const player = Isaac.GetPlayer();
    if (v.level.health !== null) {
      setPlayerHealth(player, v.level.health);
    }

    hud.SetVisible(true);

    mod.enableAllSound(DREAM_CATCHER_FEATURE_NAME);
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED)
  postNewLevelReordered(): void {
    showDreamCatcherResetSprites();
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    // This feature requires that fast-travel is enabled. This is because using the Glowing
    // Hourglass will not work after warping to the Treasure Room (because the screen is still
    // fading in from the stage animation).
    if (!config.FastTravel) {
      return;
    }

    if (!anyPlayerHasCollectible(CollectibleType.DREAM_CATCHER)) {
      return;
    }

    showDreamCatcherSetSprites();
    this.checkWarping();
  }

  checkWarping(): void {
    if (v.level.warpState !== DreamCatcherWarpState.WARPING) {
      return;
    }

    if (inStartingRoom()) {
      showDreamCatcherWarpToNextRoom();
    } else {
      this.gatherInfoAndGlowingHourGlass();
    }
  }

  gatherInfoAndGlowingHourGlass(): void {
    // We have arrived in a new Treasure Room or Boss Room.
    if (inRoomType(RoomType.TREASURE)) {
      for (const collectibleType of this.getRoomCollectibleTypes()) {
        v.level.collectibles.push(collectibleType);
      }
    } else if (inRoomType(RoomType.BOSS)) {
      for (const boss of this.getRoomBosses()) {
        v.level.bosses.push(boss);
      }
    }

    // Hide the boss HP bar, which will show up for a few frames and betray that we traveled to the
    // Boss Room.
    for (const boss of getBosses()) {
      boss.AddEntityFlags(EntityFlag.DONT_COUNT_BOSS_HP);
    }

    // In order to reset all of the state properly, we need to use Glowing Hourglass (because it is
    // not possible to modify the Planetarium chances via Lua). This has the disadvantage of having
    // to wait 10 frames before the previous room is entered. Additionally, we also have to wait a
    // game frame after entering the new room before triggering the Glowing Hourglass, or the UI
    // will permanently disappear for some reason.
    mod.runNextGameFrame(() => {
      log("Dream Catcher - Using Glowing Hourglass.");
      const player = Isaac.GetPlayer();
      useActiveItemTemp(player, CollectibleType.GLOWING_HOUR_GLASS);

      // Cancel the "use item" animation to speed up returning to the starting room.
      const sprite = player.GetSprite();
      sprite.Stop();
    });
  }

  getRoomCollectibleTypes(): CollectibleType[] {
    const collectibles = getCollectibles();
    return collectibles.map((collectible) => collectible.SubType);
  }

  getRoomBosses(): Array<[entityType: EntityType, variant: int]> {
    const bosses: Array<[int, int]> = [];
    for (const boss of getBosses()) {
      if (!this.isBossException(boss.Type, boss.Variant)) {
        const bossArray: [int, int] = [boss.Type, boss.Variant];
        if (!isArrayInArray(bossArray, bosses)) {
          bosses.push(bossArray);
        }
      }
    }

    return bosses;
  }

  isBossException(type: EntityType, variant: int): boolean {
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
}
