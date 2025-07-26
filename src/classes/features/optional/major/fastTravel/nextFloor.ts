import {
  Direction,
  EntityType,
  GameStateFlag,
  LevelStage,
  NullItemID,
  StageType,
} from "isaac-typescript-definitions";
import {
  calculateStageTypeRepentance,
  game,
  getNextStage,
  getNextStageType,
  getPlayers,
  onRepentanceStage,
  onStage,
  removeAllMatchingEntities,
  setStage,
} from "isaacscript-common";
import { inRaceToBeast } from "../../../../../features/race/v";
import { onSeason } from "../../../../../speedrun/utilsSpeedrun";
import { inClearedMomBossRoom } from "../../../../../utils";
import {
  seededFloorsAfter,
  seededFloorsBefore,
} from "../../../mandatory/misc/SeededFloors";
import { setDreamCatcherArrivedOnNewFloor } from "../../quality/showDreamCatcher/v";
import { v } from "./v";

export function gotoNextFloor(travelDirection: Direction): void {
  const hud = game.GetHUD();

  // We use custom functions to handle Racing+ specific logic for floor travel.
  const nextStage = getNextStageCustom(travelDirection);
  const nextStageType = getNextStageTypeCustom(travelDirection, nextStage);

  // The effect of Reverse Empress cards are supposed to end after one minute passive. However,
  // taking away the health and re-adding it will cause the extra two red heart containers to not be
  // removed properly once the minute ends. Thus, we cut the effect short now.
  for (const player of getPlayers()) {
    const effects = player.GetEffects();
    effects.RemoveNullEffect(NullItemID.REVERSE_EMPRESS);
  }

  // The effect of Reverse Sun cards are supposed to end upon reaching a new floor, so we can remove
  // the effect now so that it will not interfere with the recording of the player's current health.
  for (const player of getPlayers()) {
    const effects = player.GetEffects();
    effects.RemoveNullEffect(NullItemID.REVERSE_SUN);
  }

  // If Tainted Jacob loses Anime Sola for any reason, it can cause multiple Dark Esau's to spawn
  // upon reaching a new floor. Since Dark Esau is never supposed to persist between floors, we can
  // safely remove all Dark Esau entities at this point.
  removeAllMatchingEntities(EntityType.DARK_ESAU);

  // The fast-travel feature prevents the Perfection trinket from spawning. Using the
  // "WithoutDamage" methods of the Game class do not work properly, so we revert to keeping track
  // of damage manually.
  if (!v.level.tookDamage) {
    v.run.perfection.floorsWithoutDamage++;
  }

  // Check to see if we need to take extra steps to seed the floor consistently by performing health
  // and inventory modifications.
  seededFloorsBefore();

  // If we do a "stage" command to go to the same floor that we are already on, it will use the same
  // floor layout as the previous floor. Thus, in these cases, we need to mark to perform a "reseed"
  // command after doing the "stage" command. However, when we travel to the same floor layout from
  // a Repentance exit, floors do not need to be reseeded for some reason.
  const reseed = onStage(nextStage) && !v.run.repentanceSecretExit;

  // Use the console to manually travel to the floor.
  setStage(nextStage, nextStageType, reseed);

  // Revert the health and inventory modifications.
  seededFloorsAfter();

  // Now that we have arrived on the new floor, we might need to perform a Dream Catcher warp.
  setDreamCatcherArrivedOnNewFloor();

  // Ensure that the HUD is visible. (The Planetarium fix code may have set it to false earlier
  // before warping around.)
  hud.SetVisible(true);
}

function getNextStageCustom(travelDirection: Direction): LevelStage {
  const backwardsPathInit = game.GetStateFlag(
    GameStateFlag.BACKWARDS_PATH_INIT,
  );
  const level = game.GetLevel();
  const stage = level.GetStage();
  const repentanceStage = onRepentanceStage();
  const ascentGoal = isAscentGoal();
  const clearedMomBossRoom = inClearedMomBossRoom();

  if (travelDirection === Direction.NO_DIRECTION) {
    return stage;
  }

  // In races to The Beast, take the player from the Mom room to Mausoleum 2.
  if (
    ascentGoal
    && clearedMomBossRoom
    && !repentanceStage
    && backwardsPathInit
  ) {
    return stage;
  }

  return getNextStage();
}

function getNextStageTypeCustom(
  travelDirection: Direction,
  nextStage: LevelStage,
): StageType {
  const backwardsPathInit = game.GetStateFlag(
    GameStateFlag.BACKWARDS_PATH_INIT,
  );
  const level = game.GetLevel();
  const stageType = level.GetStageType();
  const repentanceStage = onRepentanceStage();
  const ascentGoal = isAscentGoal();
  const clearedMomBossRoom = inClearedMomBossRoom();

  if (travelDirection === Direction.NO_DIRECTION) {
    return stageType;
  }

  // In races to The Beast, take the player from the Mom room to Mausoleum 2.
  if (
    ascentGoal
    && clearedMomBossRoom
    && !repentanceStage
    && backwardsPathInit
    && nextStage === LevelStage.DEPTHS_2
  ) {
    return calculateStageTypeRepentance(nextStage);
  }

  // In races to The Beast, spawn the player directly in Dark Home since going to Mom's Bed and
  // going back to Dogma is pointless.
  if (ascentGoal && nextStage === LevelStage.HOME) {
    return StageType.WRATH_OF_THE_LAMB;
  }

  const upwards = travelDirection === Direction.UP;
  return getNextStageType(upwards);
}

/**
 * Specific races and multi-character speedruns take the player to The Ascent in a non-vanilla way.
 */
function isAscentGoal(): boolean {
  return inRaceToBeast() || onSeason(3);
}
