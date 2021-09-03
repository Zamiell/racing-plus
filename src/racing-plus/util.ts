import {
  getPlayers,
  hasFlag,
  initRNG,
  log,
  MAX_VANILLA_COLLECTIBLE_TYPE,
  removeAllMatchingEntities,
} from "isaacscript-common";
import {
  COLLECTIBLE_13_LUCK_SERVER_ID,
  COLLECTIBLE_15_LUCK_SERVER_ID,
  COLLECTIBLE_SAWBLADE_SERVER_ID,
} from "./features/race/constants";

export function consoleCommand(command: string): void {
  log(`Executing console command: ${command}`);
  Isaac.ExecuteCommand(command);
  log(`Finished executing console command: ${command}`);
}

export function hasPolaroidOrNegative(): [boolean, boolean] {
  let hasPolaroid = false;
  let hasNegative = false;
  for (const player of getPlayers()) {
    // We must use "GetCollectibleNum" instead of "HasCollectible" because the latter will be true
    // if they are holding the Mysterious Paper trinket
    if (player.GetCollectibleNum(CollectibleType.COLLECTIBLE_POLAROID) > 0) {
      hasPolaroid = true;
    }
    if (player.GetCollectibleNum(CollectibleType.COLLECTIBLE_NEGATIVE) > 0) {
      hasNegative = true;
    }
  }

  return [hasPolaroid, hasNegative];
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
    (itemID >= CollectibleType.COLLECTIBLE_SAD_ONION &&
      itemID <= MAX_VANILLA_COLLECTIBLE_TYPE) ||
    itemID === COLLECTIBLE_13_LUCK_SERVER_ID ||
    itemID === COLLECTIBLE_15_LUCK_SERVER_ID ||
    itemID === COLLECTIBLE_SAWBLADE_SERVER_ID
  ) {
    // Between Sad Onion and Decap Attack (or a custom modded items)
    const paddedNumber = itemID.toString().padStart(3, "0");
    fileNum = paddedNumber;
  } else if (
    itemID > CollectibleType.COLLECTIBLE_DECAP_ATTACK &&
    itemID < 2001
  ) {
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
      const jacob = player.GetOtherTwin();
      if (jacob !== null) {
        const adjustment = Vector(20, 0);
        const adjustedPosition = jacob.Position.add(adjustment);
        esau.Position = adjustedPosition;
      }
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

export function removeAllCollectibles(): void {
  removeAllMatchingEntities(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );
}

export function restartAsCharacter(character: PlayerType): void {
  // Doing a "restart 40" causes the player to spawn as Tainted Soul without a Forgotten companion
  if (character === PlayerType.PLAYER_THESOUL_B) {
    character = PlayerType.PLAYER_THEFORGOTTEN_B;
  }

  consoleCommand(`restart ${character}`);
}
