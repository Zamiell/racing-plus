import {
  anyPlayerIs,
  getCardName,
  getCollectibleName,
  getEffectiveStage,
  getFamiliars,
  getPillEffectName,
  getRandomArrayElement,
  getScreenBottomRightPos,
  getTransformationName,
  getTrinketName,
  nextSeed,
  PickingUpItem,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";
import { ChallengeCustom } from "../../types/ChallengeCustom";
import { goingToRaceRoom } from "../race/raceRoom";

const FRAMES_BEFORE_FADE = 50;

// Listed in order of the wiki (32 in total)
// https://bindingofisaacrebirth.fandom.com/wiki/Dead_Sea_Scrolls?dlcfilter=3
const DEAD_SEA_SCROLL_EFFECTS: readonly CollectibleType[] = [
  CollectibleType.COLLECTIBLE_ANARCHIST_COOKBOOK,
  CollectibleType.COLLECTIBLE_BEST_FRIEND,
  CollectibleType.COLLECTIBLE_BOBS_ROTTEN_HEAD,
  CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL,
  CollectibleType.COLLECTIBLE_BOOK_OF_REVELATIONS,
  CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS,
  CollectibleType.COLLECTIBLE_BOOK_OF_SIN,
  CollectibleType.COLLECTIBLE_CRACK_THE_SKY,
  CollectibleType.COLLECTIBLE_CRYSTAL_BALL,
  CollectibleType.COLLECTIBLE_DECK_OF_CARDS,
  CollectibleType.COLLECTIBLE_DOCTORS_REMOTE,
  CollectibleType.COLLECTIBLE_GAMEKID,
  CollectibleType.COLLECTIBLE_HOURGLASS,
  CollectibleType.COLLECTIBLE_LEMON_MISHAP,
  CollectibleType.COLLECTIBLE_MOMS_BOTTLE_OF_PILLS,
  CollectibleType.COLLECTIBLE_MOMS_BRA,
  CollectibleType.COLLECTIBLE_MOMS_PAD,
  CollectibleType.COLLECTIBLE_MONSTER_MANUAL,
  CollectibleType.COLLECTIBLE_MONSTROS_TOOTH,
  CollectibleType.COLLECTIBLE_MR_BOOM,
  CollectibleType.COLLECTIBLE_MY_LITTLE_UNICORN,
  CollectibleType.COLLECTIBLE_THE_NAIL,
  CollectibleType.COLLECTIBLE_NECRONOMICON,
  CollectibleType.COLLECTIBLE_PINKING_SHEARS,
  CollectibleType.COLLECTIBLE_PRAYER_CARD,
  CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP,
  CollectibleType.COLLECTIBLE_SPIDER_BUTT,
  CollectibleType.COLLECTIBLE_TAMMYS_HEAD,
  CollectibleType.COLLECTIBLE_TELEPATHY_BOOK,
  CollectibleType.COLLECTIBLE_TELEPORT,
  CollectibleType.COLLECTIBLE_WE_NEED_TO_GO_DEEPER,
  CollectibleType.COLLECTIBLE_YUM_HEART,
];

const v = {
  run: {
    deadSeaScrollsSeed: 0 as Seed,
    text: null as string | null,

    /** Text of less importance that is only shown if there is no main text. */
    tabText: null as string | null,

    renderFrameSet: null as int | null,
  },
};

export function init(): void {
  saveDataManager("streakText", v);
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  checkDraw();
}

function checkDraw() {
  // Players who prefer the vanilla streak text will have a separate mod enabled
  if (VanillaStreakText !== undefined) {
    return;
  }

  const hud = g.g.GetHUD();
  if (!hud.IsVisible()) {
    return;
  }

  // We don't check for the game being paused because it looks buggy if the text disappears when
  // changing rooms

  if (v.run.renderFrameSet === null) {
    // Only draw the tab text if there is no normal streak text showing
    if (v.run.tabText !== null) {
      draw(v.run.tabText, 1);
    }

    return;
  }

  // The streak text will slowly fade out
  const fade = getFade(v.run.renderFrameSet);
  if (fade <= 0) {
    v.run.renderFrameSet = null;
    return;
  }

  if (v.run.text !== null) {
    draw(v.run.text, fade);
  }
}

function getFade(renderFrame: int) {
  const renderFrameCount = Isaac.GetFrameCount();
  const elapsedFrames = renderFrameCount - renderFrame;

  if (elapsedFrames <= FRAMES_BEFORE_FADE) {
    return 1;
  }

  const fadeFrames = elapsedFrames - FRAMES_BEFORE_FADE;
  return 1 - 0.02 * fadeFrames;
}

function draw(text: string, fade: float) {
  const bottomRightPos = getScreenBottomRightPos();
  const x = bottomRightPos.X * 0.5;
  const y = bottomRightPos.Y * 0.25;

  const font = g.fonts.droid;
  const length = font.GetStringWidthUTF8(text);
  const color = KColor(1, 1, 1, fade);
  font.DrawString(text, x - length / 2, y, color);
}

// ModCallbacks.MC_USE_ITEM (3)
// CollectibleType.COLLECTIBLE_LEMEGETON (712)
export function useItemLemegeton(): void {
  const wisp = getItemWispThatJustSpawned();
  if (wisp !== undefined) {
    const collectibleName = getCollectibleName(wisp.SubType);
    set(collectibleName);
  }
}

function getItemWispThatJustSpawned() {
  const wisps = getFamiliars(FamiliarVariant.ITEM_WISP);
  return wisps.find((wisp) => wisp.FrameCount === 0);
}

// ModCallbacks.MC_USE_CARD (5)
export function useCard(card: Card): void {
  // We ignore Blank Runes because we want to show the streak text of the actual random effect
  if (card === Card.RUNE_BLANK) {
    return;
  }

  const cardName = getCardName(card);
  set(cardName);
}

// ModCallbacks.MC_USE_PILL (10)
export function usePill(pillEffect: PillEffect): void {
  const pillEffectName = getPillEffectName(pillEffect);
  set(pillEffectName);
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const startSeed = g.seeds.GetStartSeed();
  v.run.deadSeaScrollsSeed = startSeed;
}

// ModCallbacks.MC_POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  if (shouldShowLevelText()) {
    showLevelText();
  }
}

