import {
  arrayEmpty,
  getCollectibles,
  getEnumValues,
  getFamiliars,
  getNPCs,
  getPlayerCollectibleMap,
  getTransformationsForCollectibleType,
  removeAllFamiliars,
  removeAllPlayerHealth,
  removeCollectibleFromItemTracker,
  removeDeadEyeMultiplier,
  runInNGameFrames,
} from "isaacscript-common";
import g from "../../../globals";
import { TRANSFORMATION_TO_HELPER_MAP } from "../../../maps/transformationToHelperMap";
import { ActiveItemDescription } from "../../../types/ActiveItemDescription";
import { CollectibleTypeCustom } from "../../../types/CollectibleTypeCustom";
import { TRANSFORMATION_HELPERS } from "../../../types/transformationHelpers";
import { applySeededGhostFade } from "./seededDeath";
import v from "./v";

const NUM_FRAMES_AFTER_STATE_CHANGE_UNTIL_LOST_SOUL_DIES = 4;

export function debuffOn(player: EntityPlayer): void {
  // Make them take "red heart damage" for the purposes of getting a Devil Deal
  g.l.SetRedHeartDamage();

  debuffOnRemoveSize(player);
  debuffOnSetHealth(player);
  debuffOnRemoveActiveItems(player);
  debuffOnRemoveAllItems(player);
  debuffOnRemoveGoldenBombsAndKeys(player);
  debuffOnRemoveAllWisps(player);
  removeDeadEyeMultiplier(player);
  debuffOnRemoveDarkEsau();
  setCheckpointCollision(false);
}

