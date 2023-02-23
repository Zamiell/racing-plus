import {
  CollectibleType,
  EffectVariant,
  EntityType,
  FamiliarVariant,
  PoofSubType,
  RoomType,
} from "isaac-typescript-definitions";
import {
  checkFamiliarFromCollectibles,
  game,
  getBosses,
  getCollectibles,
  getFamiliars,
  isStoryBoss,
  spawnEffect,
  spawnNPC,
  VectorOne,
} from "isaacscript-common";
import { mod } from "../../../mod";
import { config } from "../../../modConfigMenu";

const HP_MULTIPLIER = 0.75; // Matches vanilla

const v = {
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
  if (!config.FastVanishingTwin) {
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

  // Now that the room is cleared, spawn the second collectible item.
  const freshCollectible = getFreshlySpawnedCollectible();
  if (freshCollectible === undefined) {
    return;
  }

  // If we get a new random position for the second collectible, it could be blocking a Devil Room
  // or Angel Room. Instead, always spawn it to the right of the existing collectible.
  const room = game.GetRoom();
  const gridIndex = room.GetGridIndex(freshCollectible.Position);
  const newGridIndex = gridIndex + 1; // To the right of the collectible
  const position = room.GetGridPosition(newGridIndex);
  const roomSeed = room.GetSpawnSeed();

  mod.spawnCollectible(CollectibleType.NULL, position, roomSeed);
}

function getFreshlySpawnedCollectible(): EntityPickup | undefined {
  const collectibles = getCollectibles();
  return collectibles.find((collectible) => collectible.FrameCount === 0);
}

// ModCallback.POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  if (!config.FastVanishingTwin) {
    return;
  }

  const player = Isaac.GetPlayer();
  checkFamiliarFromCollectibles(
    player,
    CollectibleType.VANISHING_TWIN,
    FamiliarVariant.VANISHING_TWIN,
  );
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.FastVanishingTwin) {
    return;
  }

  const vanishingTwins = getFamiliars(FamiliarVariant.VANISHING_TWIN);
  if (vanishingTwins.length === 0) {
    return;
  }

  const room = game.GetRoom();

  // Vanishing Twin only takes effect in Boss Rooms.
  const roomType = room.GetType();
  if (roomType !== RoomType.BOSS) {
    return;
  }

  // Vanishing Twin only takes effect in uncleared rooms.
  const roomClear = room.IsClear();
  if (roomClear) {
    return;
  }

  // It is difficult to properly duplicate double champion bosses or multi-segment bosses. Use the
  // vanilla behavior in these cases.
  const bosses = getBosses();

  // Dark Esau counts as a boss, so we need to filter him out, if present.
  const filteredBosses = bosses.filter(
    (boss) => boss.Type !== EntityType.DARK_ESAU,
  );

  if (filteredBosses.length !== 1) {
    return;
  }

  const boss = filteredBosses[0];
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

  duplicateBoss(boss);
}

function duplicateBoss(boss: EntityNPC) {
  v.room.shouldSpawnTwoBossItems = true;

  // If the bosses start on the same tile, it looks buggy. By not spawning the new boss on the exact
  // same position, it will run the collision code and push it properly to the side.
  const position = boss.Position.add(VectorOne);

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

  // Update it so that the collision pushes it away from the other boss.
  duplicatedBoss.Update();
}

// ModCallback.PRE_SPAWN_CLEAR_AWARD (70)
export function preSpawnClearAward(): void {
  if (!config.FastVanishingTwin) {
    return;
  }

  if (!v.room.shouldSpawnTwoBossItems) {
    return;
  }

  const gameFrameCount = game.GetFrameCount();
  v.room.spawnClearAwardFrame = gameFrameCount;
}
