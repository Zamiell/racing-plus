import {
  ActiveSlot,
  Card,
  CollectibleType,
  FamiliarVariant,
  ItemType,
  PillEffect,
  PlayerForm,
  UseFlag,
} from "isaac-typescript-definitions";
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
  newRNG,
  PickingUpItem,
  saveDataManager,
  setSeed,
} from "isaacscript-common";
import { ChallengeCustom } from "../../enums/ChallengeCustom";
import { PlayerTypeCustom } from "../../enums/PlayerTypeCustom";
import g from "../../globals";
import { goingToRaceRoom } from "../race/raceRoom";

const FRAMES_BEFORE_FADE = 50;

// Listed in order of the wiki (32 in total)
// https://bindingofisaacrebirth.fandom.com/wiki/Dead_Sea_Scrolls?dlcfilter=3
const DEAD_SEA_SCROLL_EFFECTS: readonly CollectibleType[] = [
  CollectibleType.ANARCHIST_COOKBOOK,
  CollectibleType.BEST_FRIEND,
  CollectibleType.BOBS_ROTTEN_HEAD,
  CollectibleType.BOOK_OF_BELIAL,
  CollectibleType.BOOK_OF_REVELATIONS,
  CollectibleType.BOOK_OF_SHADOWS,
  CollectibleType.BOOK_OF_SIN,
  CollectibleType.CRACK_THE_SKY,
  CollectibleType.CRYSTAL_BALL,
  CollectibleType.DECK_OF_CARDS,
  CollectibleType.DOCTORS_REMOTE,
  CollectibleType.GAMEKID,
  CollectibleType.HOURGLASS,
  CollectibleType.LEMON_MISHAP,
  CollectibleType.MOMS_BOTTLE_OF_PILLS,
  CollectibleType.MOMS_BRA,
  CollectibleType.MOMS_PAD,
  CollectibleType.MONSTER_MANUAL,
  CollectibleType.MONSTROS_TOOTH,
  CollectibleType.MR_BOOM,
  CollectibleType.MY_LITTLE_UNICORN,
  CollectibleType.THE_NAIL,
  CollectibleType.NECRONOMICON,
  CollectibleType.PINKING_SHEARS,
  CollectibleType.PRAYER_CARD,
  CollectibleType.SHOOP_DA_WHOOP,
  CollectibleType.SPIDER_BUTT,
  CollectibleType.TAMMYS_HEAD,
  CollectibleType.TELEPATHY_BOOK,
  CollectibleType.TELEPORT,
  CollectibleType.WE_NEED_TO_GO_DEEPER,
  CollectibleType.YUM_HEART,
];

const v = {
  run: {
    deadSeaScrollsRNG: newRNG(),
    text: null as string | null,

    /** Text of less importance that is only shown if there is no main text. */
    tabText: null as string | null,

    renderFrameSet: null as int | null,
  },
};

export function init(): void {
  saveDataManager("streakText", v);
}

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  checkDraw();
}

function checkDraw() {
  // Players who prefer the vanilla streak text will have a separate mod enabled.
  if (VanillaStreakText !== undefined) {
    return;
  }

  const hud = g.g.GetHUD();
  if (!hud.IsVisible()) {
    return;
  }

  // We don't check for the game being paused because it looks buggy if the text disappears when
  // changing rooms.

  if (v.run.renderFrameSet === null) {
    // Only draw the tab text if there is no normal streak text showing.
    if (v.run.tabText !== null) {
      draw(v.run.tabText, 1);
    }

    return;
  }

  // The streak text will slowly fade out.
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

// ModCallback.POST_USE_ITEM (3)
// CollectibleType.LEMEGETON (712)
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

// ModCallback.POST_USE_CARD (5)
export function useCard(card: Card): void {
  // We ignore Blank Runes because we want to show the streak text of the actual random effect.
  if (card === Card.RUNE_BLANK) {
    return;
  }

  const cardName = getCardName(card);
  set(cardName);
}

// ModCallback.POST_USE_PILL (10)
export function usePill(pillEffect: PillEffect): void {
  const pillEffectName = getPillEffectName(pillEffect);
  set(pillEffectName);
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const startSeed = g.seeds.GetStartSeed();
  setSeed(v.run.deadSeaScrollsRNG, startSeed);
}

// ModCallback.POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  if (shouldShowLevelText()) {
    showLevelText();
  }
}

function shouldShowLevelText() {
  const challenge = Isaac.GetChallenge();

  return (
    // There is no need to show the level text in the Change Char Order custom challenge
    challenge !== ChallengeCustom.CHANGE_CHAR_ORDER &&
    // If the race is finished, the "Victory Lap" text will overlap with the stage text,
    // so don't bother showing it.
    !g.raceVars.finished &&
    // If one or more players are playing as "Random Baby", the baby descriptions will overlap with
    // the stage text, so don't bother showing it.
    !anyPlayerIs(PlayerTypeCustom.RANDOM_BABY)
  );
}

function showLevelText() {
  const effectiveStage = getEffectiveStage();

  // Show what the new floor is. (The game will not show this naturally after doing a "stage"
  // console command.)
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

// ModCallback.PRE_USE_ITEM (23)
// CollectibleType.DEAD_SEA_SCROLLS (124)
export function preUseItemDeadSeaScrolls(
  player: EntityPlayer,
  activeSlot: ActiveSlot,
): boolean | void {
  const hud = g.g.GetHUD();

  const randomCollectible = getRandomArrayElement(
    DEAD_SEA_SCROLL_EFFECTS,
    v.run.deadSeaScrollsRNG,
  );
  player.UseActiveItem(randomCollectible, UseFlag.OWNED, activeSlot);

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
  const trinket = pickingUpItem.itemType === ItemType.TRINKET;
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
