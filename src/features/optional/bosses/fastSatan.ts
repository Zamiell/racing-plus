// There is an annoying delay before The Fallen and the leeches spawn. To fix this, we manually
// spawn it as soon as the room is entered.

import {
  BossID,
  EntityType,
  FallenVariant,
  LeechVariant,
} from "isaac-typescript-definitions";
import {
  getNPCs,
  inBossRoomOf,
  log,
  newRNG,
  spawnWithSeed,
} from "isaacscript-common";
import { g } from "../../../globals";
import { mod } from "../../../mod";
import { config } from "../../../modConfigMenu";

const v = {
  room: {
    isContinuingRun: false,
  },
};

export function init(): void {
  mod.saveDataManager("fastSatan", v);
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStartedContinued(): void {
  if (!config.FastSatan) {
    return;
  }

  v.room.isContinuingRun = true;
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.FastSatan) {
    return;
  }

  // Prevent the bug where saving and continuing will cause a second Fallen to spawn.
  if (v.room.isContinuingRun) {
    return;
  }

  if (inUnclearedSatanRoom()) {
    spawnEnemies();
    primeStatue();
    log("Sped up Satan.");
  }
}

function inUnclearedSatanRoom() {
  const roomClear = g.r.IsClear();
  return !roomClear && inBossRoomOf(BossID.SATAN);
}

function spawnEnemies() {
  const centerPos = g.r.GetCenterPos();
  const roomSeed = g.r.GetSpawnSeed();
  const rng = newRNG(roomSeed);

  // Spawn 2x Kamikaze Leech.
  for (const gridIndex of [66, 68]) {
    const position = g.r.GetGridPosition(gridIndex);
    const leechSeed = rng.Next();
    spawnWithSeed(
      EntityType.LEECH,
      LeechVariant.KAMIKAZE_LEECH,
      0,
      position,
      leechSeed,
    );
  }

  // Spawn 1x Fallen.
  const fallenSeed = rng.Next();
  spawnWithSeed(
    EntityType.FALLEN,
    FallenVariant.FALLEN,
    0,
    centerPos,
    fallenSeed,
  );
}

function primeStatue() {
  // Prime the statue to wake up quicker.
  const satans = getNPCs(EntityType.SATAN);
  for (const satan of satans) {
    satan.I1 = 1;
  }
}
