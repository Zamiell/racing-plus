import {
  CollectibleType,
  DogmaVariant,
  EffectVariant,
  EntityType,
  LevelStage,
  ModCallback,
  PickupVariant,
  RoomType,
  TrapdoorVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  game,
  inStartingRoom,
  isRoomInsideGrid,
  ModCallbackCustom,
  onFirstFloor,
  onRepentanceStage,
  removeAllEffects,
  removeAllTrapdoors,
  spawnNPCWithSeed,
  spawnPickup,
  spawnTrapdoorWithVariant,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { g } from "../../../globals";
import { mod } from "../../../mod";
import { inClearedMomBossRoom } from "../../../utilsGlobals";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import {
  SEASON_3_INVERTED_TRAPDOOR_GRID_INDEX,
  VANILLA_HUSH_SPAWN_POSITION,
} from "./season3/constants";
import { season3CheckDrawGoals } from "./season3/drawGoals";
import {
  season3DrawStartingRoomSprites,
  season3DrawStartingRoomText,
} from "./season3/startingRoomSprites";
import {
  season3HasDogmaGoal,
  season3HasGoalThroughWomb1,
  season3HasHushGoal,
  v,
} from "./season3/v";

export class Season3 extends ChallengeModFeature {
  challenge = ChallengeCustom.SEASON_3;
  v = v;

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    const hud = game.GetHUD();
    if (!hud.IsVisible()) {
      return;
    }

    season3DrawStartingRoomSprites();
    season3DrawStartingRoomText();
    season3CheckDrawGoals();
  }

  // 23, 422
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.GLOWING_HOUR_GLASS)
  preUseItemGlowingHourGlass(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    return this.preventHomeWarp(player);
  }

  /**
   * It is possible to warp to Home by using the Glowing Hour Glass on the first room of the run.
   */
  preventHomeWarp(player: EntityPlayer): boolean | undefined {
    if (onFirstFloor() && inStartingRoom()) {
      player.AnimateSad();
      return true;
    }

    return undefined;
  }

  // 27, 102
  @Callback(ModCallback.POST_NPC_INIT, EntityType.ISAAC)
  postNPCInitIsaac(npc: EntityNPC): void {
    const stage = g.l.GetStage();
    if (stage !== LevelStage.BLUE_WOMB) {
      return;
    }

    npc.Remove();
    spawnNPCWithSeed(
      EntityType.HUSH,
      0,
      0,
      VANILLA_HUSH_SPAWN_POSITION,
      npc.InitSeed,
    );
  }

  // 28, 950
  @Callback(ModCallback.POST_NPC_RENDER, EntityType.DOGMA)
  postNPCRenderDogma(npc: EntityNPC): void {
    this.deathFadeOut(npc);
  }

  /**
   * In season 3, dogma is removed in the middle of his phase 2 death animation, which looks buggy.
   * To counteract this, slowly fade him out as he dies.
   */
  deathFadeOut(npc: EntityNPC): void {
    const sprite = npc.GetSprite();
    const animation = sprite.GetAnimation();
    if (animation !== "Death") {
      return;
    }

    const frame = sprite.GetFrame();
    const alpha = 1 - frame * 0.025;
    const fadeColor = Color(1, 1, 1, alpha, 0, 0, 0);
    npc.SetColor(fadeColor, 1000, 0, true, true);
  }

  // 68, 950, 2
  @CallbackCustom(
    ModCallbackCustom.POST_ENTITY_KILL_FILTER,
    EntityType.DOGMA,
    DogmaVariant.ANGEL_PHASE_2,
  )
  postEntityKillDogma(entity: Entity): void {
    if (!season3HasDogmaGoal()) {
      return;
    }

    // The Big Chest will be replaced by a Checkpoint or Trophy on the subsequent frame.
    const centerPos = g.r.GetCenterPos();
    spawnPickup(PickupVariant.BIG_CHEST, 0, centerPos);

    // When Dogma dies, it triggers the static fade out effect, which will take the player to the
    // Beast Room. In this circumstance, since we are not on the Home floor, the game will crash.
    // Thus, we need to stop the fade out effect from occurring. Since the effect is only triggered
    // once Dogma's death animation ends, we can prevent the effect by removing Dogma on the frame
    // before the death animation completes.
    const entityPtr = EntityPtr(entity);
    mod.runInNGameFrames(() => {
      const futureEntity = entityPtr.Ref;
      if (futureEntity !== undefined) {
        futureEntity.Remove();
      }
    }, 41); // 42 triggers the static.
  }

  /** This intentionally does not use the `PRE_SPAWN_CLEAR_AWARD` callback. */
  @CallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, true)
  postRoomClearChangedTrue(): void {
    this.checkHushCleared();
  }

  /**
   * Fast clear will be triggered after clearing Hush, so to avoid conflicting with that feature, we
   * spawn the Checkpoint in the `POST_ROOM_CLEAR_CHANGED` callback, which only triggers on the
   * subsequent frame.
   */
  checkHushCleared(): void {
    const stage = g.l.GetStage();
    const roomType = g.r.GetType();

    if (
      stage === LevelStage.BLUE_WOMB &&
      roomType === RoomType.BOSS &&
      isRoomInsideGrid() &&
      season3HasHushGoal()
    ) {
      removeAllTrapdoors();
      removeAllEffects(EffectVariant.HEAVEN_LIGHT_DOOR);

      // The Big Chest will be replaced by a Checkpoint or Trophy on the subsequent frame.
      const centerPos = g.r.GetCenterPos();
      spawnPickup(PickupVariant.BIG_CHEST, 0, centerPos);
    }
  }

  @CallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP)
  preItemPickup(): void {
    // We don't check for the Polaroid / Negative because the players could re-roll the photos.
    this.spawnTrapdoorOnTakeMomCollectible();
  }

  /**
   * We need to spawn an extra trapdoor in two situations:
   * - If on Depths 2, spawn an extra trapdoor to Mausoleum 2 (Dogma).
   * - If on Mausoleum 2, spawn an extra trapdoor to Womb 1.
   */
  spawnTrapdoorOnTakeMomCollectible(): void {
    if (v.run.season3TrapdoorBetweenPhotosSpawned) {
      return;
    }

    if (!inClearedMomBossRoom()) {
      return;
    }

    // Depths 2 --> Mausoleum 2 (Dogma)
    if (!onRepentanceStage() && !season3HasDogmaGoal()) {
      return;
    }

    // Mausoleum 2 --> Womb 1
    if (onRepentanceStage() && !season3HasGoalThroughWomb1()) {
      return;
    }

    spawnTrapdoorWithVariant(
      TrapdoorVariant.NORMAL,
      SEASON_3_INVERTED_TRAPDOOR_GRID_INDEX,
    );

    v.run.season3TrapdoorBetweenPhotosSpawned = true;
  }
}