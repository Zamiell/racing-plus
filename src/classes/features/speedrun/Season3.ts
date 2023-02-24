import {
  CollectibleType,
  DogmaVariant,
  DoorSlot,
  EffectVariant,
  EntityFlag,
  EntityType,
  GameStateFlag,
  ItemType,
  LevelStage,
  ModCallback,
  PickupVariant,
  PlayerType,
  RoomType,
  SoundEffect,
  StageType,
  TrapdoorVariant,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  arrayRemoveInPlace,
  Callback,
  CallbackCustom,
  changeRoom,
  copyArray,
  DOGMA_ROOM_GRID_INDEX,
  game,
  getBlueWombDoor,
  getRandomArrayElement,
  inBeastRoom,
  inMegaSatanRoom,
  inRoomType,
  inStartingRoom,
  isRoomInsideGrid,
  log,
  ModCallbackCustom,
  newRNG,
  onCathedral,
  onChest,
  onDarkRoom,
  onFirstFloor,
  onRepentanceStage,
  onSheol,
  onStage,
  removeAllEffects,
  removeAllTrapdoors,
  removeCollectibleFromPools,
  removeDoor,
  repeat,
  setStage,
  sfxManager,
  spawnNPC,
  spawnNPCWithSeed,
  spawnPickup,
  spawnTrapdoorWithVariant,
  VectorZero,
} from "isaacscript-common";
import { BigChestReplacementAction } from "../../../enums/BigChestReplacementAction";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";
import { EntityTypeCustom } from "../../../enums/EntityTypeCustom";
import { ItLivesSituation } from "../../../enums/ItLivesSituation";
import { Season3Goal } from "../../../enums/Season3Goal";
import { isDreamCatcherWarping } from "../../../features/optional/quality/showDreamCatcherItem/v";
import { giveDiversityItemsAndDoItemBans } from "../../../features/race/formatSetup";
import {
  isOnFinalCharacter,
  isOnFirstCharacter,
} from "../../../features/speedrun/speedrun";
import { mod } from "../../../mod";
import {
  addCollectibleAndRemoveFromPools,
  inClearedMomBossRoom,
} from "../../../utils";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { hasErrors } from "../mandatory/checkErrors/v";
import {
  NUM_DIVERSITY_PASSIVE_COLLECTIBLES,
  SEASON_3_GOALS,
  SEASON_3_INVERTED_TRAPDOOR_GRID_INDEX,
  VANILLA_HUSH_SPAWN_POSITION,
} from "./season3/constants";
import {
  BANNED_DIVERSITY_COLLECTIBLES_SEASON_ONLY,
  DIVERSITY_ACTIVE_COLLECTIBLE_TYPES,
  DIVERSITY_CHARACTER_BANNED_COLLECTIBLE_TYPES,
  DIVERSITY_CHARACTER_BANNED_TRINKET_TYPES,
  DIVERSITY_PASSIVE_COLLECTIBLE_TYPES,
} from "./season3/constantsCollectibles";
import { DIVERSITY_TRINKET_TYPES } from "./season3/constantsTrinkets";
import { season3CheckDrawGoals } from "./season3/drawGoals";
import {
  season3DrawStartingRoomSprites,
  season3DrawStartingRoomText,
  season3InitStartingRoomSprites,
  season3ResetStartingRoomSprites,
} from "./season3/startingRoomSprites";
import {
  season3HasBlueBabyGoal,
  season3HasDogmaGoal,
  season3HasGoalThroughWomb1,
  season3HasHushGoal,
  season3HasLambGoal,
  season3HasMegaSatanGoal,
  v,
} from "./season3/v";

export class Season3 extends ChallengeModFeature {
  challenge = ChallengeCustom.SEASON_3;
  v = v;

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (hasErrors()) {
      return;
    }

    const hud = game.GetHUD();
    if (!hud.IsVisible()) {
      return;
    }

