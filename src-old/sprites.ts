/*
// Variables
export const sprites = new Map<string, SpriteDescription>();

// This is called once to load the PNG from the anm2 file
export function init(spriteType: string, spriteName: string): void {
  // If this is a new sprite type, initialize it in the sprite map
  let spriteDescription = sprites.get(spriteType);
  if (spriteDescription === undefined) {
    spriteDescription = {
      sprite: null,
      spriteName: "",
    };
    sprites.set(spriteType, spriteDescription);
  }

  // Do nothing if this sprite type is already set to this name
  if (spriteDescription.spriteName === spriteName) {
    return;
  }

  // Check to see if we are clearing this sprite
  if (spriteName === "") {
    spriteDescription.sprite = null;
    spriteDescription.spriteName = "";
    return;
  }

  // Otherwise, initialize the sprite
  spriteDescription.spriteName = spriteName;
  spriteDescription.sprite = Sprite();

  // Scale some specific sprites
  if (spriteType === "dps-button") {
    spriteDescription.sprite.Scale = Vector(0.75, 0.75);
  }

  const fileName = getFileName(spriteType, spriteName);
  spriteDescription.sprite.Load(fileName, true);

  // Everything is a non-animation, so we just want to set frame 0
  let animationName = "Default";
  if (spriteType === "dps-button") {
    animationName = "Idle";
  }
  spriteDescription.sprite.SetFrame(animationName, 0);
}

function getFileName(spriteType: string, spriteName: string) {
  switch (spriteType) {
    case "seeded-item1":
    case "seeded-item2":
    case "seeded-item3":
    case "seeded-item4":
    case "seeded-item5":
    case "diversity-item1":
    case "diversity-item2":
    case "diversity-item3":
    case "diversity-item4":
    case "eden-item1":
    case "eden-item2": {
      return `gfx/items2/collectibles/${spriteName}.anm2`;
    }

    case "diversity-item5": {
      return `gfx/items2/trinkets/${spriteName}.anm2`;
    }

    case "ready":
    case "readyTotal": {
      const spriteNameNum = tonumber(spriteName);
      if (spriteNameNum !== undefined && spriteNameNum > 50) {
        return "gfx/race/ready/unknown.anm2";
      }
      return `gfx/race/ready/${spriteName}.anm2`;
    }

    case "place": {
      // On the middle-left-hand side of the screen
      return `gfx/race/place/${spriteName}.anm2`;
    }

    case "place2": {
      // Displayed when the race is finished
      return `gfx/race/place2/${spriteName}.anm2`;
    }

    case "corrupt1":
    case "corrupt2": {
      return `gfx/misc/${spriteName}.anm2`;
    }

    case "black": {
      return "gfx/black.anm2";
    }

    case "dps-button": {
      return "gfx/potato/PotatoDummy.anm2";
    }

    case "victory-lap-button": {
      return `gfx/items2/collectibles/${CollectibleType.COLLECTIBLE_FORGET_ME_NOW}.anm2`;
    }

    default: {
      return `gfx/race/${spriteName}.anm2`;
    }
  }
}

// This is called on every frame in PostRender
export function display(): void {
  // Loop through all the sprites and render them
  for (const [spriteType, spriteDescription] of sprites) {
    const pos = getPosition(spriteType);

    // Draw it
    if (spriteDescription.sprite !== null) {
      // For non-animations, we want to just render frame 0
      spriteDescription.sprite.RenderLayer(0, pos);
    }
  }
}

function getPosition(spriteType: string) {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const challenge = Isaac.GetChallenge();
  const typeFormatX = 110;
  const typeFormatY = 10;

  // Start in the center of the screen by default
  const pos = misc.getScreenCenterPosition();

  switch (spriteType) {
    case "top": {
      // Pre-race messages and the countdown
      return Vector(pos.X, pos.Y - 80);
    }

    case "myStatus": {
      return Vector(pos.X, pos.Y - 40);
    }

    case "raceRanked": {
      return Vector(pos.X - typeFormatX, pos.Y + typeFormatY);
    }

    case "raceRankedIcon": {
      return Vector(pos.X - typeFormatX, pos.Y + typeFormatY + 23);
    }

    case "raceFormat": {
      return Vector(pos.X + typeFormatX, pos.Y + typeFormatY);
    }

    case "raceFormatIcon": {
      return Vector(pos.X + typeFormatX, pos.Y + typeFormatY + 23);
    }

    case "ready": {
      return Vector(pos.X - 20, pos.Y - 15);
    }

    case "slash": {
      return Vector(pos.X, pos.Y - 15);
    }

    case "readyTotal": {
      return Vector(pos.X + 20, pos.Y - 15);
    }

    case "goal": {
      return Vector(pos.X - 25, pos.Y + 95);
    }

    case "raceGoal": {
      return Vector(pos.X + 25, pos.Y + 95);
    }

    case "seeded-starting-item":
    case "seeded-starting-build": {
      return Vector(pos.X, pos.Y - 40);
    }

    case "seeded-item1": {
      return Vector(pos.X, pos.Y - 10);
    }

    case "seeded-item2": {
      return Vector(pos.X - 15, pos.Y - 10);
    }

    case "seeded-item3": {
      return Vector(pos.X + 15, pos.Y - 10);
    }

    case "seeded-item4": {
      return Vector(pos.X - 45, pos.Y - 10);
    }

    case "seeded-item5": {
      return Vector(pos.X + 45, pos.Y - 10);
    }

    case "diversity-active": {
      return Vector(pos.X - 90, pos.Y - 70);
    }

    case "diversity-passives": {
      return Vector(pos.X + 90, pos.Y - 40);
    }

    case "diversity-trinket": {
      return Vector(pos.X - 90, pos.Y + 30);
    }

    case "diversity-item1": {
      // The active item
      return Vector(pos.X - 90, pos.Y - 40);
    }

    case "diversity-item2": {
      // The 1st passive item
      return Vector(pos.X + 60, pos.Y - 10);
    }

    case "diversity-item3": {
      // The 2nd passive item
      return Vector(pos.X + 90, pos.Y - 10);
    }

    case "diversity-item4": {
      // The 3rd passive item
      return Vector(pos.X + 120, pos.Y - 10);
    }

    case "diversity-item5": {
      // The trinket
      return Vector(pos.X - 90, pos.Y + 60);
    }

    case "eden-item1": {
      return Vector(123, 17);
    }

    case "eden-item2": {
      return Vector(153, 17);
    }

    case "place": {
      // "1st", "2nd", etc.
      // Move it next to the "R+" icon
      let x = 24;
      if (g.g.Difficulty !== Difficulty.DIFFICULTY_NORMAL) {
        // The hard mode icon will interfere, so it needs to be moved to the right
        x += 10;
      }
      if (challenge !== 0) {
        // The challenge icon will interfere, so it needs to be moved to the right
        x = 67;
      }

      return Vector(x, 79);
    }

    case "place2": {
      // The final place graphic
      return Vector(pos.X, pos.Y - 80);
    }

    case "corrupt1": {
      return Vector(pos.X, pos.Y - 80);
    }

    case "corrupt2": {
      return Vector(pos.X, pos.Y - 50);
    }

    case "dps-button": {
      for (const button of g.run.level.buttons) {
        if (button.type === "dps" && button.roomIndex === roomIndex) {
          const buttonPos = Isaac.WorldToScreen(button.pos);
          return Vector(buttonPos.X, buttonPos.Y - 15);
        }
      }

      return pos;
    }

    case "victory-lap-button": {
      for (const button of g.run.level.buttons) {
        if (button.type === "victory-lap" && button.roomIndex === roomIndex) {
          const buttonPos = Isaac.WorldToScreen(button.pos);
          return Vector(buttonPos.X + 1, buttonPos.Y - 25);
        }
      }

      return pos;
    }

    default: {
      return pos;
    }
  }
}

// This clears the graphics that should only appear in the starting room
export function clearStartingRoomGraphicsTop(): void {
  init("myStatus", "");
  init("ready", "");
  init("slash", "");
  init("readyTotal", "");
}

export function clearStartingRoomGraphicsBottom(): void {
  init("raceRanked", "");
  init("raceRankedIcon", "");
  init("raceFormat", "");
  init("raceFormatIcon", "");
  init("goal", "");
  init("raceGoal", "");
}

// This clears the graphics that appear in the starting room after the race has started
export function clearPostRaceStartGraphics(): void {
  init("seeded-starting-item", "");
  init("seeded-starting-build", "");
  init("seeded-item1", "");
  init("seeded-item2", "");
  init("seeded-item3", "");
  init("seeded-item4", "");
  init("seeded-item5", "");
  init("diversity-active", "");
  init("diversity-passives", "");
  init("diversity-trinket", "");
  init("diversity-item1", "");
  init("diversity-item2", "");
  init("diversity-item3", "");
  init("diversity-item4", "");
  init("diversity-item5", "");
}
*/
