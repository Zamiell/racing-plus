import {
  findFreePosition,
  getBosses,
  getCollectibles,
  saveDataManager,
  spawnCollectible,
} from "isaacscript-common";
import g from "../../../../globals";
import { config } from "../../../../modConfigMenu";
import { EXEMPTED_BOSSES } from "./constants";

const HP_MULTIPLIER = 0.75; // Matches vanilla

const v = {
  run: {
    shouldRespawnVanishingTwin: false,
  },

  room: {
    shouldSpawnTwoBossItems: false,
    spawnClearAwardFrame: null as int | null,
  },
};

export function init(): void {
  saveDataManager("fastVanishingTwin", v);
}

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  if (!config.fastVanishingTwin) {
    return;
  }

  checkRoomCleared();
}

function checkRoomCleared() {
  if (v.room.spawnClearAwardFrame === null) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();
  if (gameFrameCount < v.room.spawnClearAwardFrame) {
    return;
  }
  v.room.spawnClearAwardFrame = null;

  // Now that the room is cleared, spawn a second collectible item
  const freshCollectible = getFreshlySpawnedCollectible();
  if (freshCollectible === undefined) {
    return;
  }

  // If we get a new random position for the second collectible,
  // it could be blocking a Devil Room or Angel Room
  // Instead, always spawn it to the right of the existing collectible
  const gridIndex = g.r.GetGridIndex(freshCollectible.Position);
  const newGridIndex = gridIndex + 1; // To the right of the collectible
  const position = g.r.GetGridPosition(newGridIndex);

  spawnCollectible(CollectibleType.COLLECTIBLE_NULL, position);
}

function getFreshlySpawnedCollectible(): EntityPickup | undefined {
  for (const collectible of getCollectibles()) {
    if (collectible.FrameCount === 0) {
      return collectible;
    }
  }

  return undefined;
}

// ModCallbacks.MC_POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  if (!config.fastVanishingTwin) {
    return;
  }

  if (!v.run.shouldRespawnVanishingTwin) {
    return;
  }
  v.run.shouldRespawnVanishingTwin = false;

  const player = Isaac.GetPlayer();
  Isaac.Spawn(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.VANISHING_TWIN,
    0,
    player.Position,
    Vector.Zero,
    player,
  );
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.fastVanishingTwin) {
    return;
  }

  const roomType = g.r.GetType();
  if (roomType !== RoomType.ROOM_BOSS) {
    return;
  }

  const bosses = getBosses();
  if (bosses.length !== 1) {
    // It is difficult to properly duplicate double champion bosses
    // It is difficult to properly duplicate multi-segment bosses
    // Use the vanilla behavior in these cases
    return;
  }
  const boss = bosses[0];
  const bossID = boss.GetBossID();

  if (EXEMPTED_BOSSES.has(bossID)) {
    // Vanishing Twin don't apply to final bosses
    return;
  }

  const vanishingTwins = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.VANISHING_TWIN,
  );
  if (vanishingTwins.length === 0) {
    return;
  }

  for (const vanishingTwin of vanishingTwins) {
    vanishingTwin.Remove();
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariant.POOF01,
      PoofSubType.SMALL,
      vanishingTwin.Position,
      Vector.Zero,
      undefined,
    );
  }
  v.run.shouldRespawnVanishingTwin = true;

  duplicateBoss(boss);
}

function duplicateBoss(boss: EntityNPC) {
  v.room.shouldSpawnTwoBossItems = true;

  // If the bosses start on the same tile, it looks buggy
  const position = findFreePosition(boss.Position, true);

  const duplicatedBoss = g.g.Spawn(
    boss.Type,
    boss.Variant,
    position,
    boss.Velocity,
    boss.SpawnerEntity,
    boss.SubType,
    boss.InitSeed,
  );

  // Account for the vanilla mechanic where duplicated bosses have a portion of their HP taken away
  boss.HitPoints *= HP_MULTIPLIER;
  duplicatedBoss.HitPoints *= HP_MULTIPLIER;
}

// ModCallbacks.MC_PRE_SPAWN_CLEAN_AWARD (70)
export function preSpawnClearAward(): void {
  if (!config.fastVanishingTwin) {
    return;
  }

  if (!v.room.shouldSpawnTwoBossItems) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();
  v.room.spawnClearAwardFrame = gameFrameCount;
}
