import {
  CollectibleType,
  EffectVariant,
  EntityType,
  FamiliarVariant,
  PoofSubType,
  RoomType,
} from "isaac-typescript-definitions";
import {
  findFreePosition,
  game,
  getBosses,
  getCollectibles,
  isStoryBoss,
  spawnEffect,
  spawnFamiliar,
  spawnNPC,
  VectorZero,
} from "isaacscript-common";
import g from "../../../globals";
import { mod } from "../../../mod";
import { config } from "../../../modConfigMenu";

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
  mod.saveDataManager("fastVanishingTwin", v);
}

// ModCallback.POST_UPDATE (1)
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

  const gameFrameCount = game.GetFrameCount();
  if (gameFrameCount < v.room.spawnClearAwardFrame) {
    return;
  }
  v.room.spawnClearAwardFrame = null;

  // Now that the room is cleared, spawn a second collectible item.
  const freshCollectible = getFreshlySpawnedCollectible();
  if (freshCollectible === undefined) {
    return;
  }

  // If we get a new random position for the second collectible, it could be blocking a Devil Room
  // or Angel Room. Instead, always spawn it to the right of the existing collectible.
  const gridIndex = g.r.GetGridIndex(freshCollectible.Position);
  const newGridIndex = gridIndex + 1; // To the right of the collectible
  const position = g.r.GetGridPosition(newGridIndex);
  const roomSeed = g.r.GetSpawnSeed();

  mod.spawnCollectible(CollectibleType.NULL, position, roomSeed);
}

function getFreshlySpawnedCollectible(): EntityPickup | undefined {
  const collectibles = getCollectibles();
  return collectibles.find((collectible) => collectible.FrameCount === 0);
}

// ModCallback.POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  if (!config.fastVanishingTwin) {
    return;
  }

  if (!v.run.shouldRespawnVanishingTwin) {
    return;
  }
  v.run.shouldRespawnVanishingTwin = false;

  const player = Isaac.GetPlayer();
  spawnFamiliar(
    FamiliarVariant.VANISHING_TWIN,
    0,
    player.Position,
    VectorZero,
    player,
  );
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.fastVanishingTwin) {
    return;
  }

  const roomType = g.r.GetType();
  if (roomType !== RoomType.BOSS) {
    return;
  }

  const vanishingTwins = Isaac.FindByType(
    EntityType.FAMILIAR,
    FamiliarVariant.VANISHING_TWIN,
  );
  if (vanishingTwins.length === 0) {
    return;
  }

  // It is difficult to properly duplicate double champion bosses or multi-segment bosses. Use the
  // vanilla behavior in these cases.
  const bosses = getBosses();
  if (bosses.length !== 1) {
    return;
  }
  const boss = bosses[0];
  if (boss === undefined) {
    return;
  }

  // Vanishing Twin does not apply to story bosses.
  if (isStoryBoss(boss.Type)) {
    return;
  }

  for (const vanishingTwin of vanishingTwins) {
    vanishingTwin.Remove();
    spawnEffect(
      EffectVariant.POOF_1,
      PoofSubType.SMALL,
      vanishingTwin.Position,
    );
  }
  v.run.shouldRespawnVanishingTwin = true;

  duplicateBoss(boss);
}

function duplicateBoss(boss: EntityNPC) {
  v.room.shouldSpawnTwoBossItems = true;

  // If the bosses start on the same tile, it looks buggy.
  const position = findFreePosition(boss.Position, true);

  const duplicatedBoss = spawnNPC(
    boss.Type,
    boss.Variant,
    boss.SubType,
    position,
    boss.Velocity,
    boss.SpawnerEntity,
    boss.InitSeed,
  );

  // Account for the vanilla mechanic where duplicated bosses have a portion of their HP taken away.
  boss.HitPoints *= HP_MULTIPLIER;
  duplicatedBoss.HitPoints *= HP_MULTIPLIER;
}

// ModCallback.PRE_SPAWN_CLEAN_AWARD (70)
export function preSpawnClearAward(): void {
  if (!config.fastVanishingTwin) {
    return;
  }

  if (!v.room.shouldSpawnTwoBossItems) {
    return;
  }

  const gameFrameCount = game.GetFrameCount();
  v.room.spawnClearAwardFrame = gameFrameCount;
}
