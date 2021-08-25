import {
  arrayEmpty,
  getEnumValues,
  getPlayerCollectibleMap,
  removeDeadEyeMultiplier,
} from "isaacscript-common";
import { COLOR_DEFAULT } from "../../constants";
import g from "../../globals";
import ActiveItemDescription from "../../types/ActiveItemDescription";
import { removeItemFromItemTracker } from "../../util";
import v from "./v";

export function debuffOn(player: EntityPlayer): void {
  // Make them take "red heart damage" for the purposes of getting a Devil Deal
  g.l.SetRedHeartDamage();

  debuffOnSetHealth(player);
  debuffOnRemoveActiveItems(player);
  debuffOnRemoveAllItems(player);
  debuffOnRemoveGoldenBombsAndKeys(player);
  removeDeadEyeMultiplier(player);
  debuffOnRemoveSize(player);
  debuffOnRemoveDarkEsau();
}

function debuffOnSetHealth(player: EntityPlayer) {
  const character = player.GetPlayerType();

  player.AddMaxHearts(-24, true);
  player.AddSoulHearts(-24);
  player.AddBoneHearts(-12);

  switch (character) {
    // 14
    case PlayerType.PLAYER_KEEPER:
    case PlayerType.PLAYER_KEEPER_B: {
      player.AddMaxHearts(2, true); // One coin container
      player.AddHearts(2);
      break;
    }

    // 16
    case PlayerType.PLAYER_THEFORGOTTEN: {
      player.AddMaxHearts(2, true);
      player.AddHearts(1);
      break;
    }

    default: {
      player.AddSoulHearts(3);
      break;
    }
  }
}

function debuffOnRemoveActiveItems(player: EntityPlayer) {
  const character = player.GetPlayerType();
  const activesMap =
    character === PlayerType.PLAYER_ESAU
      ? v.run.seededDeath.actives2
      : v.run.seededDeath.actives;

  activesMap.clear();

  for (const activeSlot of getEnumValues(ActiveSlot)) {
    const item = player.GetActiveItem(activeSlot);
    if (item === CollectibleType.COLLECTIBLE_NULL) {
      continue;
    }

    const charge = player.GetActiveCharge(activeSlot);
    const batteryCharge = player.GetBatteryCharge(activeSlot);

    const activeItemDescription: ActiveItemDescription = {
      item,
      charge,
      batteryCharge,
    };
    activesMap.set(activeSlot, activeItemDescription);

    player.RemoveCollectible(item);
  }
}

function debuffOnRemoveAllItems(player: EntityPlayer) {
  const character = player.GetPlayerType();
  const items =
    character === PlayerType.PLAYER_ESAU
      ? v.run.seededDeath.items2
      : v.run.seededDeath.items;

  const collectibleMap = getPlayerCollectibleMap(player);
  for (const [collectibleType, collectibleNum] of collectibleMap) {
    for (let i = 1; i <= collectibleNum; i++) {
      items.push(collectibleType);
      player.RemoveCollectible(collectibleType);
      removeItemFromItemTracker(collectibleType);
    }
  }

  // Now that we have deleted every item, update the players stats
  player.AddCacheFlags(CacheFlag.CACHE_ALL);
  player.EvaluateItems();
}

function debuffOnRemoveGoldenBombsAndKeys(player: EntityPlayer) {
  const stage = g.l.GetStage();
  const character = player.GetPlayerType();

  if (character === PlayerType.PLAYER_ESAU) {
    // Esau can not carry bombs and keys
    return;
  }

  // Store their golden bomb / key status
  v.run.seededDeath.goldenBomb = player.HasGoldenBomb();
  v.run.seededDeath.goldenKey = player.HasGoldenKey();

  // The golden bomb / key are tied to the particular stage
  v.run.seededDeath.stage = stage;

  // Remove any golden bombs and keys
  player.RemoveGoldenBomb();
  player.RemoveGoldenKey();
}

function debuffOnRemoveSize(player: EntityPlayer) {
  const character = player.GetPlayerType();

  // Store their size for later and reset it to default
  // (in case they had items like Magic Mushroom and so forth)
  if (character === PlayerType.PLAYER_ESAU) {
    v.run.seededDeath.spriteScale2 = player.SpriteScale;
  } else {
    v.run.seededDeath.spriteScale = player.SpriteScale;
  }
  player.SpriteScale = Vector(1, 1);
}

