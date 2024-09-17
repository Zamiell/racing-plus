import type { CollectibleType } from "isaac-typescript-definitions";
import { game, newSprite } from "isaacscript-common";
import { getStartingBuildSprite } from "../season2/startingRoomSprites";

const GFX_PATH = "gfx/race/starting-room";

const BOTTOM_RIGHT_GRID_INDEX = 102;
const SPRITE_TITLE_OFFSET = Vector(0, -30);
const SPRITE_ITEM_OFFSET = 15;

const sprites = {
  /** The "Starting Item" or "Starting Build" yellow sprite. */
  seededStartingTitle: null as Sprite | null,

  seededItemCenter: null as Sprite | null,
  seededItemLeft: null as Sprite | null,
  seededItemRight: null as Sprite | null,
  seededItemFarLeft: null as Sprite | null,
  seededItemFarRight: null as Sprite | null,
};

export function season5ResetStartingRoomSprites(): void {
  for (const keyString of Object.keys(sprites)) {
    const key = keyString as keyof typeof sprites;
    sprites[key] = null;
  }
}

export function season5InitStartingRoomSprites(
  startingBuild: readonly CollectibleType[],
): void {
  season5ResetStartingRoomSprites();

  const title = startingBuild.length === 1 ? "item" : "build";
  sprites.seededStartingTitle = newSprite(
    `${GFX_PATH}/seeded-starting-${title}.anm2`,
  );

  switch (startingBuild.length) {
    case 1: {
      sprites.seededItemCenter = getStartingBuildSprite(startingBuild, 0);
      break;
    }

    case 2: {
      sprites.seededItemLeft = getStartingBuildSprite(startingBuild, 0);
      sprites.seededItemRight = getStartingBuildSprite(startingBuild, 1);
      break;
    }

    case 3: {
      sprites.seededItemCenter = getStartingBuildSprite(startingBuild, 0);
      sprites.seededItemFarLeft = getStartingBuildSprite(startingBuild, 1);
      sprites.seededItemFarRight = getStartingBuildSprite(startingBuild, 2);
      break;
    }

    case 4: {
      sprites.seededItemFarLeft = getStartingBuildSprite(startingBuild, 0);
      sprites.seededItemLeft = getStartingBuildSprite(startingBuild, 1);
      sprites.seededItemRight = getStartingBuildSprite(startingBuild, 2);
      sprites.seededItemFarRight = getStartingBuildSprite(startingBuild, 3);
      break;
    }

    default: {
      // eslint-disable-next-line complete/strict-void-functions
      return error(`Unknown build length: ${startingBuild.length}`);
    }
  }
}

export function season5DrawStartingRoomSprites(): void {
  for (const [spriteName, sprite] of Object.entries(sprites)) {
    if (sprite !== null) {
      const position = getPosition(spriteName as keyof typeof sprites);
      sprite.Render(position);
    }
  }
}

function getPosition(spriteName: keyof typeof sprites): Readonly<Vector> {
  const room = game.GetRoom();

  const topRightPositionGame = room.GetGridPosition(BOTTOM_RIGHT_GRID_INDEX);
  const topRightPosition = Isaac.WorldToScreen(topRightPositionGame);

  switch (spriteName) {
    case "seededStartingTitle": {
      return topRightPosition.add(SPRITE_TITLE_OFFSET);
    }

    case "seededItemCenter": {
      return topRightPosition;
    }

    case "seededItemLeft": {
      return topRightPosition.add(Vector(SPRITE_ITEM_OFFSET * -1, 0));
    }

    case "seededItemRight": {
      return topRightPosition.add(Vector(SPRITE_ITEM_OFFSET, 0));
    }

    case "seededItemFarLeft": {
      return topRightPosition.add(Vector(SPRITE_ITEM_OFFSET * -3, 0));
    }

    case "seededItemFarRight": {
      return topRightPosition.add(Vector(SPRITE_ITEM_OFFSET * 3, 0));
    }
  }
}
