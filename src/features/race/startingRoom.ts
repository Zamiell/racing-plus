import { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import { isGoldenTrinket } from "isaacscript-common";
import { RaceFormat } from "../../enums/RaceFormat";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";
import { initGlowingItemSprite, initSprite } from "../../sprite";
import { getRoomsEntered } from "../utils/roomsEntered";

const GFX_PATH = "gfx/race/starting-room";

const sprites = {
  /** "Starting Item" or "Starting Build". */
  seededStartingTitle: null as Sprite | null,
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

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  drawSprites();
}

function drawSprites() {
  const hud = g.g.GetHUD();

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
      sprite.RenderLayer(0, position);
    }
  }
}

function getPosition(spriteName: keyof typeof sprites): Vector {
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
      // The active item.
      return Vector(renderPosition.X - 90, renderPosition.Y - 40);
    }

    case "diversityItem2": {
      // The 1st passive item.
      return Vector(renderPosition.X + 60, itemRow1Y);
    }

    case "diversityItem3": {
      // The 2nd passive item.
      return Vector(renderPosition.X + 90, itemRow1Y);
    }

    case "diversityItem4": {
      // The 3rd passive item.
      return Vector(renderPosition.X + 120, itemRow1Y);
    }

    case "diversityItem5": {
      // The trinket.
      return Vector(renderPosition.X - 90, renderPosition.Y + 60);
    }

    default: {
      return error(
        `Starting room sprites named "${spriteName}" are unsupported.`,
      );
    }
  }
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  const roomsEntered = getRoomsEntered();

  if (roomsEntered > 1) {
    resetSprites();
  }
}

export function resetSprites(): void {
  for (const key of Object.keys(sprites)) {
    // @ts-expect-error The key will always be valid here.
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
  if (isGoldenTrinket(trinketType)) {
    // A golden trinket, which should not have its ID modified.
    sprites.diversityItem5 = initGlowingItemSprite(trinketType);
  } else {
    // A normal trinket.
    sprites.diversityItem5 = initGlowingItemSprite(trinketType, true);
  }
}