    season3DrawStartingRoomSprites();
    season3DrawStartingRoomText();
    season3CheckDrawGoals();
  }

  // 23, 422
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.GLOWING_HOUR_GLASS)
  preUseItemGlowingHourGlass(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    return this.preventHomeWarp(player);
  }

  /**
   * It is possible to warp to Home by using the Glowing Hour Glass on the first room of the run.
   */
  preventHomeWarp(player: EntityPlayer): boolean | undefined {
    if (onFirstFloor() && inStartingRoom()) {
      player.AnimateSad();
      return true;
    }

    return undefined;
  }

  // 27, 102
  @Callback(ModCallback.POST_NPC_INIT, EntityType.ISAAC)
  postNPCInitIsaac(npc: EntityNPC): void {
    if (!onStage(LevelStage.BLUE_WOMB)) {
      return;
    }

    npc.Remove();
    spawnNPCWithSeed(
      EntityType.HUSH,
      0,
      0,
      VANILLA_HUSH_SPAWN_POSITION,
      npc.InitSeed,
    );
  }

  // 28, 950
  @Callback(ModCallback.POST_NPC_RENDER, EntityType.DOGMA)
  postNPCRenderDogma(npc: EntityNPC): void {
    this.deathFadeOut(npc);
  }

  /**
   * In season 3, dogma is removed in the middle of his phase 2 death animation, which looks buggy.
   * To counteract this, slowly fade him out as he dies.
   */
  deathFadeOut(npc: EntityNPC): void {
    const sprite = npc.GetSprite();
    const animation = sprite.GetAnimation();
    if (animation !== "Death") {
      return;
    }

    const frame = sprite.GetFrame();
    const alpha = 1 - frame * 0.025;
    const fadeColor = Color(1, 1, 1, alpha, 0, 0, 0);
    npc.SetColor(fadeColor, 1000, 0, true, true);
  }

  // 68, 950, 2
  @CallbackCustom(
    ModCallbackCustom.POST_ENTITY_KILL_FILTER,
    EntityType.DOGMA,
    DogmaVariant.ANGEL_PHASE_2,
  )
  postEntityKillDogma(entity: Entity): void {
    if (!season3HasDogmaGoal()) {
      return;
    }

    const room = game.GetRoom();

    // The Big Chest will be replaced by a Checkpoint or Trophy on the subsequent frame.
    const centerPos = room.GetCenterPos();
    spawnPickup(PickupVariant.BIG_CHEST, 0, centerPos);

    // When Dogma dies, it triggers the static fade out effect, which will take the player to the
    // Beast Room. In this circumstance, since we are not on the Home floor, the game will crash.
    // Thus, we need to stop the fade out effect from occurring. Since the effect is only triggered
    // once Dogma's death animation ends, we can prevent the effect by removing Dogma on the frame
    // before the death animation completes.
    const entityPtr = EntityPtr(entity);
    mod.runInNGameFrames(() => {
      const futureEntity = entityPtr.Ref;
      if (futureEntity !== undefined) {
        futureEntity.Remove();
      }
    }, 41); // 42 triggers the static.
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    if (hasErrors()) {
      return;
    }

    const seeds = game.GetSeeds();
    const player = Isaac.GetPlayer();

    if (isOnFirstCharacter()) {
      v.persistent.remainingGoals = copyArray(SEASON_3_GOALS);
    }

    this.giveStartingItems(player);

    // In addition to the "normal" diversity bans, some additional items are removed from pools.
    removeCollectibleFromPools(...BANNED_DIVERSITY_COLLECTIBLES_SEASON_ONLY);

    const startSeed = seeds.GetStartSeed();
    const { collectibleTypes, trinketType } = this.getRandomDiversityItems(
      player,
      startSeed,
    );
    giveDiversityItemsAndDoItemBans(player, collectibleTypes, trinketType);

    season3InitStartingRoomSprites(collectibleTypes, trinketType);
  }

  /** Some characters start with additional items to make them stronger. */
  giveStartingItems(player: EntityPlayer): void {
    const character = player.GetPlayerType();

    switch (character) {
      // 4, 24
      case PlayerType.BLUE_BABY:
      case PlayerType.JUDAS_B: {
        addCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
        break;
      }

      default: {
        break;
      }
    }
  }

  getRandomDiversityItems(
    player: EntityPlayer,
    startSeed: Seed,
  ): { collectibleTypes: CollectibleType[]; trinketType: TrinketType } {
    const rng = newRNG(startSeed);
    const character = player.GetPlayerType();

    let activeCollectibleType: CollectibleType;
    do {
      activeCollectibleType = getRandomArrayElement(
        DIVERSITY_ACTIVE_COLLECTIBLE_TYPES,
        rng,
      );
    } while (
      player.HasCollectible(activeCollectibleType) ||
      this.isCollectibleTypeBannedOnThisCharacter(
        activeCollectibleType,
        character,
      )
    );

    const passiveCollectibleTypes: CollectibleType[] = [];
    repeat(NUM_DIVERSITY_PASSIVE_COLLECTIBLES, () => {
      let passiveCollectibleType: CollectibleType;
      do {
        passiveCollectibleType = getRandomArrayElement(
          DIVERSITY_PASSIVE_COLLECTIBLE_TYPES,
          rng,
          passiveCollectibleTypes,
        );
      } while (
        player.HasCollectible(passiveCollectibleType) ||
        this.isCollectibleTypeBannedOnThisCharacter(
          activeCollectibleType,
          character,
        )
      );
      passiveCollectibleTypes.push(passiveCollectibleType);
    });

    let trinketType: TrinketType;
    do {
      trinketType = getRandomArrayElement(DIVERSITY_TRINKET_TYPES, rng);
    } while (
      player.HasTrinket(trinketType) ||
      this.isTrinketTypeBannedOnThisCharacter(trinketType, character)
    );

    const collectibleTypes = [
      activeCollectibleType,
      ...passiveCollectibleTypes,
    ];

    return { collectibleTypes, trinketType };
  }

  isCollectibleTypeBannedOnThisCharacter(
    collectibleType: CollectibleType,
    character: PlayerType,
  ): boolean {
    const bannedCollectibleTypes =
      DIVERSITY_CHARACTER_BANNED_COLLECTIBLE_TYPES.get(character);
    if (bannedCollectibleTypes === undefined) {
      return false;
    }

    return bannedCollectibleTypes.has(collectibleType);
  }

  isTrinketTypeBannedOnThisCharacter(
    trinketType: TrinketType,
    character: PlayerType,
  ): boolean {
    const bannedTrinketTypes =
      DIVERSITY_CHARACTER_BANNED_TRINKET_TYPES.get(character);
    if (bannedTrinketTypes === undefined) {
      return false;
    }

    return bannedTrinketTypes.has(trinketType);
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (!mod.inFirstRoom()) {
      season3ResetStartingRoomSprites();
    }

    this.checkSpawnMegaSatanDoor();
    this.checkDadsNoteRoom();
    this.checkBeastRoom();
    this.checkBlueWombRoom();
  }

  checkSpawnMegaSatanDoor(): void {
    const room = game.GetRoom();

    if (!onStage(LevelStage.DARK_ROOM_CHEST) || !inStartingRoom()) {
      return;
    }

    if (!season3HasMegaSatanGoal() || isOnFirstCharacter()) {
      return;
    }

    room.TrySpawnMegaSatanRoomDoor(true); // It has to be forced in order to work.
    const topDoor = room.GetDoor(DoorSlot.UP_0);
    if (topDoor !== undefined) {
      const player = Isaac.GetPlayer();
      topDoor.TryUnlock(player, true);
      sfxManager.Stop(SoundEffect.UNLOCK);
    }
  }

  checkDadsNoteRoom(): void {
    const backwardsPathInit = game.GetStateFlag(
      GameStateFlag.BACKWARDS_PATH_INIT,
    );
    const repentanceStage = onRepentanceStage();
    const roomInsideGrid = isRoomInsideGrid();

    if (
      season3HasDogmaGoal() &&
      onStage(LevelStage.DEPTHS_2) &&
      repentanceStage &&
      inRoomType(RoomType.BOSS) &&
      roomInsideGrid &&
      backwardsPathInit &&
      !isDreamCatcherWarping()
    ) {
      // Take them directly to Home to avoid wasting time.
      setStage(LevelStage.HOME, StageType.WRATH_OF_THE_LAMB);
      changeRoom(DOGMA_ROOM_GRID_INDEX);
      this.spawnRoomClearDelayNPC();
    }
  }

  /**
   * If we clear the room, a random pickup will spawn, which may interfere with picking up the
   * checkpoint/trophy. Since we spawn the Big Chest based on when Dogma dies, we can safely spawn a
   * room clear delay NPC to prevent the normal room clear from ever happening.
   *
   * Using a room clear delay effect for this purpose does not work.
   */
  spawnRoomClearDelayNPC(): void {
    const roomClearDelayNPC = spawnNPC(
      EntityTypeCustom.ROOM_CLEAR_DELAY_NPC,
      0,
      0,
      VectorZero,
    );
    roomClearDelayNPC.ClearEntityFlags(EntityFlag.APPEAR);
    log('Spawned the "Room Clear Delay NPC" custom entity (for Dogma).');
  }

  /**
   * Sometimes, Dogma will not play its death animation for an unknown reason. If this happens, the
   * player will be teleported to The Beast room. Try to detect this and teleport them back.
   */
  checkBeastRoom(): void {
    if (inBeastRoom()) {
      // We do not need to change the stage, as doing that would delete the spawned Checkpoint.
      changeRoom(DOGMA_ROOM_GRID_INDEX);
    }
  }

  /** Guard against the player accidentally going to Hush. */
  checkBlueWombRoom(): void {
    if (season3HasHushGoal()) {
      return;
    }

    const blueWombDoor = getBlueWombDoor();
    if (blueWombDoor !== undefined) {
      removeDoor(blueWombDoor);
    }
  }

  /** This intentionally does not use the `PRE_SPAWN_CLEAR_AWARD` callback. */
  @CallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, true)
  postRoomClearChangedTrue(): void {
    this.checkHushCleared();
  }

  /**
   * Fast clear will be triggered after clearing Hush, so to avoid conflicting with that feature, we
   * spawn the Checkpoint in the `POST_ROOM_CLEAR_CHANGED` callback, which only triggers on the
   * subsequent frame.
   */
  checkHushCleared(): void {
    const room = game.GetRoom();

    if (
      onStage(LevelStage.BLUE_WOMB) &&
      inRoomType(RoomType.BOSS) &&
      isRoomInsideGrid() &&
      season3HasHushGoal()
    ) {
      removeAllTrapdoors();
      removeAllEffects(EffectVariant.HEAVEN_LIGHT_DOOR);

      // The Big Chest will be replaced by a Checkpoint or Trophy on the subsequent frame.
      const centerPos = room.GetCenterPos();
      spawnPickup(PickupVariant.BIG_CHEST, 0, centerPos);
    }
  }

  @CallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP)
  preItemPickup(): void {
    // We don't check for the Polaroid / Negative because the players could re-roll the photos.
    this.spawnTrapdoorOnTakeMomCollectible();
  }

  /**
   * We need to spawn an extra trapdoor in two situations:
   * - If on Depths 2, spawn an extra trapdoor to Mausoleum 2 (Dogma).
   * - If on Mausoleum 2, spawn an extra trapdoor to Womb 1.
   */
  spawnTrapdoorOnTakeMomCollectible(): void {
    if (v.run.season3TrapdoorBetweenPhotosSpawned) {
      return;
    }

    if (!inClearedMomBossRoom()) {
      return;
    }

    // Depths 2 --> Mausoleum 2 (Dogma)
    if (!onRepentanceStage() && !season3HasDogmaGoal()) {
      return;
    }

    // Mausoleum 2 --> Womb 1
    if (onRepentanceStage() && !season3HasGoalThroughWomb1()) {
      return;
    }

    spawnTrapdoorWithVariant(
      TrapdoorVariant.NORMAL,
      SEASON_3_INVERTED_TRAPDOOR_GRID_INDEX,
    );

    v.run.season3TrapdoorBetweenPhotosSpawned = true;
  }

  @CallbackCustom(
    ModCallbackCustom.PRE_ITEM_PICKUP,
    ItemType.PASSIVE,
    CollectibleTypeCustom.CHECKPOINT,
  )
  preItemPickupCheckpoint(): void {
    // Show the remaining goals.
    v.run.goalCompleted = true;

    v.run.season3TrapdoorBetweenPhotosSpawned = false;

    const goal = getGoalCorrespondingToRoom();
    if (goal !== undefined) {
      arrayRemoveInPlace(v.persistent.remainingGoals, goal);
    }
  }
}