function debuffOnRemoveSize(player: EntityPlayer) {
  const character = player.GetPlayerType();

  // Store their size for later and reset it to default
  // (in case they had items like Magic Mushroom and so forth)
  if (character === PlayerType.PLAYER_ESAU) {
    v.run.spriteScale2 = player.SpriteScale;
  } else {
    v.run.spriteScale = player.SpriteScale;
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
      // One half-filled bone heart
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

    // 18, 22
    case PlayerType.PLAYER_BETHANY:
    case PlayerType.PLAYER_MAGDALENE_B: {
      // 1.5 filled red heart containers
      player.AddMaxHearts(4, true);
      player.AddHearts(3);
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
    character === PlayerType.PLAYER_ESAU ? v.run.actives2 : v.run.actives;

  // Before we iterate over the active items, we need to remove the book that is sitting under the
  // active item, if any
  if (player.HasCollectible(CollectibleType.COLLECTIBLE_BOOK_OF_VIRTUES)) {
    v.run.hasBookOfVirtues = true;
    removeCollectible(player, CollectibleType.COLLECTIBLE_BOOK_OF_VIRTUES);
  }
  if (
    character === PlayerType.PLAYER_JUDAS &&
    player.HasCollectible(CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL) &&
    player.HasCollectible(CollectibleType.COLLECTIBLE_BIRTHRIGHT)
  ) {
    v.run.hasBookOfBelialBirthrightCombo = true;
    removeCollectible(player, CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL);
    removeCollectible(player, CollectibleType.COLLECTIBLE_BIRTHRIGHT);
  }

  // Go through all of their active items
  for (const activeSlot of getEnumValues(ActiveSlot)) {
    const collectibleType = player.GetActiveItem(activeSlot);
    if (collectibleType === CollectibleType.COLLECTIBLE_NULL) {
      continue;
    }

    const charge = player.GetActiveCharge(activeSlot);
    const batteryCharge = player.GetBatteryCharge(activeSlot);

    const activeItemDescription: ActiveItemDescription = {
      collectibleType,
      charge,
      batteryCharge,
    };
    activesMap.set(activeSlot, activeItemDescription);
  }

  // Now that we have gathered information about all of the active items, remove them
  // We do it in this order to prevent bugs with removing items on the wrong slot
  // (e.g. Isaac with the double D6)
  for (const activeItem of activesMap.values()) {
    if (activeItem.collectibleType !== CollectibleType.COLLECTIBLE_NULL) {
      removeCollectible(player, activeItem.collectibleType);
    }
  }
}

function debuffOnRemoveAllItems(player: EntityPlayer) {
  const character = player.GetPlayerType();
  const items =
    character === PlayerType.PLAYER_ESAU ? v.run.items2 : v.run.items;

  const collectibleMap = getPlayerCollectibleMap(player);
  for (const [collectibleType, collectibleNum] of collectibleMap.entries()) {
    for (let i = 0; i < collectibleNum; i++) {
      if (!TRANSFORMATION_HELPERS.has(collectibleType)) {
        items.push(collectibleType);
      }

      removeCollectible(player, collectibleType);
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
  v.run.goldenBomb = player.HasGoldenBomb();
  v.run.goldenKey = player.HasGoldenKey();

  // The golden bomb / key are tied to the particular stage
  v.run.stage = stage;
  v.run.stageType = stageType;

  // Remove any golden bombs and keys
  player.RemoveGoldenBomb();
  player.RemoveGoldenKey();
}

function debuffOnRemoveAllWisps(player: EntityPlayer) {
  removeAllFamiliars(FamiliarVariant.WISP);
  removeAllFamiliars(FamiliarVariant.ITEM_WISP);

  // After removing item wisps, the items related to the wisps will not disappear
  // We can work around this by spawning an item wisp that does nothing,
  // which will remove all other item wisps
  player.AddItemWisp(
    CollectibleTypeCustom.COLLECTIBLE_MAGIC_MUSHROOM_PLACEHOLDER,
    Vector(0, 0),
  );

  // Then remove that item wisp again
  removeAllFamiliars(FamiliarVariant.ITEM_WISP);
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
    v.run.removedDarkEsau = true;
  }
}

export function setCheckpointCollision(enabled: boolean): void {
  const newCollisionClass = enabled
    ? EntityCollisionClass.ENTCOLL_ALL
    : EntityCollisionClass.ENTCOLL_NONE;

  const checkpoints = getCollectibles(
    CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
  );
  for (const checkpoint of checkpoints) {
    checkpoint.EntityCollisionClass = newCollisionClass;
  }
}

export function debuffOff(player: EntityPlayer): void {
  applySeededGhostFade(player, false);
  debuffOffRestoreSize(player);
  debuffOffAddActiveItems(player);
  debuffOffAddAllItems(player);
  debuffOffAddGoldenBombAndKey(player);
  debuffOffAddDarkEsau();
  setCheckpointCollision(true);
}

function debuffOffRestoreSize(player: EntityPlayer) {
  const character = player.GetPlayerType();

  // Set their size to the way it was before the debuff was applied
  if (character === PlayerType.PLAYER_ESAU) {
    if (v.run.spriteScale2 !== null) {
      player.SpriteScale = v.run.spriteScale2;
    }
    v.run.spriteScale2 = null;
  } else {
    if (v.run.spriteScale !== null) {
      player.SpriteScale = v.run.spriteScale;
    }
    v.run.spriteScale = null;
  }
}

function debuffOffAddActiveItems(player: EntityPlayer) {
  const character = player.GetPlayerType();
  const activesMap =
    character === PlayerType.PLAYER_ESAU ? v.run.actives2 : v.run.actives;

  // Before we restore the active items, we need to restore the book that was sitting under the
  // active item, if any
  if (v.run.hasBookOfVirtues) {
    v.run.hasBookOfVirtues = false;

    // We set "firstTimePickingUp" to true since it needs to count towards Bookworm
    player.AddCollectible(CollectibleType.COLLECTIBLE_BOOK_OF_VIRTUES, 0, true);
  }
  if (v.run.hasBookOfBelialBirthrightCombo) {
    v.run.hasBookOfBelialBirthrightCombo = false;

    player.AddCollectible(CollectibleType.COLLECTIBLE_BIRTHRIGHT, 0, false);

    // We set "firstTimePickingUp" to true since it needs to count towards Bookworm
    player.AddCollectible(CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL, 0, true);
  }

  // Restore all of their active items
  for (const activeSlot of getEnumValues(ActiveSlot)) {
    const activeItemDescription = activesMap.get(activeSlot);
    if (activeItemDescription === undefined) {
      continue;
    }
    activesMap.delete(activeSlot);

    const totalCharge =
      activeItemDescription.charge + activeItemDescription.batteryCharge;
    player.AddCollectible(
      activeItemDescription.collectibleType,
      totalCharge,
      false,
      activeSlot,
    );
    giveTransformationHelper(player, activeItemDescription.collectibleType);
  }
}

function debuffOffAddAllItems(player: EntityPlayer) {
  const character = player.GetPlayerType();
  const items =
    character === PlayerType.PLAYER_ESAU ? v.run.items2 : v.run.items;

  for (const collectibleType of items) {
    player.AddCollectible(collectibleType, 0, false);
    giveTransformationHelper(player, collectibleType);
  }

  arrayEmpty(items);

  // Now that we have add every item, update the players stats
  player.AddCacheFlags(CacheFlag.CACHE_ALL);
  player.EvaluateItems();

  disableLostSoul(); // 612
  disableSpiritShackles(player); // 674
}

function giveTransformationHelper(
  player: EntityPlayer,
  collectibleType: CollectibleType,
) {
  const transformations = getTransformationsForCollectibleType(collectibleType);
  for (const transformation of transformations.values()) {
    const helperCollectibleType =
      TRANSFORMATION_TO_HELPER_MAP.get(transformation);
    if (helperCollectibleType !== undefined) {
      player.AddCollectible(helperCollectibleType);
    }
  }
}

function disableLostSoul() {
  // When we re-give the Lost Soul item to the player,
  // it will re-create the familiar in an alive state
  // After a seeded death, the familiar state should always be set to being dead
  const lostSouls = getFamiliars(FamiliarVariant.LOST_SOUL);
  for (const lostSoul of lostSouls) {
    lostSoul.State = LostSoulState.DEAD;

    // For some reason, it takes N game frames after changing the state for the Lost Soul to
    // actually die
    const lostSoulPointer = EntityPtr(lostSoul);
    runInNGameFrames(() => {
      // Changing the state will make the death animation play, so make it invisible
      // The invisibility will automatically be removed by the game upon reaching the next floor
      const lostSoulReference = lostSoulPointer.Ref;
      if (lostSoulReference === undefined || !lostSoulReference.Exists()) {
        return;
      }

      lostSoulReference.Visible = false;
      g.sfx.Stop(SoundEffect.SOUND_ISAACDIES);
    }, NUM_FRAMES_AFTER_STATE_CHANGE_UNTIL_LOST_SOUL_DIES);
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

  if (v.run.goldenBomb) {
    v.run.goldenBomb = false;

    if (stage === v.run.stage && stageType === v.run.stageType) {
      player.AddGoldenBomb();
    }
  }

  if (v.run.goldenKey) {
    v.run.goldenKey = false;

    if (stage === v.run.stage && stageType === v.run.stageType) {
      player.AddGoldenKey();
    }
  }
}

function debuffOffAddDarkEsau() {
  if (!v.run.removedDarkEsau) {
    return;
  }
  v.run.removedDarkEsau = false;

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

function removeCollectible(
  player: EntityPlayer,
  collectibleType: CollectibleType,
) {
  // We remove the collectible twice to account for the vanilla bug where removing it once will not
  // properly decrement the transformation counter
  // https://github.com/Meowlala/RepentanceAPIIssueTracker/issues/404
  player.RemoveCollectible(collectibleType);
  player.RemoveCollectible(collectibleType);

  removeCollectibleFromItemTracker(collectibleType);
}
