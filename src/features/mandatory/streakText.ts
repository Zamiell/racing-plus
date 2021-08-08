// We replace the vanilla streak text because it blocks the map occasionally

import {
  anyPlayerIs,
  getItemName,
  gridToPos,
  isRepentanceStage,
  PickingUpItem,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";

const FRAMES_BEFORE_FADE = 50;

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
    text: null as string | null,

    /** Text of less importance that is only shown if there is no main text. */
    tabText: null as string | null,

    frameSet: null as number | null,
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

  if (v.run.frameSet === null) {
    // Only draw the tab text if there is no normal streak text showing
    if (v.run.tabText !== null) {
      draw(v.run.tabText, 1);
    }

    return;
  }

  // The streak text will slowly fade out
  const elapsedFrames = Isaac.GetFrameCount() - v.run.frameSet;
  let fade: float;
  if (elapsedFrames <= FRAMES_BEFORE_FADE) {
    fade = 1;
  } else {
    const fadeFrames = elapsedFrames - FRAMES_BEFORE_FADE;
    fade = 1 - 0.02 * fadeFrames;
  }
  if (fade <= 0) {
    v.run.frameSet = null;
    return;
  }

  if (v.run.text !== null) {
    draw(v.run.text, fade);
  }
}

function draw(text: string, fade: float) {
  const positionGame = gridToPos(6, 0); // Below the top door
  const position = Isaac.WorldToRenderPosition(positionGame);
  const color = KColor(1, 1, 1, fade);
  const scale = 1;
  const length = g.font.GetStringWidthUTF8(text) * scale;
  g.font.DrawStringScaled(
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

// ModCallbacks.MC_USE_CARD (5)
export function useCard(_player: EntityPlayer, card: Card): void {
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
export function usePill(_player: EntityPlayer, pillEffect: PillEffect): void {
  const pillConfig = g.itemConfig.GetPillEffect(pillEffect);
  if (pillConfig === null) {
    error(`Failed to get the pill config for effect: ${pillEffect}`);
  }
  const pillEffectName = pillConfig.Name;
  set(pillEffectName);
}

// ModCallbacks.MC_POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  const stage = g.l.GetStage();

  if (shouldShowLevelText()) {
    showLevelText(stage);
  }
}

function shouldShowLevelText() {
  const randomBaby = Isaac.GetPlayerTypeByName("Random Baby");

  return (
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
  if (VanillaStreakText && (stage !== 1 || isRepentanceStage())) {
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
    g.race.status === "open" &&
    stage === 1 &&
    (g.run.roomsEntered === 0 || g.run.roomsEntered === 1)
  );
}

// ModCallbacksCustom.MC_PRE_ITEM_PICKUP
export function preItemPickup(pickingUpItem: PickingUpItem): void {
  const trinket = pickingUpItem.type === ItemType.ITEM_TRINKET;
  const itemName = getItemName(pickingUpItem.id, trinket);

  set(itemName);
}

// ModCallbacksCustom.MC_POST_TRANSFORMATION
export function postTransformation(
  _player: EntityPlayer,
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

export function setTab(text: string | null): void {
  v.run.tabText = text;
  if (text === null) {
    v.run.frameSet = null;
  } else {
    v.run.frameSet = Isaac.GetFrameCount();
  }
}
