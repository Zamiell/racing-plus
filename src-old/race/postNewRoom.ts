/*

import * as seededDeath from "../features/seededDeath";
import * as seededRooms from "../features/seededRooms";
import g from "../globals";
import * as misc from "../misc";
import * as sprites from "../sprites";
import { CollectibleTypeCustom } from "../types/enums";
import { THREE_DOLLAR_BILL_EFFECTS, VICTORY_LAP_BOSSES } from "./constants";

export function main(): void {
  // Remove some sprites if they are showing
  sprites.init("place2", "");
  sprites.init("dps-button", "");
  sprites.init("victory-lap-button", "");

  checkOpenMegaSatanDoor();
  checkVictoryLapBossReplace();

  // Check for the special death mechanic
  seededDeath.postNewRoom();
  seededDeath.postNewRoomCheckSacrificeRoom();

  // Check for rooms that should be manually seeded during seeded races
  seededRooms.postNewRoom();
}

function checkVictoryLapBossReplace() {
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomData = roomDesc.Data;
  const roomStageID = roomData.StageID;
  const roomVariant = roomData.Variant;
  const roomClear = g.r.IsClear();
  const roomSeed = g.r.GetSpawnSeed();

  // Check to see if we need to spawn Victory Lap bosses
  if (
    g.raceVars.finished &&
    !roomClear &&
    roomStageID === 0 &&
    // Blue Baby
    (roomVariant === 3390 ||
      roomVariant === 3391 ||
      roomVariant === 3392 ||
      roomVariant === 3393 ||
      // The Lamb
      roomVariant === 5130)
  ) {
    // Replace Blue Baby or The Lamb with some random bosses (based on the number of Victory Laps)
    const isaacs = Isaac.FindByType(EntityType.ENTITY_ISAAC);
    for (const entity of isaacs) {
      entity.Remove();
    }
    const lambs = Isaac.FindByType(EntityType.ENTITY_THE_LAMB);
    for (const entity of lambs) {
      entity.Remove();
    }

    let randomBossSeed = roomSeed;
    const numBosses = g.raceVars.victoryLaps + 1;
    for (let i = 1; i <= numBosses; i++) {
      randomBossSeed = misc.incrementRNG(randomBossSeed);
      math.randomSeed(randomBossSeed);
      const randomBossIndex = math.random(0, VICTORY_LAP_BOSSES.length - 1);
      const randomBoss = VICTORY_LAP_BOSSES[randomBossIndex];
      if (randomBoss[0] === EntityType.ENTITY_LARRYJR) {
        // Larry Jr. and The Hollow require multiple segments
        for (let j = 1; j <= 6; j++) {
          spawnBoss(randomBoss);
        }
      } else {
        spawnBoss(randomBoss);
      }
    }
    Isaac.DebugString(
      `Replaced Blue Baby / The Lamb with ${numBosses} random bosses.`,
    );
  }
}

function spawnBoss(bossArray: [int, int, int]) {
  const [entityType, variant, subType] = bossArray;
  Isaac.Spawn(
    entityType,
    variant,
    subType,
    g.r.GetCenterPos(),
    Vector.Zero,
    null,
  );
}

*/
