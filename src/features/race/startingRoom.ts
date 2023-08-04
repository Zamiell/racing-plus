import type { TrinketType } from "isaac-typescript-definitions";
import { game, getScreenCenterPos, newSprite } from "isaacscript-common";
import { RaceFormat } from "../../enums/RaceFormat";
import { RaceStatus } from "../../enums/RaceStatus";
import { RacerStatus } from "../../enums/RacerStatus";
import { g } from "../../globals";
import { mod } from "../../mod";
import {
  newGlowingCollectibleSpriteFromServerCollectibleID,
  newGlowingTrinketSprite,
} from "../../sprite";

const GFX_PATH = "gfx/race/starting-room";

const sprites = {
  /** The "Starting Item" or "Starting Build" yellow sprite. */
  seededStartingTitle: null as Sprite | null,

  seededItemCenter: null as Sprite | null,
  seededItemLeft: null as Sprite | null,
  seededItemRight: null as Sprite | null,
  seededItemFarLeft: null as Sprite | null,
  seededItemFarRight: null as Sprite | null,

  /** The "Active" yellow sprite. */
  diversityActive: null as Sprite | null,

  /** The "Passives" yellow sprite. */
  diversityPassives: null as Sprite | null,

  /** The "Trinket" yellow sprite. */
  diversityTrinket: null as Sprite | null,

  /** The active item. */
  diversityItem1: null as Sprite | null,

  /** The first passive item. */
  diversityItem2: null as Sprite | null,

  /** The second passive item. */
  diversityItem3: null as Sprite | null,

  /** The third passive item. */
  diversityItem4: null as Sprite | null,

  /** The trinket. */
  diversityItem5: null as Sprite | null,
};

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  drawSprites();
}

function drawSprites() {
  const hud = game.GetHUD();

  if (!hud.IsVisible()) {
    return;
  }

  // We do not have to check if the game is paused because the pause menu will be drawn on top of
  // the starting room sprites. (And we do not have to worry about the room slide animation because
  // the starting room sprites are not shown once we re-enter the room.)

  if (
    g.race.myStatus === RacerStatus.FINISHED ||
    g.race.myStatus === RacerStatus.QUIT ||
    g.race.myStatus === RacerStatus.DISQUALIFIED
  ) {
    return;
  }

  for (const [spriteName, sprite] of Object.entries(sprites)) {
    if (sprite !== null) {
      const position = getPosition(spriteName as keyof typeof sprites);
      sprite.Render(position);
    }
  }
}

function getPosition(spriteName: keyof typeof sprites): Vector {
  const screenCenterPos = getScreenCenterPos();
  const itemRow1Y = -10;

  switch (spriteName) {
    case "seededStartingTitle": {
      return screenCenterPos.add(Vector(0, -40));
    }

    case "seededItemCenter": {
      return screenCenterPos.add(Vector(0, itemRow1Y));
    }

    case "seededItemLeft": {
      return screenCenterPos.add(Vector(-15, itemRow1Y));
    }

    case "seededItemRight": {
      return screenCenterPos.add(Vector(15, itemRow1Y));
    }

    case "seededItemFarLeft": {
      return screenCenterPos.add(Vector(-45, itemRow1Y));
    }

    case "seededItemFarRight": {
      return screenCenterPos.add(Vector(45, itemRow1Y));
    }

    case "diversityActive": {
      return screenCenterPos.add(Vector(-90, -70));
    }

    case "diversityPassives": {
      return screenCenterPos.add(Vector(90, -40));
    }

    case "diversityTrinket": {
      return screenCenterPos.add(Vector(-90, 30));
    }

    case "diversityItem1": {
      return screenCenterPos.add(Vector(-90, -40));
    }

    case "diversityItem2": {
      return screenCenterPos.add(Vector(60, itemRow1Y));
    }

    case "diversityItem3": {
      return screenCenterPos.add(Vector(90, itemRow1Y));
    }

    case "diversityItem4": {
      return screenCenterPos.add(Vector(120, itemRow1Y));
    }

    case "diversityItem5": {
      return screenCenterPos.add(Vector(-90, 60));
    }
  }
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!mod.inFirstRoom()) {
    resetSprites();
  }
}

export function resetSprites(): void {
  for (const keyString of Object.keys(sprites)) {
    const key = keyString as keyof typeof sprites;
    sprites[key] = null;
  }
}

export function initSprites(): void {
  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING
  ) {
    return;
  }

  switch (g.race.format) {
    case RaceFormat.SEEDED: {
      initSeededSprites();
      break;
    }

    case RaceFormat.DIVERSITY: {
      initDiversitySprites();
      break;
    }

    case RaceFormat.UNSEEDED:
    case RaceFormat.CUSTOM: {
      break;
    }
  }
}

function initSeededSprites() {
  const { startingItems } = g.race;

  const title = startingItems.length === 1 ? "item" : "build";
  sprites.seededStartingTitle = newSprite(
    `${GFX_PATH}/seeded-starting-${title}.anm2`,
  );

  switch (startingItems.length) {
    case 1: {
      sprites.seededItemCenter =
        newGlowingCollectibleSpriteFromServerCollectibleID(startingItems[0]);

      break;
    }

    case 2: {
      sprites.seededItemLeft =
        newGlowingCollectibleSpriteFromServerCollectibleID(startingItems[0]);
      sprites.seededItemRight =
        newGlowingCollectibleSpriteFromServerCollectibleID(startingItems[1]);

      break;
    }

    case 3: {
      sprites.seededItemCenter =
        newGlowingCollectibleSpriteFromServerCollectibleID(startingItems[0]);
      sprites.seededItemFarLeft =
        newGlowingCollectibleSpriteFromServerCollectibleID(startingItems[1]);
      sprites.seededItemFarRight =
        newGlowingCollectibleSpriteFromServerCollectibleID(startingItems[2]);

      break;
    }

    case 4: {
      sprites.seededItemLeft =
        newGlowingCollectibleSpriteFromServerCollectibleID(startingItems[0]);
      sprites.seededItemRight =
        newGlowingCollectibleSpriteFromServerCollectibleID(startingItems[1]);
      sprites.seededItemFarLeft =
        newGlowingCollectibleSpriteFromServerCollectibleID(startingItems[2]);
      sprites.seededItemFarRight =
        newGlowingCollectibleSpriteFromServerCollectibleID(startingItems[3]);

      break;
    }
  }
}

function initDiversitySprites() {
  sprites.diversityActive = newSprite(`${GFX_PATH}/diversity-active.anm2`);
  sprites.diversityPassives = newSprite(`${GFX_PATH}/diversity-passives.anm2`);
  sprites.diversityTrinket = newSprite(`${GFX_PATH}/diversity-trinket.anm2`);

  if (g.race.startingItems.length !== 5) {
    error(
      `Failed to initialize the diversity race starting room sprites due to only having ${g.race.startingItems.length} starting items instead of 5.`,
    );
  }

  sprites.diversityItem1 = newGlowingCollectibleSpriteFromServerCollectibleID(
    g.race.startingItems[0],
  );
  sprites.diversityItem2 = newGlowingCollectibleSpriteFromServerCollectibleID(
    g.race.startingItems[1],
  );
  sprites.diversityItem3 = newGlowingCollectibleSpriteFromServerCollectibleID(
    g.race.startingItems[2],
  );
  sprites.diversityItem4 = newGlowingCollectibleSpriteFromServerCollectibleID(
    g.race.startingItems[3],
  );

  const trinketType = g.race.startingItems[4] as TrinketType;
  sprites.diversityItem5 = newGlowingTrinketSprite(trinketType);
}
