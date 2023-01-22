import { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import {
  fonts,
  getPlayerName,
  getScreenCenterPos,
  KColorDefault,
} from "isaacscript-common";
import {
  newGlowingCollectibleSprite,
  newGlowingTrinketSprite,
  newSprite,
} from "../../../sprite";
import { getNumRoomsEntered } from "../../utils/numRoomsEntered";

const GFX_PATH = "gfx/race/starting-room";

const sprites = {
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

  /** The "Character" yellow sprite. */
  characterTitle: null as Sprite | null,
};

export function resetSeason3StartingRoomSprites(): void {
  for (const keyString of Object.keys(sprites)) {
    const key = keyString as keyof typeof sprites;
    sprites[key] = null;
  }
}

export function initSeason3StartingRoomSprites(
  collectibleTypes: CollectibleType[],
  trinketType: TrinketType,
): void {
  resetSeason3StartingRoomSprites();

  sprites.diversityActive = newSprite(`${GFX_PATH}/diversity-active.anm2`);
  sprites.diversityPassives = newSprite(`${GFX_PATH}/diversity-passives.anm2`);
  sprites.diversityTrinket = newSprite(`${GFX_PATH}/diversity-trinket.anm2`);

  if (collectibleTypes.length !== 4) {
    error(
      `Failed to initialize the season 3 starting room sprites due to only having ${collectibleTypes.length} collectible types instead of 4.`,
    );
  }

  sprites.diversityItem1 = newGlowingCollectibleSprite(
    collectibleTypes[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
  );
  sprites.diversityItem2 = newGlowingCollectibleSprite(
    collectibleTypes[1]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
  );
  sprites.diversityItem3 = newGlowingCollectibleSprite(
    collectibleTypes[2]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
  );
  sprites.diversityItem4 = newGlowingCollectibleSprite(
    collectibleTypes[3]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
  );

  sprites.diversityItem5 = newGlowingTrinketSprite(trinketType);

  sprites.characterTitle = newSprite(`${GFX_PATH}/character.anm2`);
}

export function drawSeason3StartingRoomSprites(): void {
  for (const [spriteName, sprite] of Object.entries(sprites)) {
    if (sprite !== null) {
      const position = getPosition(spriteName as keyof typeof sprites);
      sprite.RenderLayer(0, position);
    }
  }
}

function getPosition(spriteName: keyof typeof sprites): Vector {
  const screenCenterPos = getScreenCenterPos();

  switch (spriteName) {
    case "diversityActive": {
      return screenCenterPos.add(Vector(-90, -70));
    }

    case "diversityPassives": {
      return screenCenterPos.add(Vector(90, -70));
    }

    case "diversityTrinket": {
      return screenCenterPos.add(Vector(-90, 30));
    }

    case "diversityItem1": {
      return screenCenterPos.add(Vector(-90, -40));
    }

    case "diversityItem2": {
      return screenCenterPos.add(Vector(60, -40));
    }

    case "diversityItem3": {
      return screenCenterPos.add(Vector(90, -40));
    }

    case "diversityItem4": {
      return screenCenterPos.add(Vector(120, -40));
    }

    case "diversityItem5": {
      return screenCenterPos.add(Vector(-90, 60));
    }

    case "characterTitle": {
      return screenCenterPos.add(Vector(90, 30));
    }
  }
}

export function drawSeason3StartingRoomText(): void {
  const numRoomsEntered = getNumRoomsEntered();

  if (numRoomsEntered !== 1) {
    return;
  }

  const player = Isaac.GetPlayer();
  const characterName = getPlayerName(player);

  const screenCenterPos = getScreenCenterPos();

  // Matches the offset from the `getPosition` function.
  const position = Vector(screenCenterPos.X + 90, screenCenterPos.Y + 50);

  const font = fonts.droid;
  const length = font.GetStringWidthUTF8(characterName);

  font.DrawString(
    characterName,
    position.X - length / 2,
    position.Y,
    KColorDefault,
  );
}
