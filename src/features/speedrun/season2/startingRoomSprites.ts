import { CollectibleType } from "isaac-typescript-definitions";
import { fonts, getPlayerName, KColorDefault } from "isaacscript-common";
import { g } from "../../../globals";
import { newGlowingCollectibleSprite, newSprite } from "../../../sprite";
import { getNumRoomsEntered } from "../../utils/numRoomsEntered";

const GFX_PATH = "gfx/race/starting-room";

const TOP_LEFT_GRID_INDEX = 32;
const TOP_RIGHT_GRID_INDEX = 42;
const SPRITE_TITLE_OFFSET = Vector(0, -30);
const SPRITE_ITEM_OFFSET = 15;

const sprites = {
  /** The "Character" yellow sprite. */
  characterTitle: null as Sprite | null,

  /** The "Starting Item" or "Starting Build" yellow sprite. */
  seededStartingTitle: null as Sprite | null,

  seededItemCenter: null as Sprite | null,
  seededItemLeft: null as Sprite | null,
  seededItemRight: null as Sprite | null,
  seededItemFarLeft: null as Sprite | null,
  seededItemFarRight: null as Sprite | null,
};

export function resetSeason2StartingRoomSprites(): void {
  for (const keyString of Object.keys(sprites)) {
    const key = keyString as keyof typeof sprites;
    sprites[key] = null;
  }
}

export function initSeason2StartingRoomSprites(
  startingBuild: readonly CollectibleType[],
): void {
  resetSeason2StartingRoomSprites();

  sprites.characterTitle = newSprite(`${GFX_PATH}/character.anm2`);

  const title = startingBuild.length === 1 ? "item" : "build";
  sprites.seededStartingTitle = newSprite(
    `${GFX_PATH}/seeded-starting-${title}.anm2`,
  );

  if (startingBuild.length === 1) {
    sprites.seededItemCenter = newGlowingCollectibleSprite(
      startingBuild[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
  } else if (startingBuild.length === 2) {
    sprites.seededItemLeft = newGlowingCollectibleSprite(
      startingBuild[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemRight = newGlowingCollectibleSprite(
      startingBuild[1]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
  } else if (startingBuild.length === 3) {
    sprites.seededItemCenter = newGlowingCollectibleSprite(
      startingBuild[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemFarLeft = newGlowingCollectibleSprite(
      startingBuild[1]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemFarRight = newGlowingCollectibleSprite(
      startingBuild[2]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
  } else if (startingBuild.length === 4) {
    sprites.seededItemLeft = newGlowingCollectibleSprite(
      startingBuild[1]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemRight = newGlowingCollectibleSprite(
      startingBuild[2]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemFarLeft = newGlowingCollectibleSprite(
      startingBuild[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemFarRight = newGlowingCollectibleSprite(
      startingBuild[3]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
  }
}

export function drawSeason2StartingRoomSprites(): void {
  for (const [spriteName, sprite] of Object.entries(sprites)) {
    if (sprite !== null) {
      const position = getPosition(spriteName as keyof typeof sprites);
      sprite.RenderLayer(0, position);
    }
  }
}

function getPosition(spriteName: keyof typeof sprites): Vector {
  const topLeftPositionGame = g.r.GetGridPosition(TOP_LEFT_GRID_INDEX);
  const topLeftPosition = Isaac.WorldToRenderPosition(topLeftPositionGame);
  const topRightPositionGame = g.r.GetGridPosition(TOP_RIGHT_GRID_INDEX);
  const topRightPosition = Isaac.WorldToRenderPosition(topRightPositionGame);

  switch (spriteName) {
    case "characterTitle": {
      return topLeftPosition.add(SPRITE_TITLE_OFFSET);
    }

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

export function drawSeason2StartingRoomText(): void {
  const numRoomsEntered = getNumRoomsEntered();

  if (numRoomsEntered !== 1) {
    return;
  }

  const player = Isaac.GetPlayer();
  const characterName = getPlayerName(player);

  const positionGame = g.r.GetGridPosition(TOP_LEFT_GRID_INDEX);
  let position = Isaac.WorldToRenderPosition(positionGame);
  position = position.add(Vector(0, -11));

  const font = fonts.droid;
  const length = font.GetStringWidthUTF8(characterName);

  font.DrawString(
    characterName,
    position.X - length / 2,
    position.Y,
    KColorDefault,
  );
}
