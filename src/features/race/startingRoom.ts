import { ensureAllCases } from "isaacscript-common";
import g from "../../globals";
import { initGlowingItemSprite, initSprite } from "../../sprite";
import { getRoomsEntered } from "../util/roomsEntered";
import { RaceFormat } from "./types/RaceFormat";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";

const FIRST_GOLDEN_TRINKET_ID = 32769;
const GFX_PATH = "gfx/race/starting-room";

const sprites: Record<string, Sprite | null> = {
  seededStartingTitle: null, // "Starting Item" or "Starting Build"
  seededItemCenter: null,
  seededItemLeft: null,
  seededItemRight: null,
  seededItemFarLeft: null,
  seededItemFarRight: null,

  diversityActive: null,
  diversityPassives: null,
  diversityTrinket: null,
  diversityItem1: null,
  diversityItem2: null,
  diversityItem3: null,
  diversityItem4: null,
  diversityItem5: null,
};

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  drawSprites();
}

function drawSprites() {
  if (ModConfigMenu !== undefined && ModConfigMenu.IsVisible) {
    return;
  }

  if (
    g.race.myStatus === RacerStatus.FINISHED ||
    g.race.myStatus === RacerStatus.QUIT ||
    g.race.myStatus === RacerStatus.DISQUALIFIED
  ) {
    return;
  }

  for (const [spriteName, sprite] of Object.entries(sprites)) {
    if (sprite !== null) {
      const position = getPosition(spriteName);
      sprite.RenderLayer(0, position);
    }
  }
}

function getPosition(spriteName: keyof typeof sprites) {
  const centerPos = g.r.GetCenterPos();
  const renderPosition = Isaac.WorldToRenderPosition(centerPos);
  const itemRow1Y = renderPosition.Y - 10;

  switch (spriteName) {
    case "seededStartingTitle": {
      return Vector(renderPosition.X, renderPosition.Y - 40);
    }

    case "seededItemCenter": {
      return Vector(renderPosition.X, itemRow1Y);
    }

    case "seededItemLeft": {
      return Vector(renderPosition.X - 15, itemRow1Y);
    }

    case "seededItemRight": {
      return Vector(renderPosition.X + 15, itemRow1Y);
    }

    case "seededItemFarLeft": {
      return Vector(renderPosition.X - 45, itemRow1Y);
    }

    case "seededItemFarRight": {
      return Vector(renderPosition.X + 45, itemRow1Y);
    }

    case "diversityActive": {
      return Vector(renderPosition.X - 90, renderPosition.Y - 70);
    }

    case "diversityPassives": {
      return Vector(renderPosition.X + 90, renderPosition.Y - 40);
    }

    case "diversityTrinket": {
      return Vector(renderPosition.X - 90, renderPosition.Y + 30);
    }

    case "diversityItem1": {
      // The active item
      return Vector(renderPosition.X - 90, renderPosition.Y - 40);
    }

    case "diversityItem2": {
      // The 1st passive item
      return Vector(renderPosition.X + 60, itemRow1Y);
    }

    case "diversityItem3": {
      // The 2nd passive item
      return Vector(renderPosition.X + 90, itemRow1Y);
    }

    case "diversityItem4": {
      // The 3rd passive item
      return Vector(renderPosition.X + 120, itemRow1Y);
    }

    case "diversityItem5": {
      // The trinket
      return Vector(renderPosition.X - 90, renderPosition.Y + 60);
    }

    default: {
      return error(
        `Starting room sprites named "${spriteName}" are unsupported.`,
      );
    }
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  const roomsEntered = getRoomsEntered();

  if (roomsEntered > 1) {
    resetSprites();
  }
}

export function resetSprites(): void {
  for (const key of Object.keys(sprites)) {
    const property = key;
    sprites[property] = null;
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

    default: {
      ensureAllCases(g.race.format);
      break;
    }
  }
}

function initSeededSprites() {
  const { startingItems } = g.race;

  const title = startingItems.length === 1 ? "item" : "build";
  sprites.seededStartingTitle = initSprite(
    `${GFX_PATH}/seeded-starting-${title}.anm2`,
  );

  if (startingItems.length === 1) {
    sprites.seededItemCenter = initGlowingItemSprite(
      startingItems[0] as CollectibleType,
    );
  } else if (startingItems.length === 2) {
    sprites.seededItemLeft = initGlowingItemSprite(
      startingItems[0] as CollectibleType,
    );
    sprites.seededItemRight = initGlowingItemSprite(
      startingItems[1] as CollectibleType,
    );
  } else if (startingItems.length === 3) {
    sprites.seededItemCenter = initGlowingItemSprite(
      startingItems[0] as CollectibleType,
    );
    sprites.seededItemFarLeft = initGlowingItemSprite(
      startingItems[1] as CollectibleType,
    );
    sprites.seededItemFarRight = initGlowingItemSprite(
      startingItems[2] as CollectibleType,
    );
  } else if (startingItems.length === 4) {
    sprites.seededItemLeft = initGlowingItemSprite(
      startingItems[1] as CollectibleType,
    );
    sprites.seededItemRight = initGlowingItemSprite(
      startingItems[2] as CollectibleType,
    );
    sprites.seededItemFarLeft = initGlowingItemSprite(
      startingItems[0] as CollectibleType,
    );
    sprites.seededItemFarRight = initGlowingItemSprite(
      startingItems[3] as CollectibleType,
    );
  }
}

function initDiversitySprites() {
  sprites.diversityActive = initSprite(`${GFX_PATH}/diversity-active.anm2`);
  sprites.diversityPassives = initSprite(`${GFX_PATH}/diversity-passives.anm2`);
  sprites.diversityTrinket = initSprite(`${GFX_PATH}/diversity-trinket.anm2`);

  const activeCollectibleType = g.race.startingItems[0] as CollectibleType;
  sprites.diversityItem1 = initGlowingItemSprite(activeCollectibleType);

  const passive1CollectibleType = g.race.startingItems[1] as CollectibleType;
  sprites.diversityItem2 = initGlowingItemSprite(passive1CollectibleType);

  const passive2CollectibleType = g.race.startingItems[2] as CollectibleType;
  sprites.diversityItem3 = initGlowingItemSprite(passive2CollectibleType);

  const passive3CollectibleType = g.race.startingItems[3] as CollectibleType;
  sprites.diversityItem4 = initGlowingItemSprite(passive3CollectibleType);

  const trinketType = g.race.startingItems[4] as TrinketType;
  if (trinketType < FIRST_GOLDEN_TRINKET_ID) {
    // A normal trinket
    sprites.diversityItem5 = initGlowingItemSprite(trinketType, true);
  } else {
    // A golden trinket, which should not have its ID modified
    sprites.diversityItem5 = initGlowingItemSprite(trinketType);
  }
}