function debuffOnRemoveDarkEsau() {
  // If Dark Esau is alive, the player can use it to clear rooms while they are dead
  // Remove Dark Esau to prevent this
  const darkEsaus = Isaac.FindByType(
    EntityType.ENTITY_DARK_ESAU,
    DarkEsauVariant.DARK_ESAU,
  );
  for (const darkEsau of darkEsaus) {
    darkEsau.Remove();
    v.run.seededDeath.removedDarkEsau = true;
  }
}

export function debuffOff(player: EntityPlayer): void {
  // Un-fade the character
  const sprite = player.GetSprite();
  sprite.Color = COLOR_DEFAULT;

  debuffOffAddActiveItems(player);
  debuffOffAddAllItems(player);
  debuffOffAddGoldenBombAndKey(player);
  debuffOffRestoreSize(player);
  debuffOffAddDarkEsau();
}

function debuffOffAddActiveItems(player: EntityPlayer) {
  const character = player.GetPlayerType();
  const activesMap =
    character === PlayerType.PLAYER_ESAU
      ? v.run.seededDeath.actives2
      : v.run.seededDeath.actives;

  for (const activeSlot of getEnumValues(ActiveSlot)) {
    const activeItemDescription = activesMap.get(activeSlot);
    if (activeItemDescription !== undefined) {
      const totalCharge =
        activeItemDescription.charge + activeItemDescription.batteryCharge;
      player.AddCollectible(
        activeItemDescription.item,
        totalCharge,
        false,
        activeSlot,
      );
    }

    activesMap.delete(activeSlot);
  }
}

function debuffOffAddAllItems(player: EntityPlayer) {
  const character = player.GetPlayerType();
  const items =
    character === PlayerType.PLAYER_ESAU
      ? v.run.seededDeath.items2
      : v.run.seededDeath.items;

  for (const collectibleType of items) {
    player.AddCollectible(collectibleType, 0, false);
  }

  arrayEmpty(items);
  disableSpiritShackles(player);
}

function disableSpiritShackles(player: EntityPlayer) {
  // If we re-gave Spirit Shackles back to the player, they will get a free revival
  // Disable it if this is the case
  if (!player.HasCollectible(CollectibleType.COLLECTIBLE_SPIRIT_SHACKLES)) {
    return;
  }

  const effects = player.GetEffects();
  const spiritShacklesEnabled =
    effects.GetNullEffectNum(NullItemID.ID_SPIRIT_SHACKLES_DISABLED) === 0;
  if (spiritShacklesEnabled) {
    effects.AddNullEffect(NullItemID.ID_SPIRIT_SHACKLES_DISABLED, true);
  }
}

function debuffOffAddGoldenBombAndKey(player: EntityPlayer) {
  const stage = g.l.GetStage();
  const character = player.GetPlayerType();

  if (character === PlayerType.PLAYER_ESAU) {
    // Esau can not carry bombs and keys
    return;
  }

  if (v.run.seededDeath.goldenBomb) {
    v.run.seededDeath.goldenBomb = false;

    if (stage === v.run.seededDeath.stage) {
      player.AddGoldenBomb();
    }
  }

  if (v.run.seededDeath.goldenKey) {
    v.run.seededDeath.goldenKey = false;

    if (stage === v.run.seededDeath.stage) {
      player.AddGoldenKey();
    }
  }
}

function debuffOffRestoreSize(player: EntityPlayer) {
  const character = player.GetPlayerType();

  // Set their size to the way it was before the debuff was applied
  if (character === PlayerType.PLAYER_ESAU) {
    if (v.run.seededDeath.spriteScale2 !== null) {
      player.SpriteScale = v.run.seededDeath.spriteScale2;
    }
    v.run.seededDeath.spriteScale2 = null;
  } else {
    if (v.run.seededDeath.spriteScale !== null) {
      player.SpriteScale = v.run.seededDeath.spriteScale;
    }
    v.run.seededDeath.spriteScale = null;
  }
}

function debuffOffAddDarkEsau() {
  if (!v.run.seededDeath.removedDarkEsau) {
    return;
  }
  v.run.seededDeath.removedDarkEsau = false;

  const centerPos = g.r.GetCenterPos();
  Isaac.Spawn(
    EntityType.ENTITY_DARK_ESAU,
    DarkEsauVariant.DARK_ESAU,
    0,
    centerPos,
    Vector.Zero,
    null,
  );
}
