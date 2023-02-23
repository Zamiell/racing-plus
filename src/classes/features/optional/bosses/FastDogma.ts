import {
  DogmaVariant,
  EffectVariant,
  EntityType,
  HomeRoomSubType,
  LevelStage,
  ModCallback,
  PickupVariant,
  StageType,
} from "isaac-typescript-definitions";
import {
  asNumber,
  Callback,
  CallbackCustom,
  doesEntityExist,
  getRoomSubType,
  ModCallbackCustom,
  removeAllDoors,
  removeAllEffects,
  removeAllNPCs,
  spawnNPC,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { doesTrophyExist } from "../../../../features/mandatory/trophy";
import { onSeason } from "../../../../features/speedrun/speedrun";
import { g } from "../../../../globals";
import { consoleCommand } from "../../../../utils";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class FastDogma extends ConfigurableModFeature {
  configKey: keyof Config = "FastDogma";

  /** Remove the long transition between phase 1 and phase 2. */
  // 28, 950
  @Callback(ModCallback.POST_NPC_RENDER, EntityType.DOGMA)
  postNPCRenderDogma(npc: EntityNPC): void {
    const sprite = npc.GetSprite();
    const animation = sprite.GetAnimation();
    sprite.PlaybackSpeed =
      animation === "Transition" || animation === "Appear" ? 4 : 1;
  }

  @CallbackCustom(
    ModCallbackCustom.POST_ENTITY_KILL_FILTER,
    EntityType.DOGMA,
    DogmaVariant.ANGEL_PHASE_2,
  )
  postEntityKillDogmaAngelPhase2(): void {
    // This feature does not apply when playing Season 3.
    if (onSeason(3)) {
      return;
    }

    // As soon as the player kills the second phase of Dogma, warp them to The Beast fight without
    // playing the cutscene.
    consoleCommand("goto x.itemdungeon.666");
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const stage = g.l.GetStage();
    const stageType = g.l.GetStageType();
    const roomSubType = getRoomSubType();

    if (
      stage === LevelStage.HOME &&
      stageType === StageType.WRATH_OF_THE_LAMB &&
      roomSubType === asNumber(HomeRoomSubType.LIVING_ROOM)
    ) {
      this.enteredDogmaRoom();
    }
  }

  /**
   * We want to prevent the player from having to go inspect the TV in order to trigger the
   * cutscene. Thus, we manually remove all of the props (which will also remove the cutscene
   * trigger) and then manually set up the fight.
   */
  enteredDogmaRoom(): void {
    const centerPos = g.r.GetCenterPos();

    // Don't do anything if we already spawned Dogma. (It is possible to get here twice on the same
    // frame.)
    if (doesEntityExist(EntityType.DOGMA)) {
      return;
    }

    // Don't do anything if we have already defeated Dogma. (This is possible in Season 3.)
    const checkpointExists = doesEntityExist(
      EntityType.PICKUP,
      PickupVariant.COLLECTIBLE,
      CollectibleTypeCustom.CHECKPOINT,
    );
    if (checkpointExists || doesTrophyExist()) {
      return;
    }

    removeAllNPCs(EntityType.GENERIC_PROP);
    removeAllEffects(EffectVariant.ISAACS_CARPET);
    removeAllDoors();
    spawnNPC(EntityType.DOGMA, DogmaVariant.DOGMA_PHASE_1, 0, centerPos);
  }
}
