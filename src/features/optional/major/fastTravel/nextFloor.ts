import g from "../../../../globals";
import {
  consoleCommand,
  getPlayers,
  getRoomIndex,
  isAntibirthStage,
} from "../../../../misc";
import { FastTravelState } from "./enums";

export function init(
  entity: GridEntity | EntityEffect,
  player: EntityPlayer,
  upwards: boolean,
): void {
  const roomIndex = getRoomIndex();

  // Begin the process of moving the player to the next floor
  // If this is a multiplayer game, only the player who touched the trapdoor / heaven door will play
  // the travelling animation
  g.run.fastTravel.state = FastTravelState.FadingToBlack;
  g.run.fastTravel.framesPassed = 0;
  g.run.fastTravel.upwards = upwards;
  g.run.fastTravel.blueWomb = roomIndex === GridRooms.ROOM_BLUE_WOOM_IDX;
  g.run.fastTravel.theVoid = roomIndex === GridRooms.ROOM_THE_VOID_IDX;
  g.run.fastTravel.antibirthSecretExit =
    roomIndex === GridRooms.ROOM_SECRET_EXIT_IDX;

  setPlayerAttributes(player, entity);
  warpForgottenBody(player);
  playTravellingAnimation(player, upwards);
}

function setPlayerAttributes(
  playerTouchedTrapdoor: EntityPlayer,
  entity: GridEntity | EntityEffect,
) {
  // Snap the player to the exact position of the trapdoor so that they cleanly jump down the hole
  playerTouchedTrapdoor.Position = entity.Position;
  immobilizeAllPlayers();
}

export function immobilizeAllPlayers(): void {
  if (g.run.fastTravel.state === FastTravelState.Disabled) {
    return;
  }

  // We want all players in the room to be immobile during the Fast-Travel process
  for (const player of getPlayers()) {
    player.Velocity = Vector.Zero;
    // We don't want enemy attacks to move the players
    player.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
    player.ControlsEnabled = false;
  }
}

export function mobilizeAllPlayers(): void {
  // Make it so that the players can move again
  for (const player of getPlayers()) {
    player.ControlsEnabled = true;
    player.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL;
  }
}

function warpForgottenBody(player: EntityPlayer) {
  // If The Soul is travelling to the next floor, the Forgotten body will also need to be teleported
  if (player.GetPlayerType() !== PlayerType.PLAYER_THESOUL) {
    return;
  }

  // If we change the position of the Forgotten Body manually,
  // it will warp back to the same spot on the next frame
  // Instead, manually switch to the Forgotten to avoid this bug
  g.run.switchForgotten = true;

  // Also warp the body to where The Soul is so that The Forgotten won't jump down through a normal
  // floor
  const forgottenBodies = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.FORGOTTEN_BODY,
    -1,
    false,
    false,
  );
  for (const forgottenBody of forgottenBodies) {
    forgottenBody.Position = player.Position;
  }
}

function playTravellingAnimation(player: EntityPlayer, upwards: boolean) {
  // Playing the vanilla animations results in the player re-appearing,
  // because the animations are not long enough to last for the full fade-out
  // Use custom animations instead that are 40 frames long
  let animation: string;
  if (upwards) {
    // The vanilla "LightTravel" animation is 28 frames long
    animation = "LightTravelCustom";
  } else {
    // The vanilla "Trapdoor" animation is 16 frames long
    animation = "TrapdoorCustom";
  }

  player.PlayExtraAnimation(animation);
}

export function goto(upwards: boolean): void {
  // Get the number and type of the next floor
  const stage = g.l.GetStage();
  const nextStage = getNextStage();
  const nextStageType = getNextStageType(nextStage, upwards);

  // If we do a "stage" command to go to the same floor that we are already on,
  // it will use the same floor layout as the previous floor
  // Thus, in these cases, we need to mark to perform a "reseed" command before doing the "stage"
  // command
  // However, when we travel to the same floor layout from an Antibirth exit,
  // floors do not need to be reseeded for some reason
  g.run.fastTravel.reseed =
    stage === nextStage && !g.run.fastTravel.antibirthSecretExit;

  // Executing a console command to change floors will not increment the "GetStagesWithoutDamage()"
  // variable
  // Thus, we have to set it increment it manually if the player did not take any damage on this
  // floor
  if (!g.run.level.fastTravel.tookDamage) {
    g.g.AddStageWithoutDamage();
  }

  // Check to see if we need to take extra steps to seed the floor consistently by performing health
  // and inventory modifications
  // seededFloors.before(nextStage); // TODO

  // Use the console to manually travel to the floor
  travelStage(nextStage, nextStageType);

  // Revert the health and inventory modifications
  // seededFloors.after(); // TODO
}