export function season3GetItLivesSituation(): ItLivesSituation {
  if (season3HasMegaSatanGoal()) {
    return ItLivesSituation.BOTH;
  }

  const hasBlueBaby = season3HasBlueBabyGoal();
  const hasLamb = season3HasLambGoal();

  if (hasBlueBaby && hasLamb) {
    return ItLivesSituation.BOTH;
  }

  if (hasBlueBaby) {
    return ItLivesSituation.HEAVEN_DOOR;
  }

  if (hasLamb) {
    return ItLivesSituation.TRAPDOOR;
  }

  return ItLivesSituation.NEITHER;
}

export function season3GetBigChestReplacementAction(): BigChestReplacementAction {
  if (onSheol()) {
    return BigChestReplacementAction.TRAPDOOR;
  }

  if (onCathedral()) {
    return BigChestReplacementAction.HEAVEN_DOOR;
  }

  const goal = getGoalCorrespondingToRoom();
  if (goal === undefined) {
    return BigChestReplacementAction.LEAVE_ALONE;
  }

  // Don't allow repeat goals over the course of the same 7 character speedrun.
  if (!v.persistent.remainingGoals.includes(goal)) {
    return BigChestReplacementAction.LEAVE_ALONE;
  }

  return isOnFinalCharacter()
    ? BigChestReplacementAction.TROPHY
    : BigChestReplacementAction.CHECKPOINT;
}

function getGoalCorrespondingToRoom(): Season3Goal | undefined {
  const repentanceStage = onRepentanceStage();

  // First, check for goals related to the specific room type.
  if (inRoomType(RoomType.BOSS_RUSH)) {
    return Season3Goal.BOSS_RUSH;
  }

  if (inMegaSatanRoom()) {
    return Season3Goal.MEGA_SATAN;
  }

  // Second, check for goals relating to the stage.
  if (onStage(LevelStage.BLUE_WOMB)) {
    return Season3Goal.HUSH;
  }

  if (onChest()) {
    return Season3Goal.BLUE_BABY;
  }

  if (onDarkRoom()) {
    return Season3Goal.THE_LAMB;
  }

  if (onStage(LevelStage.WOMB_2) && repentanceStage) {
    return Season3Goal.MOTHER;
  }

  if (onStage(LevelStage.HOME)) {
    return Season3Goal.DOGMA;
  }

  return undefined;
}
