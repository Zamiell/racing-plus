import { CollectibleType } from "isaac-typescript-definitions";
import { fonts, getPlayerName, KColorDefault } from "isaacscript-common";
import { g } from "../../../../globals";
import { mod } from "../../../../mod";
import { newGlowingCollectibleSprite, newSprite } from "../../../../sprite";

const GFX_PATH = "gfx/race/starting-room";

const TOP_LEFT_GRID_INDEX = 32;
const TOP_RIGHT_GRID_INDEX = 42;
const SPRITE_TITLE_OFFSET = Vector(0, -30);
const SPRITE_ITEM_OFFSET = 15;

const SEASON_2_CHARACTER_NAME_OFFSET = Vector(0, -11);

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

export function season2ResetStartingRoomSprites(): void {
  for (const keyString of Object.keys(sprites)) {
    const key = keyString as keyof typeof sprites;
    sprites[key] = null;
  }
}

export function season2InitStartingRoomSprites(
  startingBuild: readonly CollectibleType[],
): void {
  season2ResetStartingRoomSprites();

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

export function season2DrawStartingRoomSprites(): void {
  for (const [spriteName, sprite] of Object.entries(sprites)) {
    if (sprite !== null) {
      const position = getPosition(spriteName as keyof typeof sprites);
      sprite.Render(position);
    }
  }
}

function getPosition(spriteName: keyof typeof sprites): Vector {
  const topLeftPositionGame = g.r.GetGridPosition(TOP_LEFT_GRID_INDEX);
  const topLeftPosition = Isaac.WorldToScreen(topLeftPositionGame);
  const topRightPositionGame = g.r.GetGridPosition(TOP_RIGHT_GRID_INDEX);
  const topRightPosition = Isaac.WorldToScreen(topRightPositionGame);

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

export function season2DrawStartingRoomText(): void {
  if (!mod.inFirstRoom()) {
    return;
  }

  const player = Isaac.GetPlayer();
  const characterName = getPlayerName(player);

  const positionGame = g.r.GetGridPosition(TOP_LEFT_GRID_INDEX);
  const positionWithoutOffset = Isaac.WorldToScreen(positionGame);
  const position = positionWithoutOffset.add(SEASON_2_CHARACTER_NAME_OFFSET);

  const font = fonts.droid;
  const length = font.GetStringWidthUTF8(characterName);

  font.DrawString(
    characterName,
    position.X - length / 2,
    position.Y,
    KColorDefault,
  );
}