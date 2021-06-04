import {
  CENTER_OF_2X2_ROOM,
  EXCLUDED_CHARACTERS,
  MAX_POSSIBLE_RADIUS,
  MAX_VANILLA_ITEM_ID,
  RECOMMENDED_SHIFT_IDX,
} from "./constants";
import { FastTravelState } from "./features/optional/major/fastTravel/enums";
import g from "./globals";

export function anyPlayerHas(collectibleType: CollectibleType): boolean {
  for (const player of getPlayers()) {
    if (player.HasCollectible(collectibleType)) {
      return true;
    }
  }

  return false;
}

export function anyPlayerCloserThan(position: Vector, distance: int): boolean {
  const playersInRange = Isaac.FindInRadius(
    position,
    distance,
    EntityPartition.PLAYER,
  );

  return playersInRange.length > 0;
}

export function changeRoom(roomIndex: int): void {
  // This must be set before every ChangeRoom() invocation or else the function can send
  // you to the wrong room
  g.l.LeaveDoor = -1;

  g.g.ChangeRoom(roomIndex);
}

export function consoleCommand(command: string): void {
  log(`Executing console command: ${command}`);
  Isaac.ExecuteCommand(command);
  log(`Finished executing console command: ${command}`);
}

// Use this on a switch statement's default case to get the linter to complain if a case was not
// predicted
export const ensureAllCases = (obj: never): never => obj;

export function enteredRoomViaTeleport(): boolean {
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const previousRoomIndex = g.l.GetPreviousRoomIndex();
  const isFirstVisit = g.r.IsFirstVisit();
  const roomIndex = getRoomIndex();
  const justReachedThisFloor = roomIndex === startingRoomIndex && isFirstVisit;
  const inCrawlspace = roomIndex === GridRooms.ROOM_DUNGEON_IDX;
  const cameFromCrawlspace = previousRoomIndex === GridRooms.ROOM_DUNGEON_IDX;

  return (
    g.run.fastTravel.state === FastTravelState.Disabled &&
    g.l.LeaveDoor === -1 &&
    !justReachedThisFloor &&
    !inCrawlspace &&
    !cameFromCrawlspace
  );
}

export function getFireDelayFromTearsStat(tearsStat: float): float {
  return math.max(30 / tearsStat - 1, -0.9999);
}

export function getGridEntities(): GridEntity[] {
  const gridEntities: GridEntity[] = [];
  for (let gridIndex = 0; gridIndex < g.r.GetGridSize(); gridIndex++) {
    const gridEntity = g.r.GetGridEntity(gridIndex);
    if (gridEntity !== null) {
      gridEntities.push(gridEntity);
    }
  }

  return gridEntities;
}

export function getItemMaxCharges(itemID: int): int {
  const itemConfigItem = g.itemConfig.GetCollectible(itemID);
  if (itemConfigItem === null) {
    return 0;
  }

  return itemConfigItem.MaxCharges;
}

export function getPlayerLuaTableIndex(player: EntityPlayer): string {
  return player.ControllerIndex.toString();
}

export function getRoomEnemies(): Entity[] {
  // Using FindInRadius() is faster than GetRoomEntities()
  return Isaac.FindInRadius(
    CENTER_OF_2X2_ROOM,
    MAX_POSSIBLE_RADIUS,
    EntityPartition.ENEMY,
  );
}

export function getTearsStat(fireDelay: float): float {
  return 30 / (fireDelay + 1);
}

export function getTotalCollectibles(collectibleType: CollectibleType): int {
  let numCollectibles = 0;
  for (const player of getPlayers()) {
    numCollectibles += player.GetCollectibleNum(collectibleType);
  }

  return numCollectibles;
}

export function getOpenTrinketSlot(player: EntityPlayer): int | null {
  const maxTrinkets = player.GetMaxTrinkets();
  const trinket0 = player.GetTrinket(0);
  const trinket1 = player.GetTrinket(1);

  if (maxTrinkets === 1) {
    return trinket0 === TrinketType.TRINKET_NULL ? 0 : null;
  }

  if (maxTrinkets === 2) {
    if (trinket0 === TrinketType.TRINKET_NULL) {
      return 0;
    }
    return trinket1 === TrinketType.TRINKET_NULL ? 1 : null;
  }

  error(`The player has ${maxTrinkets} trinket slots, which is not supported.`);
  return null;
}

/**
 * By default, this returns characters that are not directly controlled by the player (like Esau).
 */
export function getPlayers(performExclusions = false): EntityPlayer[] {
  const players: EntityPlayer[] = [];
  for (let i = 0; i < g.g.GetNumPlayers(); i++) {
    const player = Isaac.GetPlayer(i);
    if (player !== null) {
      // We only want to make a list of players that are fully-functioning and controlled by humans
      // Thus, we need to exclude certain characters
      const character = player.GetPlayerType();
      if (!performExclusions || !EXCLUDED_CHARACTERS.includes(character)) {
        players.push(player);
      }
    }
  }

  return players;
}

export function getRandom(x: int, y: int, seed: int): int {
  const rng = initRNG(seed);
  return rng.RandomInt(y - x + 1) + x;
}

export function getRoomIndex(): int {
  const roomIndex = g.l.GetCurrentRoomDesc().SafeGridIndex;
  if (roomIndex < 0) {
    // SafeGridIndex is always -1 for rooms outside the grid
    return g.l.GetCurrentRoomIndex();
  }

  return roomIndex;
}

export function removeGridEntity(gridEntity: GridEntity): void {
  const gridIndex = gridEntity.GetGridIndex();
  g.r.RemoveGridEntity(gridIndex, 0, false); // gridEntity.Destroy() does not work
}