function shouldShowLevelText() {
  const challenge = Isaac.GetChallenge();
  const randomBaby = Isaac.GetPlayerTypeByName("Random Baby");

  return (
    // There is no need to show the level text in the Change Char Order custom challenge
    challenge !== ChallengeCustom.CHANGE_CHAR_ORDER &&
    // If the race is finished, the "Victory Lap" text will overlap with the stage text,
    // so don't bother showing it
    !g.raceVars.finished &&
    // If one or more players are playing as "Random Baby", the baby descriptions will overlap with
    // the stage text, so don't bother showing it
    !anyPlayerIs(randomBaby)
  );
}

function showLevelText() {
  const effectiveStage = getEffectiveStage();

  // Show what the new floor is
  // (the game will not show this naturally after doing a "stage" console command)
  if (VanillaStreakText !== undefined && effectiveStage !== 1) {
    g.l.ShowName(false);
  } else if (!goingToRaceRoom()) {
    const text = getLevelText();
    set(text);
  }
}

export function getLevelText(): string {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (stage === 9) {
    return "Blue Womb";
  }

  return g.l.GetName(stage, stageType);
}

// ModCallbacks.MC_PRE_USE_ITEM (23)
// CollectibleType.COLLECTIBLE_DEAD_SEA_SCROLLS (124)
export function preUseItemDeadSeaScrolls(
  player: EntityPlayer,
  activeSlot: ActiveSlot,
): boolean | void {
  const hud = g.g.GetHUD();

  v.run.deadSeaScrollsSeed = nextSeed(v.run.deadSeaScrollsSeed);
  const randomCollectible = getRandomArrayElement(
    DEAD_SEA_SCROLL_EFFECTS,
    v.run.deadSeaScrollsSeed,
  );
  player.UseActiveItem(randomCollectible, UseFlag.USE_OWNED, activeSlot);

  const collectibleName = getCollectibleName(randomCollectible);
  if (VanillaStreakText !== undefined) {
    hud.ShowItemText(collectibleName);
  } else {
    set(collectibleName);
  }

  return true;
}

// ModCallbacksCustom.MC_PRE_ITEM_PICKUP
export function preItemPickup(pickingUpItem: PickingUpItem): void {
  const trinket = pickingUpItem.itemType === ItemType.ITEM_TRINKET;
  const name = trinket
    ? getTrinketName(pickingUpItem.subType)
    : getCollectibleName(pickingUpItem.subType);

  set(name);
}

// ModCallbacksCustom.MC_POST_TRANSFORMATION
export function postTransformation(
  playerForm: PlayerForm,
  hasForm: boolean,
): void {
  if (!hasForm) {
    return;
  }

  const transformationName = getTransformationName(playerForm);
  set(transformationName);
}

export function set(text: string): void {
  v.run.text = text;
  v.run.renderFrameSet = Isaac.GetFrameCount();
}

export function setTab(value: string | null): void {
  v.run.tabText = value;
}
