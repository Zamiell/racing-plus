import {
  BossID,
  CollectibleType,
  EntityFlag,
  EntityType,
  GameStateFlag,
  ModCallback,
  Music,
  PickupVariant,
  RoomType,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  AmbushType,
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  ReadonlySet,
  VectorZero,
  addRoomClearCharges,
  anyPlayerCloserThan,
  arrayRemove,
  findFreePosition,
  game,
  getAllNonStoryBosses,
  getEntityTypeVariantFromBossID,
  getNPCs,
  getRandomArrayElement,
  gridCoordinatesToWorldPosition,
  inRoomType,
  logError,
  musicManager,
  newRNG,
  openAllDoors,
  repeat,
  sfxManager,
  spawnCollectible,
  spawnNPC,
  spawnPickup,
} from "isaacscript-common";
import { EntityTypeCustom } from "../../../../enums/EntityTypeCustom";
import { inRaceToBossRush } from "../../../../features/race/v";
import { onSeason } from "../../../../speedrun/utilsSpeedrun";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import { setStreakText } from "../../mandatory/misc/StreakText";
import {
  getFastClearNumAliveBosses,
  getFastClearNumAliveEnemies,
} from "../major/fastClear/v";

const SPLITTING_BOSS_ENTITY_TYPE_SET = new ReadonlySet<EntityType>([
  EntityType.FISTULA_BIG, // 71
  EntityType.FISTULA_MEDIUM, // 72
  EntityType.FISTULA_SMALL, // 73
  EntityType.BLASTOCYST_BIG, // 74
  EntityType.BLASTOCYST_MEDIUM, // 75
  EntityType.BLASTOCYST_SMALL, // 76
  EntityType.FALLEN, // 81
  EntityType.BROWNIE, // 402
]);

const BOSS_POSITIONS = [
  gridCoordinatesToWorldPosition(7, 6), // Left of the items
  gridCoordinatesToWorldPosition(18, 7), // Right of the items
  gridCoordinatesToWorldPosition(12, 2), // Above the items
  /// gridCoordinatesToWorldPosition(13, 11), // Below the items (currently unused)
] as const;

/**
 * Krampus, Uriel, and Gabriel are not included in the boss set from the standard library, so we do
 * not have to exclude them. (We want to exclude them since they will drop items.)
 */
const BOSS_RUSH_EXCLUSIONS = [
  // Scolex is not a balanced boss for speedruns.
  BossID.SCOLEX, // 7

  // Mama Gurdy does not play well in a 2x2 room due to needing to be on the top wall.
  BossID.MAMA_GURDY, // 49

  // Reap Creep does not play well in a 2x2 room due to needing to be on the top wall.
  BossID.REAP_CREEP, // 74

  // Wormwood requires water to function correctly.
  BossID.WORMWOOD, // 76

  // Tuff Twins and The Shell require bombs to kill.
  BossID.TUFF_TWINS, // 80
  BossID.SHELL, // 96

  // Hornfel requires tracks to function correctly.
  BossID.HORNFEL, // 82

  // Great Gideon would not work properly in a Boss Rush room.
  BossID.GREAT_GIDEON, // 83

  // We do not want to make the player have to enter Rotgut for phase 2, as that would involve
  // leaving the Boss Rush room.
  BossID.ROTGUT, // 87

  // Clog's spin attack is unfair with other bosses on the screen.
  BossID.CLOG, // 92

  // Colostomia spin attack is not fair with other bosses on the screen at the same time.
  BossID.COLOSTOMIA, // 95
] as const;

const BOSS_RUSH_BOSSES: readonly BossID[] = (() => {
  const nonStoryBosses = getAllNonStoryBosses();
  return arrayRemove(nonStoryBosses, ...BOSS_RUSH_EXCLUSIONS);
})();

/** In vanilla, it spawns 2 bosses at a time for 15 waves. */
const NUM_TOTAL_BOSSES = 30;

/**
 * In vanilla it is 2, but we increase this to 3 in Racing+ so that the Boss Rush can be completed
 * faster.
 */
const NUM_BOSSES_PER_WAVE = 3;

const NUM_GAME_FRAMES_BETWEEN_WAVES = 20;

const v = {
  run: {
    inProgress: false,
    finished: false,

    /**
     * An array of entity type + variant strings, matching the format of the boss set from the
     * standard library.
     */
    selectedBosses: [] as readonly BossID[],
  },

  /**
   * In vanilla, saving and quitting in the middle of the Boss Rush will reset the wave back to 0.
   */
  room: {
    currentWave: 0,
    spawnWaveGameFrame: 0,
  },
};