export function gridToPos(x: int, y: int): Vector {
  x += 1;
  y += 1;

  const gridIndex = y * g.r.GetGridWidth() + x;
  return g.r.GetGridPosition(gridIndex);
}

export function hasFlag(flags: int, flag: int): boolean {
  return (flags & flag) === flag;
}

export function incrementRNG(seed: int): int {
  const rng = initRNG(seed);
  rng.Next();
  return rng.GetSeed();
}

export function initGlowingItemSprite(
  collectibleType: CollectibleType,
): Sprite {
  let fileNum: string;
  if (collectibleType >= 1 && collectibleType <= MAX_VANILLA_ITEM_ID) {
    const paddedNumber = collectibleType.toString().padStart(3, "0");
    fileNum = paddedNumber;
  } else {
    fileNum = "NEW";
  }

  return initSprite(
    "gfx/glowing_item.anm2",
    `gfx/items-glowing/collectibles/collectibles_${fileNum}.png`,
  );
}

export function initRNG(seed: int): RNG {
  const rng = RNG();

  // The game expects seeds in the range of 0 to 4294967295
  rng.SetSeed(seed, RECOMMENDED_SHIFT_IDX);

  return rng;
}

export function initSprite(anm2Path: string, pngPath?: string): Sprite {
  const sprite = Sprite();

  if (pngPath === undefined) {
    sprite.Load(anm2Path, true);
  } else {
    sprite.Load(anm2Path, false);
    sprite.ReplaceSpritesheet(0, pngPath);
    sprite.LoadGraphics();
  }

  sprite.SetFrame("Default", 0);

  return sprite;
}

export function isActionPressedOnAnyInput(buttonAction: ButtonAction): boolean {
  // There are 4 possible inputs/players from 0 to 3
  for (let i = 0; i <= 3; i++) {
    if (Input.IsActionPressed(buttonAction, i)) {
      return true;
    }
  }

  return false;
}

export function isActionTriggeredOnAnyInput(
  buttonAction: ButtonAction,
): boolean {
  // There are 4 possible inputs/players from 0 to 3
  for (let i = 0; i <= 3; i++) {
    if (Input.IsActionTriggered(buttonAction, i)) {
      return true;
    }
  }

  return false;
}

export function isAntibirthStage(): boolean {
  const stageType = g.l.GetStageType();
  return (
    stageType === StageType.STAGETYPE_REPENTANCE ||
    stageType === StageType.STAGETYPE_REPENTANCE_B
  );
}

export function isSelfDamage(damageFlags: int): boolean {
  return (
    // Exclude self-damage from e.g. Curse Room spikes
    hasFlag(damageFlags, DamageFlag.DAMAGE_NO_PENALTIES) ||
    // Exclude self-damage from e.g. Razor
    hasFlag(damageFlags, DamageFlag.DAMAGE_RED_HEARTS)
  );
}

export function isPostBossVoidPortal(gridEntity: GridEntity): boolean {
  // The VarData of Void Portals that are spawned after bosses will be equal to 1
  // The VarData of the Void Portal in the room after Hush is equal to 0
  const saveState = gridEntity.GetSaveState();
  return saveState.VarData === 1;
}

export function log(msg: string): void {
  Isaac.DebugString(msg);
}

export function moveEsauNextToJacob(): void {
  const esaus = Isaac.FindByType(
    EntityType.ENTITY_PLAYER,
    0,
    PlayerType.PLAYER_ESAU,
  );
  for (const esau of esaus) {
    const player = esau.ToPlayer();
    if (player !== null) {
      const jacob = player.GetMainTwin();
      const adjustment = Vector(20, 0);
      const adjustedPosition = jacob.Position.__add(adjustment);
      esau.Position = adjustedPosition;
    }
  }
}

export function movePlayersAndFamiliars(position: Vector): void {
  const players = getPlayers();
  for (const player of players) {
    player.Position = position;
  }

  moveEsauNextToJacob();

  // Put familiars next to the players
  const familiars = Isaac.FindByType(EntityType.ENTITY_FAMILIAR);
  for (const familiar of familiars) {
    familiar.Position = position;
  }
}

export function pass(): void {}

export function playingOnSetSeed(): boolean {
  const customRun = g.seeds.IsCustomRun();
  const challenge = Isaac.GetChallenge();

  return challenge === 0 && customRun;
}

export function printAllFlags(flags: int, maxShift: int): void {
  for (let i = 0; i <= maxShift; i++) {
    if (hasFlag(flags, 1 << i)) {
      log(`Has flag: ${i}`);
    }
  }
}

export function openAllDoors(): void {
  for (let i = 0; i <= 7; i++) {
    const door = g.r.GetDoor(i);
    if (door !== null) {
      // If we try to open a hidden secret room door (or super secret room door),
      // then nothing will happen
      door.Open();
    }
  }
}

export function restartAsCharacter(character: PlayerType): void {
  // Doing a "restart 40" causes the player to spawn as Tainted Soul without a Forgotten companion
  if (character === PlayerType.PLAYER_THESOUL_B) {
    character = PlayerType.PLAYER_THEFORGOTTEN_B;
  }

  consoleCommand(`restart ${character}`);
}

export function teleport(
  roomIndex: int,
  direction = Direction.NO_DIRECTION,
  roomTransitionAnim = RoomTransitionAnim.TELEPORT,
): void {
  // This must be set before every StartRoomTransition() invocation or else the function can send
  // you to the wrong room
  g.l.LeaveDoor = -1;

  g.g.StartRoomTransition(roomIndex, direction, roomTransitionAnim);
}
