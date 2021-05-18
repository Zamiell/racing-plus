import { Vector.Zero } from "../constants";
import g from "../globals";
import { ChallengeCustom } from "./enums";
import { inSpeedrun } from "./misc";
import * as season3 from "./season3";
import * as season6 from "./season6";
import * as season7 from "./season7";

export function main(): void {
  if (!inSpeedrun()) {
    return;
  }

  if (RacingPlusData === null) {
    return;
  }

  stage8IAMERROR();
  season3.postNewRoom();
  checkCurseRoom(); // Season 4 and 6
  checkSacrificeRoom(); // Season 4 and 6
  season6.postNewRoom();
  season7.postNewRoom();
}

// Fix the bug where the "correct" exit always appears in the I AM ERROR room in custom challenges
// (1/2)
function stage8IAMERROR() {
  // Local variables
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const roomSeed = g.r.GetSpawnSeed();
  const gridSize = g.r.GetGridSize();

  if (stage !== 8 || roomType !== RoomType.ROOM_ERROR) {
    return;
  }

  // Find out whether we should spawn a passage up or down, depending on the room seed
  math.randomseed(roomSeed);
  const directionChance = math.random(1, 2);
  const goingUp = directionChance === 1;
  if (goingUp) {
    Isaac.DebugString(
      "Randomly decided that the I AM ERROR room direction should be up.",
    );
  } else {
    Isaac.DebugString(
      "Randomly decided that the I AM ERROR room direction should be down.",
    );
  }

  // Find any existing trapdoors
  let trapdoor: GridEntity | undefined;
  let trapdoorIndex: int | undefined;
  for (let i = 1; i <= gridSize; i++) {
    const gridEntity = g.r.GetGridEntity(i);
    if (gridEntity !== null) {
      const saveState = gridEntity.GetSaveState();
      if (saveState.Type === GridEntityType.GRID_TRAPDOOR) {
        trapdoor = gridEntity;
        trapdoorIndex = i;
        break;
      }
    }
  }

  // If we are going down and there is already a trapdoor, we don't need to do anything
  if (trapdoor !== undefined && !goingUp) {
    return;
  }

  // If we are going up and there is already a trapdoor, we need to remove it
  if (trapdoor !== undefined && trapdoorIndex !== undefined && goingUp) {
    g.r.RemoveGridEntity(trapdoorIndex, 0, false); // gridEntity.Destroy() does not work

    // Spawn a Heaven Door (it will get replaced with the fast-travel version on this frame)
    // Make the spawner entity the player so that we can distinguish it from the vanilla
    // heaven door
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariant.HEAVEN_LIGHT_DOOR,
      0,
      trapdoor.Position,
      Vector.Zero,
      g.p,
    );
    Isaac.DebugString("Replaced a trapdoor with a beam of light.");
    return;
  }

  // Find any existing beams of light
  const heavenDoors = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariant.HEAVEN_LIGHT_DOOR,
    -1,
    false,
    false,
  );
  let heavenDoor: Entity | undefined;
  if (heavenDoors.length > 0) {
    heavenDoor = heavenDoors[0];
  }

  // If we are going up and there is already a beam of light, we don't need to do anything
  if (heavenDoor !== undefined && goingUp) {
    return;
  }

  // If we are going down and there is already a beam of light, we need to remove it
  if (heavenDoor !== undefined && !goingUp) {
    heavenDoor.Remove();

    // Spawn a trapdoor (it will get replaced with the fast-travel version on this frame)
    Isaac.GridSpawn(GridEntityType.GRID_TRAPDOOR, 0, heavenDoor.Position, true);
    Isaac.DebugString("Replaced a beam of light with a trapdoor.");
  }
}

// In instant-start seasons, prevent people from resetting for a Curse Room
function checkCurseRoom() {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const IsFirstVisit = g.r.IsFirstVisit();
  const challenge = Isaac.GetChallenge();

  if (
    (challenge !== ChallengeCustom.R7_SEASON_4 &&
      challenge !== ChallengeCustom.R7_SEASON_6) ||
    g.speedrun.characterNum !== 1 ||
    stage !== 1 ||
    roomType !== RoomType.ROOM_CURSE ||
    !IsFirstVisit
  ) {
    return;
  }

  // Check to see if there are any pickups in the room
  const pickups = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    -1,
    -1,
    false,
    false,
  );
  for (const pickup of pickups) {
    pickup.Remove();
  }
  const slots = Isaac.FindByType(EntityType.ENTITY_SLOT, -1, -1, false, false);
  for (const slot of slots) {
    slot.Remove();
  }
  if (pickups.length > 0 || slots.length > 0) {
    g.p.AnimateSad();
    Isaac.DebugString(
      "Deleted all of the pickups in a Curse Room (during a no-reset run).",
    );
  }
}

// In instant-start seasons, prevent people from resetting for a Sacrifice Room
function checkSacrificeRoom() {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const gridSize = g.r.GetGridSize();
  const isFirstVisit = g.r.IsFirstVisit();
  const challenge = Isaac.GetChallenge();

  if (
    (challenge !== ChallengeCustom.R7_SEASON_4 &&
      challenge !== ChallengeCustom.R7_SEASON_6) ||
    g.speedrun.characterNum !== 1 ||
    stage !== 1 ||
    roomType !== RoomType.ROOM_SACRIFICE
  ) {
    return;
  }

  // On the first visit to a Sacrifice Room,
  // give a sign to the player that the spikes were intentionally deleted
  // Note that the spikes need to be deleted every time we enter the room,
  // as they will respawn once the player leaves
  if (isFirstVisit) {
    g.p.AnimateSad();
  }

  for (let i = 1; i <= gridSize; i++) {
    const gridEntity = g.r.GetGridEntity(i);
    if (gridEntity !== null) {
      const saveState = gridEntity.GetSaveState();
      if (saveState.Type === GridEntityType.GRID_SPIKES) {
        g.r.RemoveGridEntity(i, 0, false); // gridEntity.Destroy() does not work
      }
    }
  }
  Isaac.DebugString(
    "Deleted the spikes in a Sacrifice Room (during a no-reset run).",
  );
}