export class FastBossRush extends ConfigurableModFeature {
  configKey: keyof Config = "FastBossRush";
  v = v;

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    if (inRoomType(RoomType.BOSS_RUSH)) {
      this.checkSpawnNextWave();
    }
  }

  checkSpawnNextWave(): void {
    if (!v.run.inProgress) {
      return;
    }

    // Don't do anything if we are in the short delay between waves.
    const gameFrameCount = game.GetFrameCount();
    if (v.room.spawnWaveGameFrame !== 0) {
      if (gameFrameCount >= v.room.spawnWaveGameFrame) {
        v.room.spawnWaveGameFrame = 0;
        this.spawnNextWave();
      }

      return;
    }

    const totalBossesDefeatedIfWaveIsClear =
      v.room.currentWave * NUM_BOSSES_PER_WAVE;

    if (!this.isWaveComplete(totalBossesDefeatedIfWaveIsClear)) {
      return;
    }

    if (v.room.currentWave > 0) {
      addRoomClearCharges();
    }

    // Find out if the Boss Rush is over.
    if (totalBossesDefeatedIfWaveIsClear >= NUM_TOTAL_BOSSES) {
      this.finish();
    } else {
      // Spawn the next wave after a short delay.
      v.room.spawnWaveGameFrame =
        gameFrameCount + NUM_GAME_FRAMES_BETWEEN_WAVES;
      v.room.currentWave++;
    }
  }

  spawnNextWave(): void {
    for (let i = 0; i < NUM_BOSSES_PER_WAVE; i++) {
      // Get the boss to spawn.
      const bossIndex =
        v.room.currentWave * NUM_BOSSES_PER_WAVE - NUM_BOSSES_PER_WAVE + i;
      const bossID = v.run.selectedBosses[bossIndex];
      if (bossID === undefined) {
        logError(
          `Failed to find the selected Boss Rush boss at index: ${bossIndex}`,
        );
        continue;
      }
      const [entityType, variant] = getEntityTypeVariantFromBossID(bossID);

      const numSegments = this.getNumBossSegments(entityType);
      const position = this.getBossSpawnPosition(i);

      repeat(numSegments, () => {
        spawnNPC(entityType, variant, 0, position);

        // Clutch is deliberately not spawned with 3 Clickety Clacks since they can wander far away
        // in a 2x2 room and cause a frustrating search.
      });
    }

    sfxManager.Play(SoundEffect.SUMMON_SOUND);

    // Display the wave number as streak text.
    const totalWaves = Math.floor(NUM_TOTAL_BOSSES / NUM_BOSSES_PER_WAVE);
    setStreakText(`Wave ${v.room.currentWave} / ${totalWaves}`);
  }

  getNumBossSegments(entityType: EntityType): int {
    switch (entityType) {
      // 19
      case EntityType.LARRY_JR: {
        return 10;
      }

      // 28
      case EntityType.CHUB: {
        return 3;
      }

      // 237
      case EntityType.GURGLING: {
        // Gurglings and Turdlings spawn in sets of 3. (This is how it is in the vanilla Boss Rush.)
        return 3;
      }

      // 918
      case EntityType.TURDLET: {
        // Turdlet functions slightly differently from Larry Jr. Instead of splitting when an
        // segment entity dies, HP is shared between segments and he splits into two halves. Thus,
        // having a Turdlet with more than 5 segments would cause more than 1 split. For this
        // reason, we use the vanilla value of 5 instead of matching the value for Larry Jr.
        return 5;
      }

      default: {
        return 1;
      }
    }
  }

  getBossSpawnPosition(bossNum: int): Readonly<Vector> {
    const room = game.GetRoom();

    const basePosition = BOSS_POSITIONS[bossNum];
    if (basePosition === undefined) {
      error(`Failed to get the base boss position for boss number: ${bossNum}`);
    }

    for (let i = 0; i < 100; i++) {
      const position = room.FindFreePickupSpawnPosition(basePosition, i, true);

      const gridEntity = room.GetGridEntityFromPos(position);

      // Ensure that we do not spawn a boss too close to the player or on top of red poop. (For some
      // reason, the `Room.FindFreePickupSpawnPosition` method will return positions that overlap
      // with red poop from Carrion Queen.)
      if (!anyPlayerCloserThan(position, 120) && gridEntity === undefined) {
        return position;
      }
    }

    // If we have not found a valid position after 100 iterations, something has gone wrong. Default
    // to spawning the boss at the base position.
    return basePosition;
  }

  isWaveComplete(totalBossesDefeatedIfWaveIsClear: int): boolean {
    // If this is the final wave, then we only want to proceed if every enemy is killed, not just
    // the bosses.
    if (totalBossesDefeatedIfWaveIsClear >= NUM_TOTAL_BOSSES) {
      const numAliveEnemies = this.getNumAliveEnemies();
      if (numAliveEnemies > 0) {
        return false;
      }

      // Allow splitting enemies to produce their offspring.
      return !this.doSplittingBossesExist();
    }

    // This is not the final wave, so only count alive bosses.
    const numAliveBosses = this.getNumAliveBosses();
    if (numAliveBosses > 0) {
      return false;
    }

    // Allow splitting enemies to produce their offspring.
    return !this.doSplittingBossesExist();
  }

  /**
   * This accounts for the "Room Clear Delay NPC" that we spawn to prevent the vanilla bosses from
   * spawning.
   */
  getNumAliveEnemies(): int {
    const numAliveEnemies = getFastClearNumAliveEnemies();
    return numAliveEnemies - 1;
  }

  /**
   * This accounts for the "Room Clear Delay NPC" that we spawn to prevent the vanilla bosses from
   * spawning.
   */
  getNumAliveBosses(): int {
    const numAliveBosses = getFastClearNumAliveBosses();
    return numAliveBosses - 1;
  }

  doSplittingBossesExist(): boolean {
    const npcs = getNPCs();
    return npcs.some((npc) => SPLITTING_BOSS_ENTITY_TYPE_SET.has(npc.Type));
  }

  finish(): void {
    v.run.inProgress = false;
    v.run.finished = true;
    game.SetStateFlag(GameStateFlag.BOSS_RUSH_DONE, true);

    this.spawnBossRushFinishReward();
    openAllDoors();
    sfxManager.Play(SoundEffect.DOOR_HEAVY_OPEN);

    // Because of the emulated Boss Rush, the battle music will continue to play.
    musicManager.Crossfade(Music.BOSS_OVER);

    // Announce the completion via streak text.
    setStreakText("Complete!");
  }

  spawnBossRushFinishReward(): void {
    const room = game.GetRoom();
    const roomSeed = room.GetSpawnSeed();
    const centerPos = room.GetCenterPos();

    const position = findFreePosition(centerPos, true);
    if (onSeason(3)) {
      // The big chest will get replaced with either a checkpoint or a trophy on the next frame.
      spawnPickup(PickupVariant.BIG_CHEST, 0, position);
      return;
    }

    if (inRaceToBossRush()) {
      // The big chest will get replaced with a trophy on the next frame.
      spawnPickup(PickupVariant.BIG_CHEST, 0, position);
    }

    spawnCollectible(CollectibleType.NULL, position, roomSeed);
  }

  @CallbackCustom(ModCallbackCustom.POST_AMBUSH_STARTED, AmbushType.BOSS_RUSH)
  postAmbushStartedBossRush(): void {
    this.startCustomBossRush();
  }

  startCustomBossRush(): void {
    v.run.inProgress = true;
    v.room.currentWave = 0;
    v.run.selectedBosses = this.getRandomBossRushBosses();

    // Now that the vanilla Boss Rush has been triggered, we need to prevent the vanilla bosses from
    // spawning. This is accomplished by immediately spawning a dummy boss, because the game will
    // wait for it to be killed before spawning the first wave. (Note that the "Room Clear Delay
    // Effect" does not work and a non-boss NPC does not work.)
    const roomClearDelayNPC = spawnNPC(
      EntityTypeCustom.ROOM_CLEAR_DELAY_NPC,
      0,
      0,
      VectorZero,
    );
    roomClearDelayNPC.ClearEntityFlags(EntityFlag.APPEAR);
  }

  getRandomBossRushBosses(): readonly BossID[] {
    const seeds = game.GetSeeds();
    const startSeed = seeds.GetStartSeed();
    const rng = newRNG(startSeed);

    const randomBosses: BossID[] = [];

    repeat(NUM_TOTAL_BOSSES, () => {
      const randomBoss = getRandomArrayElement(
        BOSS_RUSH_BOSSES,
        rng,
        randomBosses,
      );
      randomBosses.push(randomBoss);
    });

    return randomBosses;
  }

  /**
   * In vanilla, saving and quitting in the middle of the Boss Rush will reset the wave back to 0.
   * However, teleporting out of the room before completing it will mark it as being completed.
   * Thus, we need to emulate this. Note that the player will still be able to restart the Boss Rush
   * if they go back in and touch another collectible. (This is also how vanilla works.)
   */
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (
      v.run.inProgress
      && !v.run.finished
      && !inRoomType(RoomType.BOSS_RUSH)
    ) {
      v.run.inProgress = false;
    }
  }
}
