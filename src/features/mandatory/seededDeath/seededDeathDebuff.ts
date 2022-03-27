import {
  emptyArray,
  getCollectibles,
  getEnumValues,
  getFamiliars,
  getNPCs,
  getPlayerCollectibleMap,
  getTotalCharge,
  getTransformationsForCollectibleType,
  isActiveSlotEmpty,
  isCharacter,
  removeAllFamiliars,
  removeAllPlayerHealth,
  removeCollectibleFromItemTracker,
  removeDeadEyeMultiplier,
  repeat,
  runInNGameFrames,
  sfxManager,
  spawn,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";
import g from "../../../globals";
import { TRANSFORMATION_TO_HELPERS } from "../../../objects/transformationToHelper";
import { TRANSFORMATION_HELPERS_SET } from "../../../sets/transformationHelpersSet";
import { ActiveCollectibleDescription } from "../../../types/ActiveCollectibleDescription";
import { setFastTravelTookDamage } from "../../optional/major/fastTravel/v";
import { applySeededGhostFade } from "./seededDeath";
import v from "./v";

const NUM_FRAMES_AFTER_STATE_CHANGE_UNTIL_LOST_SOUL_DIES = 4;

export function debuffOn(player: EntityPlayer): void {
  // Make them take "red heart damage" for the purposes of getting a Devil Deal
  g.l.SetRedHeartDamage();

  // Make them take damage for the purposes of getting a Perfection Trinket
  setFastTravelTookDamage();

  debuffOnRemoveSize(player);
  debuffOnSetHealth(player);
  debuffOnRemoveActiveCollectibles(player);
  debuffOnRemoveAllCollectibles(player);
  debuffOnRemoveGoldenBombsAndKeys(player);
  debuffOnRemoveSomeFamiliars();
  debuffOnRemoveAllWisps(player);
  removeDeadEyeMultiplier(player);
  debuffOnRemoveDarkEsau();
  setCheckpointCollision(false);
}

function debuffOnRemoveSize(player: EntityPlayer) {
  // Store their size for later and reset it to default
  // (in case they had collectibles like Magic Mushroom and so forth)
  if (isCharacter(player, PlayerType.PLAYER_ESAU)) {
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
      return;
    }

    // 16, 17
    case PlayerType.PLAYER_THEFORGOTTEN:
    case PlayerType.PLAYER_THESOUL: {
      // One half-filled bone heart + one half soul heart
      player.AddBoneHearts(1);
      player.AddHearts(1);
      player.AddSoulHearts(1);
      return;
    }

    // 18, 22
    case PlayerType.PLAYER_BETHANY:
    case PlayerType.PLAYER_MAGDALENE_B: {
      // 1.5 filled red heart containers
      player.AddMaxHearts(4, true);
      player.AddHearts(3);
      return;
    }

    default: {
      // One and a half soul hearts
      player.AddSoulHearts(3);
    }
  }
}

function debuffOnRemoveActiveCollectibles(player: EntityPlayer) {
  const activesMap = isCharacter(player, PlayerType.PLAYER_ESAU)
    ? v.run.actives2
    : v.run.actives;

  // Before we iterate over the active collectibles, we need to remove the book that is sitting
  // under the active collectible, if any
  if (player.HasCollectible(CollectibleType.COLLECTIBLE_BOOK_OF_VIRTUES)) {
    v.run.hasBookOfVirtues = true;
    removeCollectible(player, CollectibleType.COLLECTIBLE_BOOK_OF_VIRTUES);
  }
  if (
    isCharacter(player, PlayerType.PLAYER_JUDAS) &&
    player.HasCollectible(CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL) &&
    player.HasCollectible(CollectibleType.COLLECTIBLE_BIRTHRIGHT)
  ) {
    v.run.hasBookOfBelialBirthrightCombo = true;
    removeCollectible(player, CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL);
    removeCollectible(player, CollectibleType.COLLECTIBLE_BIRTHRIGHT);
  }

  // Go through all of their active collectibles
  for (const activeSlot of getEnumValues(ActiveSlot)) {
    if (isActiveSlotEmpty(player, activeSlot)) {
      continue;
    }

    const collectibleType = player.GetActiveItem(activeSlot);
    const charge = getTotalCharge(player, activeSlot);
    const activeCollectibleDescription: ActiveCollectibleDescription = {
      collectibleType,
      charge,
    };
    activesMap.set(activeSlot, activeCollectibleDescription);
  }

  // Now that we have gathered information about all of the active collectibles, remove them
  // We do it in this order to prevent bugs with removing collectibles on the wrong slot
  // (e.g. Isaac with the double D6)
  for (const activeCollectibleDescription of activesMap.values()) {
    if (
      activeCollectibleDescription.collectibleType !==
      CollectibleType.COLLECTIBLE_NULL
    ) {
      removeCollectible(player, activeCollectibleDescription.collectibleType);
    }
  }
}

