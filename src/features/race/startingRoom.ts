import g from "../../globals";
import { initGlowingItemSprite, initSprite } from "../../misc";

const sprites = {
  seededStartingItem: null as Sprite | null,
  seededStartingBuild: null as Sprite | null,
  seededItem1: null as Sprite | null,
  seededItem2: null as Sprite | null,
  seededItem3: null as Sprite | null,
  seededItem4: null as Sprite | null,
  seededItem5: null as Sprite | null,

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
  const centerPos = g.r.GetCenterPos();

  for (const key of Object.keys(sprites)) {
    const property = key as keyof typeof sprites;
    const sprite = sprites[property];

    if (sprite !== null) {
      const renderPosition = Isaac.WorldToRenderPosition(centerPos);
      sprite.RenderLayer(0, renderPosition);
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
    const property = key as keyof typeof sprites;
    sprites[property] = null;
  }
}

export function initSprites(): void {
  if (g.race.status !== "in progress") {
    return;
  }

  switch (g.race.format) {
    case "seeded": {
      initSeededSprites();
      break;
    }

    case "diversity": {
      initDiversitySprites();
      break;
    }

    default: {
      break;
    }
  }
}

function initSeededSprites() {
  if (g.race.startingItems.length === 1) {
    sprites.seededStartingItem = initSprite(
      "gfx/race/seeded-starting-item.anm2",
    );
    sprites.seededItem1 = initGlowingItemSprite(
      g.race.startingItems[0] as CollectibleType,
    );
  } else if (g.race.startingItems.length === 2) {
    sprites.seededStartingBuild = initSprite(
      "gfx/race/seeded-starting-build.anm2",
    );
    sprites.seededItem2 = initGlowingItemSprite(
      g.race.startingItems[0] as CollectibleType,
    );
    sprites.seededItem3 = initGlowingItemSprite(
      g.race.startingItems[1] as CollectibleType,
    );
  } else if (g.race.startingItems.length === 4) {
    // Only the Mega Blast build has 4 starting items
    sprites.seededStartingBuild = initSprite(
      "gfx/race/seeded-starting-build.anm2",
    );
    sprites.seededItem2 = initGlowingItemSprite(
      g.race.startingItems[1] as CollectibleType,
    );
    sprites.seededItem3 = initGlowingItemSprite(
      g.race.startingItems[2] as CollectibleType,
    );
    // This will be to the left of 2
    sprites.seededItem4 = initGlowingItemSprite(
      g.race.startingItems[0] as CollectibleType,
    );
    // This will be to the right of 3
    sprites.seededItem5 = initGlowingItemSprite(
      g.race.startingItems[3] as CollectibleType,
    );
  }
}

function initDiversitySprites() {
  sprites.diversityActive = initSprite("gfx/race/diversity-active.anm2");
  sprites.diversityPassives = initSprite("gfx/race/diversity-passives.anm2");
  sprites.diversityTrinket = initSprite("gfx/race/diversity-trinket.anm2");
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
  sprites.diversityItem5 = initGlowingItemSprite(
    g.race.startingItems[4] as CollectibleType,
  );
}
