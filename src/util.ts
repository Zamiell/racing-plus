import { hasFlag, initRNG, log } from "isaacscript-common";

export function consoleCommand(command: string): void {
  log(`Executing console command: ${command}`);
  Isaac.ExecuteCommand(command);
  log(`Finished executing console command: ${command}`);
}

export function getFinalFrameOfAnimation(sprite: Sprite): int {
  const currentFrame = sprite.GetFrame();
  sprite.SetLastFrame();
  const finalFrame = sprite.GetFrame();
  sprite.SetFrame(currentFrame);
  return finalFrame;
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
