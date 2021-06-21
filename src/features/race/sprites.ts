import * as placeLeft from "./placeLeft";
import * as raceRoom from "./raceRoom";
import * as startingRoom from "./startingRoom";
import * as topSprite from "./topSprite";

export function resetAll(): void {
  raceRoom.resetSprites();
  startingRoom.resetSprites();
  placeLeft.resetSprite();
  topSprite.resetSprite();
}
