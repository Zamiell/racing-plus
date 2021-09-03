import { ensureAllCases } from "isaacscript-common";
import g from "../../globals";
import { initGlowingItemSprite, initSprite } from "../../util";
import RaceFormat from "./types/RaceFormat";
import RacerStatus from "./types/RacerStatus";
import RaceStatus from "./types/RaceStatus";

const FIRST_GOLDEN_TRINKET_ID = 32769;
const GFX_PATH = "gfx/race/starting-room";

const sprites: Record<string, Sprite | null> = {
  seededStartingTitle: null as Sprite | null, // "Item" or "Build"
  seededItemCenter: null as Sprite | null,
  seededItemLeft: null as Sprite | null,
  seededItemRight: null as Sprite | null,
  seededItemFarLeft: null as Sprite | null,
  seededItemFarRight: null as Sprite | null,

  diversityActive: null as Sprite | null,
  diversityPassives: null as Sprite | null,
  diversityTrinket: null as Sprite | null,
  diversityItem1: null as Sprite | null,
  diversityItem2: null as Sprite | null,
  diversityItem3: null as Sprite | null,
  diversityItem4: null as Sprite | null,
  diversityItem5: null as Sprite | null,
};

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  drawSprites();
}

function drawSprites() {
  if (
    g.race.myStatus === RacerStatus.FINISHED ||
    g.race.myStatus === RacerStatus.QUIT ||
    g.race.myStatus === RacerStatus.DISQUALIFIED
  ) {
    return;
  }

  for (const [key, sprite] of Object.entries(sprites)) {
    if (sprite !== null) {
      const spriteName = key;
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
      error(`Starting room sprites named "${spriteName}" are unsupported.`);
      return Vector.Zero;
    }
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (g.run.roomsEntered > 1) {
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
  const title = g.race.startingItems.length === 1 ? "item" : "build";
  sprites.seededStartingTitle = initSprite(
    `${GFX_PATH}/seeded-starting-${title}.anm2`,
  );

  if (g.race.startingItems.length === 1) {
    sprites.seededItemCenter = initGlowingItemSprite(
      g.race.startingItems[0] as CollectibleType,
    );
  } else if (g.race.startingItems.length === 2) {
    sprites.seededItemLeft = initGlowingItemSprite(
      g.race.startingItems[0] as CollectibleType,
    );
    sprites.seededItemRight = initGlowingItemSprite(
      g.race.startingItems[1] as CollectibleType,
    );
  } else if (g.race.startingItems.length === 3) {
    sprites.seededItemCenter = initGlowingItemSprite(
      g.race.startingItems[0] as CollectibleType,
    );
    sprites.seededItemFarLeft = initGlowingItemSprite(
      g.race.startingItems[1] as CollectibleType,
    );
    sprites.seededItemFarRight = initGlowingItemSprite(
      g.race.startingItems[2] as CollectibleType,
    );
  } else if (g.race.startingItems.length === 4) {
    sprites.seededItemLeft = initGlowingItemSprite(
      g.race.startingItems[1] as CollectibleType,
    );
    sprites.seededItemRight = initGlowingItemSprite(
      g.race.startingItems[2] as CollectibleType,
    );
    sprites.seededItemFarLeft = initGlowingItemSprite(
      g.race.startingItems[0] as CollectibleType,
    );
    sprites.seededItemFarRight = initGlowingItemSprite(
      g.race.startingItems[3] as CollectibleType,
    );
  }
}

function initDiversitySprites() {
  sprites.diversityActive = initSprite(`${GFX_PATH}/diversity-active.anm2`);
  sprites.diversityPassives = initSprite(`${GFX_PATH}/diversity-passives.anm2`);
  sprites.diversityTrinket = initSprite(`${GFX_PATH}/diversity-trinket.anm2`);

  sprites.diversityItem1 = initGlowingItemSprite(
    g.race.startingItems[0] as CollectibleType,
  );
  sprites.diversityItem2 = initGlowingItemSprite(
    g.race.startingItems[1] as CollectibleType,
  );
  sprites.diversityItem3 = initGlowingItemSprite(
    g.race.startingItems[2] as CollectibleType,
  );
  sprites.diversityItem4 = initGlowingItemSprite(
    g.race.startingItems[3] as CollectibleType,
  );

  let modifiedTrinketID = tonumber(g.race.startingItems[4]);
  if (modifiedTrinketID === undefined) {
    error(
      `Failed to convert the diversity trinket to a number: ${g.race.startingItems[4]}`,
    );
  }
  if (modifiedTrinketID < FIRST_GOLDEN_TRINKET_ID) {
    // Trinkets are represented in the "items.json" file as items with IDs past 2000
    // (but golden trinkets retain their vanilla ID)
    modifiedTrinketID += 2000;
  }
  sprites.diversityItem5 = initGlowingItemSprite(modifiedTrinketID);
}
