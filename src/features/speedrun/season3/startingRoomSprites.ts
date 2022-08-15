import { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import { initSprite } from "../../../sprite";

const GFX_PATH = "gfx/race/starting-room";

const sprites = {
  characterTitle: null as Sprite | null,

  /** "Starting Item" or "Starting Build". */
  seededStartingTitle: null as Sprite | null,

  seededItemCenter: null as Sprite | null,
  seededItemLeft: null as Sprite | null,
  seededItemRight: null as Sprite | null,
  seededItemFarLeft: null as Sprite | null,
  seededItemFarRight: null as Sprite | null,
};

export function resetSeason3StartingRoomSprites(): void {
  for (const keyString of Object.keys(sprites)) {
    const key = keyString as keyof typeof sprites;
    sprites[key] = null;
  }
}

export function initSeason3StartingRoomSprites(
  _collectibleTypes: CollectibleType[],
  _trinketType: TrinketType,
): void {
  resetSeason3StartingRoomSprites();

  sprites.characterTitle = initSprite(`${GFX_PATH}/character.anm2`);

  /*
  const title = startingBuild.length === 1 ? "item" : "build";
  sprites.seededStartingTitle = initSprite(
    `${GFX_PATH}/seeded-starting-${title}.anm2`,
  );

  if (startingBuild.length === 1) {
    sprites.seededItemCenter = initGlowingCollectibleSprite(
      startingBuild[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
  } else if (startingBuild.length === 2) {
    sprites.seededItemLeft = initGlowingCollectibleSprite(
      startingBuild[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemRight = initGlowingCollectibleSprite(
      startingBuild[1]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
  } else if (startingBuild.length === 3) {
    sprites.seededItemCenter = initGlowingCollectibleSprite(
      startingBuild[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemFarLeft = initGlowingCollectibleSprite(
      startingBuild[1]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemFarRight = initGlowingCollectibleSprite(
      startingBuild[2]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
  } else if (startingBuild.length === 4) {
    sprites.seededItemLeft = initGlowingCollectibleSprite(
      startingBuild[1]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemRight = initGlowingCollectibleSprite(
      startingBuild[2]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemFarLeft = initGlowingCollectibleSprite(
      startingBuild[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemFarRight = initGlowingCollectibleSprite(
      startingBuild[3]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
  }
  */
}
