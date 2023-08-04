import {
  CollectibleType,
  EffectVariant,
  EntityType,
  FamiliarVariant,
  ModCallback,
  PoofSubType,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  VectorOne,
  checkFamiliarFromCollectibles,
  game,
  getBosses,
  getCollectibles,
  getFamiliars,
  inRoomType,
  isStoryBoss,
  spawnEffect,
  spawnNPC,
} from "isaacscript-common";
import { mod } from "../../../../mod";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const VANISHING_TWIN_BOSS_HP_MULTIPLIER = 0.75; // Matches vanilla
const VANISHING_TWIN_BOSS_SPEED_MULTIPLIER = 0.75; // Matches vanilla

const v = {
  room: {
    duplicatedBossPtrHash: null as PtrHash | null,
    shouldSpawnTwoBossItems: false,
    spawnClearAwardFrame: null as int | null,
  },
};

export class FastVanishingTwin extends ConfigurableModFeature {
  configKey: keyof Config = "FastVanishingTwin";
  v = v;

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    this.checkRoomCleared();
  }

  checkRoomCleared(): void {
    if (v.room.spawnClearAwardFrame === null) {
      return;
    }

    const gameFrameCount = game.GetFrameCount();
    if (gameFrameCount < v.room.spawnClearAwardFrame) {
      return;
    }
    v.room.spawnClearAwardFrame = null;

    // Now that the room is cleared, spawn the second collectible item.
    const freshCollectible = this.getFreshlySpawnedCollectible();
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

  getFreshlySpawnedCollectible(): EntityPickup | undefined {
    const collectibles = getCollectibles();
    return collectibles.find((collectible) => collectible.FrameCount === 0);
  }

  // 28
  @Callback(ModCallback.POST_NPC_RENDER)
  postNPCRender(npc: EntityNPC): void {
    if (v.room.duplicatedBossPtrHash === null) {
      return;
    }

    const ptrHash = GetPtrHash(npc);
    if (ptrHash !== v.room.duplicatedBossPtrHash) {
      return;
    }

    const sprite = npc.GetSprite();
    sprite.PlaybackSpeed = VANISHING_TWIN_BOSS_SPEED_MULTIPLIER;
  }

  // 70
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    if (!v.room.shouldSpawnTwoBossItems) {
      return undefined;
    }

    v.room.shouldSpawnTwoBossItems = false;
    v.room.spawnClearAwardFrame = game.GetFrameCount();

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED)
  postNewLevelReordered(): void {
    const player = Isaac.GetPlayer();
    checkFamiliarFromCollectibles(
      player,
      CollectibleType.VANISHING_TWIN,
      FamiliarVariant.VANISHING_TWIN,
    );
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const vanishingTwins = getFamiliars(FamiliarVariant.VANISHING_TWIN);
    if (vanishingTwins.length === 0) {
      return;
    }

    const room = game.GetRoom();

    // Vanishing Twin only takes effect in Boss Rooms.
    if (!inRoomType(RoomType.BOSS)) {
      return;
    }

    // Vanishing Twin only takes effect in uncleared rooms.
    const roomClear = room.IsClear();
    if (roomClear) {
      return;
    }

    const bosses = getBosses();

    // Dark Esau counts as a boss, so we need to filter him out, if present.
    const filteredBosses = bosses.filter(
      (boss) => boss.Type !== EntityType.DARK_ESAU,
    );

    // It is difficult to properly duplicate double champion bosses or multi-segment bosses. Use the
    // vanilla behavior in these cases.
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

    this.duplicateBoss(boss);
  }

  duplicateBoss(boss: EntityNPC): void {
    v.room.shouldSpawnTwoBossItems = true;

    // If the bosses start on the same tile, it looks buggy. By not spawning the new boss on the
    // exact same position, it will run the collision code and push it properly to the side.
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

    // Account for the vanilla mechanic where duplicated bosses have a portion of their HP taken
    // away.
    boss.HitPoints *= VANISHING_TWIN_BOSS_HP_MULTIPLIER;
    duplicatedBoss.HitPoints *= VANISHING_TWIN_BOSS_HP_MULTIPLIER;

    // Update it so that the collision pushes it away from the other boss.
    duplicatedBoss.Update();

    v.room.duplicatedBossPtrHash = GetPtrHash(duplicatedBoss);
  }
}
