import {
  DogmaVariant,
  EffectVariant,
  EntityType,
  HomeRoomSubType,
  LevelStage,
  StageType,
} from "isaac-typescript-definitions";
import {
  asNumber,
  countEntities,
  getRoomSubType,
  removeAllDoors,
  removeAllEffects,
  removeAllNPCs,
  spawnNPC,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { consoleCommand } from "../../../utils";

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.fastDogma) {
    return;
  }

  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomSubType = getRoomSubType();

  if (
    stage === LevelStage.HOME &&
    stageType === StageType.WRATH_OF_THE_LAMB &&
    roomSubType === asNumber(HomeRoomSubType.LIVING_ROOM)
  ) {
    enteredDogmaRoom();
  }
}

/**
 * We want to prevent the player from having to go inspect the TV in order to trigger the cutscene.
 * Thus, we manually remove all of the props (which will also remove the cutscene trigger) and then
 * manually set up the fight.
 */
function enteredDogmaRoom() {
  const centerPos = g.r.GetCenterPos();

  // Don't do anything if we already spawned Dogma. (It is possible to get here twice on the same
  // frame.)
  const numDogmas = countEntities(EntityType.DOGMA);
  if (numDogmas > 0) {
    return;
  }

  removeAllNPCs(EntityType.GENERIC_PROP);
  removeAllEffects(EffectVariant.ISAACS_CARPET);
  removeAllDoors();
  spawnNPC(EntityType.DOGMA, DogmaVariant.DOGMA_PHASE_1, 0, centerPos);
}

// ModCallback.POST_ENTITY_KILL (68)
// EntityType.DOGMA (950)
export function postEntityKillDogma(entity: Entity): void {
  if (!config.fastDogma) {
    return;
  }

  // This feature does not apply when playing Season 3.
  const challenge = Isaac.GetChallenge();
  if (challenge === ChallengeCustom.SEASON_3) {
    return;
  }

  // As soon as the player kills the second phase of Dogma, warp them to The Beast fight without
  // playing the cutscene.
  if (entity.Variant === asNumber(DogmaVariant.ANGEL_PHASE_2)) {
    consoleCommand("goto x.itemdungeon.666");
  }
}

// ModCallback.POST_NPC_RENDER (28)
// EntityType.DOGMA (950)
export function postNPCRenderDogma(npc: EntityNPC): void {
  if (!config.fastDogma) {
    return;
  }

  // Remove the long transition between phase 1 and phase 2.
  const sprite = npc.GetSprite();
  const animation = sprite.GetAnimation();
  if (animation === "Transition" || animation === "Appear") {
    sprite.SetLastFrame();
  }
}
