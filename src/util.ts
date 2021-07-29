import { hasFlag } from "isaacscript-common";
import { RECOMMENDED_SHIFT_IDX } from "./constants";
import log from "./log";

export function arrayEquals<T>(array1: T[], array2: T[]): boolean {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
}

export function consoleCommand(command: string): void {
  log(`Executing console command: ${command}`);
  Isaac.ExecuteCommand(command);
  log(`Finished executing console command: ${command}`);
}

// Use this on a switch statement's default case to get the linter to complain if a case was not
// predicted
export const ensureAllCases = (obj: never): never => obj;

export function getFinalFrameOfAnimation(sprite: Sprite): int {
  const currentFrame = sprite.GetFrame();
  sprite.SetLastFrame();
  const finalFrame = sprite.GetFrame();
  sprite.SetFrame(currentFrame);
  return finalFrame;
}

export function getHUDOffsetVector(): Vector {
  const defaultVector = Vector.Zero;

  // In Mod Config Menu, players can set a Hud Offset
  if (
    ModConfigMenu === undefined ||
    ModConfigMenu.Config === undefined ||
    ModConfigMenu.Config.General === undefined
  ) {
    return defaultVector;
  }

  const hudOffset = ModConfigMenu.Config.General.HudOffset;
  if (hudOffset === undefined) {
    return defaultVector;
  }

  // Expected values are integers between 1 and 10
  if (type(hudOffset) !== "number" || hudOffset < 1 || hudOffset > 10) {
    return defaultVector;
  }

  const x = hudOffset * 2;
  let y = hudOffset;
  if (y >= 4) {
    y += 1;
  }
  if (y >= 9) {
    y += 1;
  }

  return Vector(x, y);
}

export function getRoomNPCs(): EntityNPC[] {
  const npcs: EntityNPC[] = [];
  for (const entity of Isaac.GetRoomEntities()) {
    const npc = entity.ToNPC();
    if (npc !== null) {
      npcs.push(npc);
    }
  }

  return npcs;
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

export function getRandom(x: int, y: int, seed: int): int {
  const rng = initRNG(seed);
  return rng.RandomInt(y - x + 1) + x;
}

export function incrementRNG(seed: int): int {
  const rng = initRNG(seed);
  rng.Next();
  return rng.GetSeed();
}

export function initGlowingItemSprite(itemID: int): Sprite {
  // "NEW" is a "Curse of the Blind" item sprite
  let fileNum: string;
  if (itemID < 1) {
    fileNum = "NEW";
  } else if (
    (itemID >= 1 && itemID <= 729) ||
    itemID === 800 ||
    itemID === 801
  ) {
    // Between Sad Onion and Decap Attack (or the custom luck items)
    const paddedNumber = itemID.toString().padStart(3, "0");
    fileNum = paddedNumber;
  } else if (itemID > 729 && itemID < 2001) {
    // Between Decap Attack and Swallowed Penny
    fileNum = "NEW";
  } else if (itemID >= 2001 && itemID <= 2189) {
    // Between Swallowed Penny and Sigil of Baphomet
    fileNum = itemID.toString();
  } else if (itemID > 2189 && itemID < 32769) {
    // Between Sigil of Baphomet and Golden Swallowed Penny
    fileNum = "NEW";
  } else if (itemID >= 32769 && itemID <= 32957) {
    // Between Golden Swallowed Penny and Golden Sigil of Baphomet
    fileNum = itemID.toString();
  } else {
    // Past Golden Sigil of Baphomet
    fileNum = "NEW";
  }

  return initSprite(
    "gfx/glowing_item.anm2",
    `gfx/items_glowing/collectibles_${fileNum}.png`,
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

// eslint-disable-next-line import/no-unused-modules
export function logAllEntityFlags(flags: int): void {
  logAllFlags(flags, 59);
}

function logAllFlags(flags: int, maxShift: int) {
  for (let i = 0; i <= maxShift; i++) {
    if (hasFlag(flags, 1 << i)) {
      log(`Has flag: ${i}`);
    }
  }
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
      const adjustedPosition = jacob.Position.add(adjustment);
      esau.Position = adjustedPosition;
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
