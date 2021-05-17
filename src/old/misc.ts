import { ZERO_VECTOR } from "./constants";
import g from "./globals";
import { CollectibleTypeCustom } from "./types/enums";

export function arrayEquals(arr1: int[], arr2: int[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

export function console(msg: string): void {
  Isaac.ConsoleOutput(`${msg}\n`);
}

export function executeCommand(command: string): void {
  Isaac.DebugString(`Executing command. ${command}`);
  Isaac.ExecuteCommand(command);
  Isaac.DebugString(`Finished executing command. ${command}`);
}

export function getHeartXOffset(): int {
  // Local variables
  const curses = g.l.GetCurses();
  const maxHearts = g.p.GetMaxHearts();
  const soulHearts = g.p.GetSoulHearts();
  const boneHearts = g.p.GetBoneHearts();
  const extraLives = g.p.GetExtraLives();

  const heartLength = 12; // This is how long each heart is on the UI in the upper left hand corner
  // (this is not in pixels, but in draw coordinates;
  // you can see that it is 13 pixels wide in the "ui_hearts.png" file)
  let combinedHearts = maxHearts + soulHearts + boneHearts * 2; // There are no half bone hearts
  if (combinedHearts > 12) {
    combinedHearts = 12; // After 6 hearts, it wraps to a second row
  }

  if (curses === LevelCurse.CURSE_OF_THE_UNKNOWN) {
    combinedHearts = 2;
  }

  let offset = (combinedHearts / 2) * heartLength;
  if (extraLives > 9) {
    offset += 20;
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR)) {
      offset += 6;
    }
  } else if (extraLives > 0) {
    offset += 16;
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR)) {
      offset += 4;
    }
  }

  return offset;
}

// Find out how many charges this item has
export function getItemMaxCharges(itemID: int): int {
  if (itemID === 0) {
    return 0;
  }

  return g.itemConfig.GetCollectible(itemID).MaxCharges;
}

// This function is from Kilburn
export function getNumTotalCollectibles(): int {
  let id = CollectibleType.NUM_COLLECTIBLES - 1; // Start at the last vanilla ID
  let step = 16;
  while (step > 0) {
    if (g.itemConfig.GetCollectible(id + step)) {
      id += step;
    } else {
      step = math.floor(step / 2);
    }
  }

  return id;
}

// From piber20 Helper
// https://steamcommunity.com/workshop/filedetails/?id=1553455339
export function getPlayerVisibleHearts(): int {
  const maxHearts = math.max(
    g.p.GetEffectiveMaxHearts(),
    g.p.GetBoneHearts() * 2,
  );

  let visibleHearts = math.ceil((maxHearts + g.p.GetSoulHearts()) / 2);
  if (visibleHearts < 1) {
    visibleHearts = 1;
  }

  return visibleHearts;
}

export function getRoomIndex(): int {
  const roomIndex = g.l.GetCurrentRoomDesc().SafeGridIndex;
  if (roomIndex < 0) {
    // SafeGridIndex is always -1 for rooms outside the grid
    return g.l.GetCurrentRoomIndex();
  }

  return roomIndex;
}

// Taken from Alphabirth
// https://steamcommunity.com/sharedfiles/filedetails/?id=848056541
export function getScreenCenterPosition(): Vector {
  // Local variables
  const shape = g.r.GetRoomShape();
  const centerPos = g.r.GetCenterPos();
  const topLeftPos = g.r.GetTopLeftPos();
  const centerOffset = centerPos.__sub(topLeftPos);
  const pos = centerPos;

  if (centerOffset.X > 260) {
    pos.X -= 260;
  }
  if (shape === RoomShape.ROOMSHAPE_LBL || shape === RoomShape.ROOMSHAPE_LTL) {
    pos.X -= 260;
  }
  if (centerOffset.Y > 140) {
    pos.Y -= 140;
  }
  if (shape === RoomShape.ROOMSHAPE_LTR || shape === RoomShape.ROOMSHAPE_LTL) {
    pos.Y -= 140;
  }

  return Isaac.WorldToRenderPosition(pos);
}

// Kilburn's function (pinned in the Isaac Discord server)
export function getScreenSize(): [int, int] {
  const screenPos = g.r.WorldToScreenPosition(ZERO_VECTOR);
  const renderScrollPos = screenPos.__sub(g.r.GetRenderScrollOffset());
  const finalPos = renderScrollPos.__sub(g.g.ScreenShakeOffset);

  const rx = finalPos.X + (60 * 26) / 40;
  const ry = finalPos.Y + 140 * (26 / 40);

  const x = rx * 2 + 13 * 26;
  const y = ry * 2 + 7 * 26;

  return [x, y];
}

export function giveItemAndRemoveFromPools(
  collectibleType: CollectibleType | CollectibleTypeCustom,
): void {
  const maxCharges = getItemMaxCharges(collectibleType);
  g.p.AddCollectible(collectibleType, maxCharges, false);
  g.itemPool.RemoveCollectible(collectibleType);
}

export function gridToPos(x: int, y: int): Vector {
  x += 1;
  y += 1;

  const gridIndex = y * g.r.GetGridWidth() + x;
  return g.r.GetGridPosition(gridIndex);
}

export function incrementRNG(seed: int): int {
  // The game expects seeds in the range of 0 to 4294967295
  const rng = RNG();
  rng.SetSeed(seed, 35);
  // This is the ShiftIdx that blcd recommended after having reviewing the game's internal functions
  rng.Next();
  const newSeed = rng.GetSeed();
  return newSeed;
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

export function removeItemFromItemTracker(
  collectibleType: CollectibleType | CollectibleTypeCustom,
): void {
  const itemConfig = g.itemConfig.GetCollectible(collectibleType);
  Isaac.DebugString(
    `Removing collectible ${collectibleType} (${itemConfig.Name})`,
  );
}

export function removeValueFromArray<T>(value: T, array: T[]): void {
  const index = array.indexOf(value);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

// From: https://stackoverflow.com/questions/7342957/how-do-you-round-to-1-decimal-place-in-javascript
export function round(value: float, precision: int): float {
  const multiplier = 10 ** (precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
