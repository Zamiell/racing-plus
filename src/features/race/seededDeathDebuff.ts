import {
  arrayEmpty,
  getDefaultColor,
  getEnumValues,
  getFamiliars,
  getNPCs,
  getPlayerCollectibleMap,
  getTransformationsForItem,
  isJacobOrEsau,
  removeAllPlayerHealth,
  removeCollectibleFromItemTracker,
  removeDeadEyeMultiplier,
} from "isaacscript-common";
import g from "../../globals";
import { ActiveItemDescription } from "../../types/ActiveItemDescription";
import {
  CollectibleTypeCustom,
  TRANSFORMATION_HELPERS,
} from "../../types/enums";
import v from "./v";

const QUARTER_FADED_COLOR = Color(1, 1, 1, 0.25);

const TRANSFORMATION_TO_HELPER_MAP = new Map<PlayerForm, CollectibleTypeCustom>(
  [
    [
      PlayerForm.PLAYERFORM_GUPPY, // 0
      CollectibleTypeCustom.COLLECTIBLE_GUPPY_TRANSFORMATION_HELPER,
    ],
    [
      PlayerForm.PLAYERFORM_LORD_OF_THE_FLIES, // 1
      CollectibleTypeCustom.COLLECTIBLE_BEELZEBUB_TRANSFORMATION_HELPER,
    ],
    [
      PlayerForm.PLAYERFORM_MUSHROOM, // 2
      CollectibleTypeCustom.COLLECTIBLE_FUN_GUY_TRANSFORMATION_HELPER,
    ],
    [
      PlayerForm.PLAYERFORM_ANGEL, // 3
      CollectibleTypeCustom.COLLECTIBLE_SERAPHIM_TRANSFORMATION_HELPER,
    ],
    [
      PlayerForm.PLAYERFORM_BOB, // 4
      CollectibleTypeCustom.COLLECTIBLE_BOB_TRANSFORMATION_HELPER,
    ],
    [
      PlayerForm.PLAYERFORM_DRUGS, // 5
      CollectibleTypeCustom.COLLECTIBLE_SPUN_TRANSFORMATION_HELPER,
    ],
    [
      PlayerForm.PLAYERFORM_MOM, // 6
      CollectibleTypeCustom.COLLECTIBLE_YES_MOTHER_TRANSFORMATION_HELPER,
    ],
    [
      PlayerForm.PLAYERFORM_BABY, // 7
      CollectibleTypeCustom.COLLECTIBLE_CONJOINED_TRANSFORMATION_HELPER,
    ],
    [
      PlayerForm.PLAYERFORM_EVIL_ANGEL, // 8
      CollectibleTypeCustom.COLLECTIBLE_LEVIATHAN_TRANSFORMATION_HELPER,
    ],
    [
      PlayerForm.PLAYERFORM_POOP, // 9
      CollectibleTypeCustom.COLLECTIBLE_OH_CRAP_TRANSFORMATION_HELPER,
    ],
    [
      PlayerForm.PLAYERFORM_BOOK_WORM, // 10
      CollectibleTypeCustom.COLLECTIBLE_BOOKWORM_TRANSFORMATION_HELPER,
    ],
    // PlayerForm.PLAYERFORM_ADULTHOOD (11) is skipped since that is not based on items
    [
      PlayerForm.PLAYERFORM_SPIDERBABY, // 12
      CollectibleTypeCustom.COLLECTIBLE_SPIDER_BABY_TRANSFORMATION_HELPER,
    ],
    // PlayerForm.PLAYERFORM_STOMPY (13) is skipped since that is not based on items
    // Playerform.PLAYERFORM_FLIGHT (14) is unused by the game
  ],
);