function debuffOnRemoveAllCollectibles(player: EntityPlayer) {
  const collectibles = isCharacter(player, PlayerType.PLAYER_ESAU)
    ? v.run.collectibles2
    : v.run.collectibles;

  const collectibleMap = getPlayerCollectibleMap(player);
  for (const [collectibleType, collectibleNum] of collectibleMap.entries()) {
    repeat(collectibleNum, () => {
      if (!TRANSFORMATION_HELPERS_SET.has(collectibleType)) {
        collectibles.push(collectibleType);
      }

      removeCollectible(player, collectibleType);
    });
  }

  // Now that we have deleted every collectible, update the players stats
  player.AddCacheFlags(CacheFlag.CACHE_ALL);
  player.EvaluateItems();
}

function debuffOnRemoveGoldenBombsAndKeys(player: EntityPlayer) {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  // Esau can not carry bombs and keys
  if (isCharacter(player, PlayerType.PLAYER_ESAU)) {
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

function debuffOnRemoveSomeFamiliars() {
  // Remove all Sumptorium familiars
  // (this includes familiars created by red hearts, soul hearts, black hearts, etc.)
  removeAllFamiliars(FamiliarVariant.BLOOD_BABY);
}

function debuffOnRemoveAllWisps(player: EntityPlayer) {
  removeAllFamiliars(FamiliarVariant.WISP);
  removeAllFamiliars(FamiliarVariant.ITEM_WISP);

  // After removing item wisps, the items related to the wisps will not disappear
  // We can work around this by spawning an item wisp that does nothing,
  // which will remove all other item wisps
  player.AddItemWisp(CollectibleTypeCustom.COLLECTIBLE_DEBUG, Vector(0, 0));

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
  debuffOffAddActiveCollectibles(player);
  debuffOffAddAllCollectibles(player);
  debuffOffAddGoldenBombAndKey(player);
  debuffOffAddDarkEsau();
  setCheckpointCollision(true);
}

function debuffOffRestoreSize(player: EntityPlayer) {
  // Set their size to the way it was before the debuff was applied
  if (isCharacter(player, PlayerType.PLAYER_ESAU)) {
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

function debuffOffAddActiveCollectibles(player: EntityPlayer) {
  const activesMap = isCharacter(player, PlayerType.PLAYER_ESAU)
    ? v.run.actives2
    : v.run.actives;

  // Before we restore the active collectibles, we need to restore the book that was sitting under
  // the active collectible, if any
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

  // Restore all of their active collectibles
  for (const activeSlot of getEnumValues(ActiveSlot)) {
    const activeCollectibleDescription = activesMap.get(activeSlot);
    if (activeCollectibleDescription === undefined) {
      continue;
    }
    activesMap.delete(activeSlot);

    player.AddCollectible(
      activeCollectibleDescription.collectibleType,
      activeCollectibleDescription.charge,
      false,
      activeSlot,
    );
    giveTransformationHelper(
      player,
      activeCollectibleDescription.collectibleType,
    );
  }
}

function debuffOffAddAllCollectibles(player: EntityPlayer) {
  const collectibles = isCharacter(player, PlayerType.PLAYER_ESAU)
    ? v.run.collectibles2
    : v.run.collectibles;

  for (const collectibleType of collectibles) {
    // If the player had Experimental Treatment (240), when it was removed, none of the stat
    // modifications were removed, since they are not connected to the collectible
    // When we re-add Experimental Treatment again, we do not have to worry about it granting more
    // stats, because passing false to the "firstTimePickingUp" argument ensures that it will do
    // nothing
    player.AddCollectible(collectibleType, 0, false);
    giveTransformationHelper(player, collectibleType);
  }

  emptyArray(collectibles);

  // Now that we have added every collectible, update the players stats
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
    const helperCollectibleType = TRANSFORMATION_TO_HELPERS.get(transformation);
    if (helperCollectibleType !== undefined) {
      player.AddCollectible(helperCollectibleType);
    }
  }
}

function disableLostSoul() {
  // When we re-give the Lost Soul collectible to the player,
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
      sfxManager.Stop(SoundEffect.SOUND_ISAACDIES);
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

  // Esau can not carry bombs and keys
  if (isCharacter(player, PlayerType.PLAYER_ESAU)) {
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
  spawn(EntityType.ENTITY_DARK_ESAU, DarkEsauVariant.DARK_ESAU, 0, centerPos);
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
