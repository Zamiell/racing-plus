// We replace the vanilla streak text because it blocks the map occasionally

import {
  anyPlayerIs,
  getItemName,
  getRandomArrayElement,
  gridToPos,
  onRepentanceStage,
  PickingUpItem,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";
import { incrementRNG } from "../../util";
import RaceStatus from "../race/types/RaceStatus";
import { ChallengeCustom } from "../speedrun/enums";

const FRAMES_BEFORE_FADE = 50;

// Listed in order of the wiki (32 in total)
// https://bindingofisaacrebirth.fandom.com/wiki/Dead_Sea_Scrolls?dlcfilter=3
const DEAD_SEA_SCROLL_EFFECTS = [
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

const TRANSFORMATION_NAMES = [
  "Guppy",
  "Beelzebub",
  "Fun Guy",
  "Seraphim",
  "Bob",
  "Spun",
  "Yes Mother?",
  "Conjoined",
  "Leviathan",
  "Oh Crap",
  "Bookworm",
  "Adult",
  "Spider Baby",
  "Stompy",
  "Flight", // Unused
];

const v = {
  run: {
    deadSeaScrollsSeed: 0,
    text: null as string | null,

    /** Text of less importance that is only shown if there is no main text. */
    tabText: null as string | null,

    frameSet: null as int | null,
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

  // We don't check for "IsPaused()" because it looks buggy if the text disappears when changing
  // rooms

  if (v.run.frameSet === null) {
    // Only draw the tab text if there is no normal streak text showing
    if (v.run.tabText !== null) {
      draw(v.run.tabText, 1);
    }

    return;
  }

  // The streak text will slowly fade out
  const fade = getFade(v.run.frameSet);
  if (fade <= 0) {
    v.run.frameSet = null;
    return;
  }

  if (v.run.text !== null) {
    draw(v.run.text, fade);
  }
}

function getFade(frame: int) {
  const isaacFrameCount = Isaac.GetFrameCount();
  const elapsedFrames = isaacFrameCount - frame;

  if (elapsedFrames <= FRAMES_BEFORE_FADE) {
    return 1;
  }

  const fadeFrames = elapsedFrames - FRAMES_BEFORE_FADE;
  return 1 - 0.02 * fadeFrames;
}

function draw(text: string, fade: float) {
  const positionGame = gridToPos(6, 0); // Below the top door
  const position = Isaac.WorldToRenderPosition(positionGame);
  const color = KColor(1, 1, 1, fade);
  const scale = 1;
  const length = g.fontDroid.GetStringWidthUTF8(text) * scale;
  g.fontDroid.DrawStringScaled(
    text,
    position.X - length / 2,
    position.Y,
    scale,
    scale,
    color,
    0,
    true,
  );
}

// ModCallbacks.MC_USE_ITEM (3)
// CollectibleType.COLLECTIBLE_LEMEGETON (712)
export function useItemLemegeton(): void {
  const wisp = getItemWispThatJustSpawned();
  if (wisp !== null) {
    const itemName = getItemName(wisp.SubType);
    set(itemName);
  }
}

function getItemWispThatJustSpawned() {
  const wisps = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.ITEM_WISP,
  );
  for (const wisp of wisps) {
    if (wisp.FrameCount === 0) {
      return wisp;
    }
  }

  return null;
}

// ModCallbacks.MC_USE_CARD (5)
export function useCard(card: Card): void {
  // We ignore Blank Runes because we want to show the streak text of the actual random effect
  if (card === Card.RUNE_BLANK) {
    return;
  }

  const cardConfig = g.itemConfig.GetCard(card);
  if (cardConfig === null) {
    error(`Failed to get the card config for: ${card}`);
  }
  const cardName = cardConfig.Name;
  set(cardName);
}

// ModCallbacks.MC_USE_PILL (10)
export function usePill(pillEffect: PillEffect): void {
  const pillConfig = g.itemConfig.GetPillEffect(pillEffect);
  if (pillConfig === null) {
    error(`Failed to get the pill config for effect: ${pillEffect}`);
  }
  const pillEffectName = pillConfig.Name;
  set(pillEffectName);
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const startSeed = g.seeds.GetStartSeed();
  v.run.deadSeaScrollsSeed = startSeed;
}

// ModCallbacks.MC_POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  const stage = g.l.GetStage();

  if (shouldShowLevelText()) {
    showLevelText(stage);
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

function showLevelText(stage: int) {
  // Show what the new floor is
  // (the game will not show this naturally after doing a "stage" console command)
  if (VanillaStreakText && (stage !== 1 || onRepentanceStage())) {
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

function goingToRaceRoom() {
  const stage = g.l.GetStage();

  return (
    g.race.status === RaceStatus.OPEN &&
    stage === 1 &&
    (g.run.roomsEntered === 0 || g.run.roomsEntered === 1)
  );
}

// ModCallbacks.MC_PRE_USE_ITEM (23)
// CollectibleType.COLLECTIBLE_DEAD_SEA_SCROLLS (124)
export function preUseItemDeadSeaScrolls(
  player: EntityPlayer,
  activeSlot: ActiveSlot,
): boolean | void {
  const hud = g.g.GetHUD();

  v.run.deadSeaScrollsSeed = incrementRNG(v.run.deadSeaScrollsSeed);
  const randomCollectible = getRandomArrayElement(
    DEAD_SEA_SCROLL_EFFECTS,
    v.run.deadSeaScrollsSeed,
  );
  player.UseActiveItem(randomCollectible, UseFlag.USE_OWNED, activeSlot);

  const itemName = getItemName(randomCollectible);
  if (VanillaStreakText) {
    hud.ShowItemText(itemName);
  } else {
    set(itemName);
  }

  return true;
}

// ModCallbacksCustom.MC_PRE_ITEM_PICKUP
export function preItemPickup(pickingUpItem: PickingUpItem): void {
  const trinket = pickingUpItem.type === ItemType.ITEM_TRINKET;
  const itemName = getItemName(pickingUpItem.id, trinket);

  set(itemName);
}

// ModCallbacksCustom.MC_POST_TRANSFORMATION
export function postTransformation(
  playerForm: PlayerForm,
  hasForm: boolean,
): void {
  if (!hasForm) {
    return;
  }

  const transformationName = TRANSFORMATION_NAMES[playerForm];
  set(transformationName);
}

function set(text: string) {
  v.run.text = text;
  v.run.frameSet = Isaac.GetFrameCount();
}

export function setTab(value: string | null): void {
  v.run.tabText = value;
}