function getNextStage() {
  const stage = g.l.GetStage();

  if (g.run.fastTravel.blueWomb) {
    return 9;
  }

  if (g.run.fastTravel.theVoid) {
    return 12;
  }

  if (g.run.fastTravel.antibirthSecretExit) {
    return stage;
  }

  if (isAntibirthStage() && (stage === 2 || stage === 4 || stage === 6)) {
    // e.g. Downpour 2 goes to Caves 2
    return stage + 2;
  }

  if (stage === 8) {
    // If we are not in the Blue Womb entrance room, then we need to skip a floor
    // (since the Blue Womb is floor 9)
    return 10;
  }

  if (stage === 11) {
    // The Chest goes to The Chest
    // The Dark Room goes to the Dark Room
    return 11;
  }

  if (stage === 12) {
    // The Void goes to The Void
    return 12;
  }

  // By default, go to the next floor
  return (stage as int) + 1;
}

function getNextStageType(nextStage: int, upwards: boolean) {
  const stageType = g.l.GetStageType();

  if (g.run.fastTravel.antibirthSecretExit) {
    return getStageTypeAntibirth(stageType);
  }

  if (
    isAntibirthStage() &&
    (nextStage === 2 || nextStage === 4 || nextStage === 6)
  ) {
    return getStageTypeAntibirth(stageType);
  }

  if (nextStage === 9) {
    // Blue Womb does not have any alternate floors
    return 0;
  }

  if (nextStage === 10) {
    if (upwards) {
      // Go to Cathedral (10.1)
      return 1;
    }

    // Go to Sheol (10.0)
    return 0;
  }

  if (nextStage === 11) {
    if (stageType === 0) {
      // Sheol (10.0) goes to the Dark Room (11.0)
      return 0;
    }

    // Cathedral (10.1) goes to The Chest (11.1)
    return 1;
  }

  return getStageType(nextStage);
}

function getStageType(stage: int) {
  // The following is the game's internal code to determine the floor type
  // (this came directly from Spider)
  /*
    u32 Seed = g_Game->GetSeeds().GetStageSeed(NextStage);
    if (!g_Game->IsGreedMode()) {
      StageType = ((Seed % 2) == 0 && (
        ((NextStage == STAGE1_1 || NextStage == STAGE1_2) && gd.Unlocked(ACHIEVEMENT_CELLAR)) ||
        ((NextStage == STAGE2_1 || NextStage == STAGE2_2) && gd.Unlocked(ACHIEVEMENT_CATACOMBS)) ||
        ((NextStage == STAGE3_1 || NextStage == STAGE3_2) && gd.Unlocked(ACHIEVEMENT_NECROPOLIS)) ||
        ((NextStage == STAGE4_1 || NextStage == STAGE4_2)))
      ) ? STAGETYPE_WOTL : STAGETYPE_ORIGINAL;
    if (Seed % 3 == 0 && NextStage < STAGE5)
      StageType = STAGETYPE_AFTERBIRTH;
  */

  // Emulate what the game's internal code does
  const stageSeed = g.seeds.GetStageSeed(stage);

  if (stageSeed % 2 === 0) {
    return StageType.STAGETYPE_WOTL;
  }

  if (stageSeed % 3 === 0) {
    return StageType.STAGETYPE_AFTERBIRTH;
  }

  return StageType.STAGETYPE_ORIGINAL;
}

function getStageTypeAntibirth(stage: int) {
  // This algorithm is from Kilburn
  // We add one because the alt path is offset by 1 relative to the normal path
  const stageSeed = g.seeds.GetStageSeed(stage + 1);

  // Kilburn does not know why he divided the stage seed by 2 first
  if ((stageSeed / 2) % 2 === 0) {
    return StageType.STAGETYPE_REPENTANCE_B;
  }

  return StageType.STAGETYPE_REPENTANCE;
}

function travelStage(stage: int, stageType: int) {
  // Build the command that will take us to the next floor
  let command = `stage ${stage}`;
  if (stageType === StageType.STAGETYPE_WOTL) {
    command += "a";
  } else if (stageType === StageType.STAGETYPE_AFTERBIRTH) {
    command += "b";
  } else if (stageType === StageType.STAGETYPE_REPENTANCE) {
    command += "c";
  } else if (stageType === StageType.STAGETYPE_REPENTANCE_B) {
    command += "d";
  }

  consoleCommand(command);

  if (g.run.fastTravel.reseed) {
    g.run.fastTravel.reseed = false;

    // Doing a "reseed" immediately after a "stage" command won't mess anything up
    consoleCommand("reseed");
  }
}
