/*

  // Scale some specific sprites
  if (spriteType === "dps-button") {
    spriteDescription.sprite.Scale = Vector(0.75, 0.75);
  }

  if (spriteType === "dps-button") {
    animationName = "Idle";
  }


function getFileName(spriteType: string, spriteName: string) {
    case "corrupt1":
    case "corrupt2": {
      return `gfx/misc/${spriteName}.anm2`;
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
  const roomIndex = misc.getRoomIndex();
  const challenge = Isaac.GetChallenge();

  // Start in the center of the screen by default
  const pos = misc.getScreenCenterPosition();

  switch (spriteType) {
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
*/
