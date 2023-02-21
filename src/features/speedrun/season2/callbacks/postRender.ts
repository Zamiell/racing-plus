import { game } from "isaacscript-common";
import { onSeason } from "../../speedrun";
import {
  drawSeason2StartingRoomSprites,
  drawSeason2StartingRoomText,
} from "../startingRoomSprites";

export function season2PostRender(): void {
  if (!onSeason(2)) {
    return;
  }

  const hud = game.GetHUD();
  if (!hud.IsVisible()) {
    return;
  }

  // We do not have to check if the game is paused because the pause menu will be drawn on top of
  // the starting room sprites. (And we do not have to worry about the room slide animation because
  // the starting room sprites are not shown once we re-enter the room.)

  drawSeason2StartingRoomSprites();
  drawSeason2StartingRoomText();
}
