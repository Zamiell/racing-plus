import g from "./globals";

// Use this on a switch statement's default case to get
// the linter to complain if a case was not predicted
export const ensureAllCases = (obj: never): never => obj;

export function executeCommand(command: string): void {
  Isaac.DebugString(`Executing command. ${command}`);
  Isaac.ExecuteCommand(command);
  Isaac.DebugString(`Finished executing command. ${command}`);
}

export function getItemMaxCharges(itemID: int): int {
  const itemConfigItem = g.itemConfig.GetCollectible(itemID);
  if (itemConfigItem === null) {
    return 0;
  }
  return itemConfigItem.MaxCharges;
}

export function getRandom(x: int, y: int, rng: RNG): int {
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

export function isActionPressed(buttonAction: ButtonAction): boolean {
  // There are 4 possible inputs/players from 0 to 3
  for (let i = 0; i <= 3; i++) {
    if (Input.IsActionPressed(buttonAction, i)) {
      return true;
    }
  }

  return false;
}

export function isActionTriggered(buttonAction: ButtonAction): boolean {
  // There are 4 possible inputs/players from 0 to 3
  for (let i = 0; i <= 3; i++) {
    if (Input.IsActionTriggered(buttonAction, i)) {
      return true;
    }
  }

  return false;
}

export function isButtonPressed(button: int): boolean {
  // There are 4 possible inputs/players from 0 to 3
  for (let i = 0; i <= 3; i++) {
    if (Input.IsButtonPressed(button, i)) {
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