export function debuffOn(player: EntityPlayer): void {
  // Make them take "red heart damage" for the purposes of getting a Devil Deal
  g.l.SetRedHeartDamage();

  debuffOnRemoveSize(player);
  debuffOnSetHealth(player);
  debuffOnRemoveActiveItems(player);
  debuffOnRemoveAllItems(player);
  debuffOnRemoveGoldenBombsAndKeys(player);
  removeDeadEyeMultiplier(player);
  debuffOnRemoveDarkEsau();
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

function debuffOnSetHealth(player: EntityPlayer) {
  const character = player.GetPlayerType();

  removeAllPlayerHealth(player);

  switch (character) {
    // 14, 33
    case PlayerType.PLAYER_KEEPER:
    case PlayerType.PLAYER_KEEPER_B: {
      // One filled coin container
      player.AddMaxHearts(2, true);
      player.AddHearts(2);
      break;
    }

    // 16
    case PlayerType.PLAYER_THEFORGOTTEN: {
      // One filled bone heart
      player.AddMaxHearts(2, true);
      player.AddHearts(1);
      break;
    }

    // 17
    case PlayerType.PLAYER_THESOUL: {
      // One empty bone heart + one half soul heart
      player.AddBoneHearts(1);
      player.AddSoulHearts(1);
      break;
    }

    // 18
    case PlayerType.PLAYER_BETHANY: {
      // One heart container
      player.AddMaxHearts(2, true);
      player.AddHearts(2);
      break;
    }

    default: {
      // One and a half soul hearts
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
  for (const [collectibleType, collectibleNum] of collectibleMap.entries()) {
    for (let i = 1; i <= collectibleNum; i++) {
      if (!TRANSFORMATION_HELPERS.has(collectibleType)) {
        items.push(collectibleType);
      }
      player.RemoveCollectible(collectibleType);
      removeCollectibleFromItemTracker(collectibleType);
    }
  }

  // Now that we have deleted every item, update the players stats
  player.AddCacheFlags(CacheFlag.CACHE_ALL);
  player.EvaluateItems();
}

function debuffOnRemoveGoldenBombsAndKeys(player: EntityPlayer) {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
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
  v.run.seededDeath.stageType = stageType;

  // Remove any golden bombs and keys
  player.RemoveGoldenBomb();
  player.RemoveGoldenKey();
}

function debuffOnRemoveDarkEsau() {
  // If Dark Esau is alive, the player can use it to clear rooms while they are dead
  // Remove Dark Esau to prevent this
  const darkEsaus = getNPCs(
    EntityType.ENTITY_DARK_ESAU,
    DarkEsauVariant.DARK_ESAU,
  );
  for (const darkEsau of darkEsaus) {
    darkEsau.Remove();
    v.run.seededDeath.removedDarkEsau = true;
  }
}

export function debuffOff(player: EntityPlayer): void {
  applySeededGhostFade(player, false);
  debuffOffRestoreSize(player);
  debuffOffAddActiveItems(player);
  debuffOffAddAllItems(player);
  debuffOffAddGoldenBombAndKey(player);
  debuffOffAddDarkEsau();
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
      giveTransformationHelper(player, activeItemDescription.item);
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
    giveTransformationHelper(player, collectibleType);
  }

  arrayEmpty(items);

  // Now that we have add every item, update the players stats
  player.AddCacheFlags(CacheFlag.CACHE_ALL);
  player.EvaluateItems();

  disableSpiritShackles(player);
}

function giveTransformationHelper(
  player: EntityPlayer,
  collectibleType: CollectibleType,
) {
  const transformations = getTransformationsForItem(collectibleType);
  for (const transformation of transformations.values()) {
    const helperCollectibleType =
      TRANSFORMATION_TO_HELPER_MAP.get(transformation);
    if (helperCollectibleType !== undefined) {
      player.AddCollectible(helperCollectibleType);
    }
  }
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
  const stageType = g.l.GetStageType();
  const character = player.GetPlayerType();

  if (character === PlayerType.PLAYER_ESAU) {
    // Esau can not carry bombs and keys
    return;
  }

  if (v.run.seededDeath.goldenBomb) {
    v.run.seededDeath.goldenBomb = false;

    if (
      stage === v.run.seededDeath.stage &&
      stageType === v.run.seededDeath.stageType
    ) {
      player.AddGoldenBomb();
    }
  }

  if (v.run.seededDeath.goldenKey) {
    v.run.seededDeath.goldenKey = false;

    if (
      stage === v.run.seededDeath.stage &&
      stageType === v.run.seededDeath.stageType
    ) {
      player.AddGoldenKey();
    }
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
    undefined,
  );
}

export function applySeededGhostFade(
  player: EntityPlayer,
  enabled: boolean,
): void {
  const character = player.GetPlayerType();

  const sprite = player.GetSprite();
  const newColor = enabled ? QUARTER_FADED_COLOR : getDefaultColor();
  sprite.Color = newColor;

  if (character === PlayerType.PLAYER_THESOUL) {
    const forgottenBodies = getFamiliars(FamiliarVariant.FORGOTTEN_BODY);
    for (const forgottenBody of forgottenBodies) {
      const forgottenSprite = forgottenBody.GetSprite();
      forgottenSprite.Color = newColor;
    }
  } else if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== undefined) {
      const twinSprite = twin.GetSprite();
      twinSprite.Color = newColor;
    }
  }
}
