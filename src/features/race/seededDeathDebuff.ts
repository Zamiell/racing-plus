import {
  getEnumValues,
  getMaxCollectibleID,
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

  // Fade the player
  const sprite = player.GetSprite();
  sprite.Color = Color(1, 1, 1, 0.25, 0, 0, 0);

  debuffOnSetHealth(player);
  debuffOnRemoveActiveItems(player);
  debuffOnRemoveAllItems(player);
  debuffOnRemoveGoldenBombsAndKeys(player);
  removeDeadEyeMultiplier(player);

  // Store their size for later and reset it to default
  // (in case they had items like Magic Mushroom and so forth)
  v.run.seededDeath.spriteScale = player.SpriteScale;
  player.SpriteScale = Vector(1, 1);

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

function debuffOnSetHealth(player: EntityPlayer) {
  const character = player.GetPlayerType();

  player.AddMaxHearts(-24, true);
  player.AddSoulHearts(-24);
  player.AddBoneHearts(-12);

  switch (character) {
    // 14
    case PlayerType.PLAYER_KEEPER: {
      player.AddMaxHearts(2, true); // One coin container
      player.AddHearts(2);
      player.UseCard(Card.CARD_HOLY);
      break;
    }

    // 16
    case PlayerType.PLAYER_THEFORGOTTEN: {
      player.AddMaxHearts(2, true);
      player.AddHearts(1);
      break;
    }

    // 17
    case PlayerType.PLAYER_THESOUL: {
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
  v.run.seededDeath.actives.clear();

  for (const activeSlot of getEnumValues(ActiveSlot)) {
    const item = player.GetActiveItem(activeSlot);
    const charge = player.GetActiveCharge(activeSlot);
    const batteryCharge = player.GetBatteryCharge(activeSlot);

    const activeItemDescription: ActiveItemDescription = {
      item,
      charge,
      batteryCharge,
    };
    v.run.seededDeath.actives.set(activeSlot, activeItemDescription);

    player.RemoveCollectible(item);
  }
}

function debuffOnRemoveAllItems(player: EntityPlayer) {
  for (let itemID = 1; itemID <= getMaxCollectibleID(); itemID++) {
    const numItems = player.GetCollectibleNum(itemID);

    // Checking both "GetCollectibleNum()" and "HasCollectible()" prevents bugs such as Lilith
    // having 1 Incubus
    if (numItems > 0 && player.HasCollectible(itemID)) {
      for (let i = 1; i <= numItems; i++) {
        v.run.seededDeath.items.push(itemID);
        player.RemoveCollectible(itemID);
        removeItemFromItemTracker(itemID);
      }
    }
  }

  // Now that we have deleted every item, update the players stats
  player.AddCacheFlags(CacheFlag.CACHE_ALL);
  player.EvaluateItems();
}

function debuffOnRemoveGoldenBombsAndKeys(player: EntityPlayer) {
  const stage = g.l.GetStage();

  // Store their golden bomb / key status
  v.run.seededDeath.goldenBomb = player.HasGoldenBomb();
  v.run.seededDeath.goldenKey = player.HasGoldenKey();

  // The golden bomb / key are tied to the particular stage
  v.run.seededDeath.stage = stage;

  // Remove any golden bombs and keys
  player.RemoveGoldenBomb();
  player.RemoveGoldenKey();
}

export function debuffOff(player: EntityPlayer): void {
  // Un-fade the character
  const sprite = player.GetSprite();
  sprite.Color = COLOR_DEFAULT;

  debuffOffAddActiveItems(player);
  debuffOffAddItems(player);
  debuffOffAddGoldenBombAndKey(player);

  // Set their size to the way it was before the debuff was applied
  if (v.run.seededDeath.spriteScale !== null) {
    player.SpriteScale = v.run.seededDeath.spriteScale;
  }
  v.run.seededDeath.spriteScale = null;

  if (v.run.seededDeath.removedDarkEsau) {
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
}

function debuffOffAddActiveItems(player: EntityPlayer) {
  for (const activeSlot of getEnumValues(ActiveSlot)) {
    const activeItemDescription = v.run.seededDeath.actives.get(activeSlot);
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

    v.run.seededDeath.actives.delete(activeSlot);
  }
}

function debuffOffAddItems(player: EntityPlayer) {
  for (const itemID of v.run.seededDeath.items) {
    player.AddCollectible(itemID, 0, false);
  }

  v.run.seededDeath.items = [];
}

function debuffOffAddGoldenBombAndKey(player: EntityPlayer) {
  const stage = g.l.GetStage();

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
