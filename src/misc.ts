import g from "./globals";

export function consoleCommand(command: string): void {
  Isaac.DebugString(`Executing console command: ${command}`);
  Isaac.ExecuteCommand(command);
  Isaac.DebugString(`Finished executing console command: ${command}`);
}

// Use this on a switch statement's default case to get
// the linter to complain if a case was not predicted
export const ensureAllCases = (obj: never): never => obj;

export function enteredRoomViaTeleport(): boolean {
  return (
    g.l.LeaveDoor === -1 && g.run.roomsEntered !== 0 && g.run.roomsEntered !== 1
  );
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

export function incrementRNG(seed: int): int {
  const rng = initRNG(seed);
  rng.Next();
  return rng.GetSeed();
}

export function initRNG(seed: int): RNG {
  // This is the ShiftIdx that blcd recommended after having reviewing the game's internal functions
  const RECOMMENDED_SHIFT_IDX = 35;

  const rng = RNG();

  // The game expects seeds in the range of 0 to 4294967295
  rng.SetSeed(seed, RECOMMENDED_SHIFT_IDX);

  return rng;
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
