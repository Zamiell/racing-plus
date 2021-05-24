import { MAX_VANILLA_ITEM_ID } from "./constants";
import g from "./globals";

export function anyPlayerHas(collectibleType: CollectibleType): boolean {
  for (const player of getPlayers()) {
    if (player.HasCollectible(collectibleType)) {
      return true;
    }
  }

  return false;
}

export function changeRoom(roomIndex: int): void {
  // This must be set before every ChangeRoom() invocation or else the function can send
  // you to the wrong room
  g.l.LeaveDoor = -1;

  g.g.ChangeRoom(roomIndex);
}

export function consoleCommand(command: string): void {
  Isaac.DebugString(`Executing console command: ${command}`);
  Isaac.ExecuteCommand(command);
  Isaac.DebugString(`Finished executing console command: ${command}`);
}

// Use this on a switch statement's default case to get the linter to complain if a case was not
// predicted
export const ensureAllCases = (obj: never): never => obj;

export function enteredRoomViaTeleport(): boolean {
  const roomIndex = getRoomIndex();
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const isFirstVisit = g.r.IsFirstVisit();
  const justReachedThisFloor = roomIndex === startingRoomIndex && isFirstVisit;
  return g.l.LeaveDoor === -1 && !justReachedThisFloor;
}

export function getItemMaxCharges(itemID: int): int {
  const itemConfigItem = g.itemConfig.GetCollectible(itemID);
  if (itemConfigItem === null) {
    return 0;
  }

  return itemConfigItem.MaxCharges;
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

export function getPlayers(): EntityPlayer[] {
  const players: EntityPlayer[] = [];
  for (let i = 0; i < g.g.GetNumPlayers(); i++) {
    const player = Isaac.GetPlayer(i);
    if (player !== null) {
      players.push(player);
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
    "gfx/glowing-item.anm2",
    `gfx/items-glowing/collectibles/collectibles_${fileNum}.png`,
  );
}

export function initRNG(seed: int): RNG {
  // This is the ShiftIdx that blcd recommended after having reviewing the game's internal functions
  const RECOMMENDED_SHIFT_IDX = 35;

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

export function playingOnSetSeed(): boolean {
  const customRun = g.seeds.IsCustomRun();
  const challenge = Isaac.GetChallenge();

  return challenge === 0 && customRun;
}

export function printAllFlags(flags: int, maxShift: int): void {
  for (let i = 0; i <= maxShift; i++) {
    if (hasFlag(flags, 1 << i)) {
      Isaac.DebugString(`Has flag: ${i}`);
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

export function teleport(roomIndex: int): void {
  // This must be set before every StartRoomTransition() invocation or else the function can send
  // you to the wrong room
  g.l.LeaveDoor = -1;

  g.g.StartRoomTransition(
    roomIndex,
    Direction.NO_DIRECTION,
    RoomTransitionAnim.TELEPORT,
  );
}
