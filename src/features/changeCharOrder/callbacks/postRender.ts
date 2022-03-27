import {
  getDefaultKColor,
  gridCoordinatesToWorldPosition,
  VectorZero,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { ChangeCharOrderPhase } from "../../../enums/ChangeCharOrderPhase";
import g from "../../../globals";
import { CHANGE_CHAR_ORDER_PHASE_TEXT } from "../../../objects/changeCharOrderPhaseText";
import { consoleCommand } from "../../../utils";
import { CHANGE_CHAR_ORDER_POSITIONS } from "../constants";
import v, { getSeasonDescription } from "../v";

export function changeCharOrderPostRender(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.CHANGE_CHAR_ORDER) {
    return;
  }

  disableControls();
  checkReset();
  draw();
}

function disableControls() {
  const gameFrameCount = g.g.GetFrameCount();
  const player = Isaac.GetPlayer();

  // Disable the controls or else the player will be able to move around while the screen is still
  // black
  player.ControlsEnabled = gameFrameCount >= 1;
}

function checkReset() {
  const renderFrameCount = Isaac.GetFrameCount();
  if (
    v.room.resetRenderFrame === null ||
    renderFrameCount < v.room.resetRenderFrame
  ) {
    return;
  }
  v.room.resetRenderFrame = null;
  consoleCommand(`challenge ${v.room.challengeTarget}`);
}

function draw() {
  // We can't check for "HUD.IsVisible()" because we explicitly disable the HUD in this challenge
  // Thus, we explicitly check for Mod Config Menu
  if (ModConfigMenu !== undefined && ModConfigMenu.IsVisible) {
    return;
  }

  drawCurrentChoosingActivity();
  drawSeasonSprites();
  drawCharacterSprites();
  drawBuildVetoSprites();
}

function drawCurrentChoosingActivity() {
  const bottomCenterOfRoom = g.r.GetGridPosition(112);
  const position = Isaac.WorldToScreen(bottomCenterOfRoom);
  position.Y -= 15;
  const text = CHANGE_CHAR_ORDER_PHASE_TEXT[v.room.phase];
  const font = g.fonts.droid;
  const length = font.GetStringWidthUTF8(text);
  font.DrawString(
    text,
    position.X - length / 2,
    position.Y,
    getDefaultKColor(),
  );
}
function drawSeasonSprites() {
  if (v.room.phase !== ChangeCharOrderPhase.SEASON_SELECT) {
    return;
  }

  for (const [
    seasonAbbreviation,
    seasonSprite,
  ] of v.room.sprites.seasons.entries()) {
    const position = CHANGE_CHAR_ORDER_POSITIONS[seasonAbbreviation];
    if (position === undefined) {
      error(`Failed to find the positions for season: ${seasonAbbreviation}`);
    }
    const posButton = gridCoordinatesToWorldPosition(
      position.X,
      position.Y - 1,
    );
    const posRender = Isaac.WorldToScreen(posButton);
    seasonSprite.RenderLayer(0, posRender);
  }
}

function drawCharacterSprites() {
  if (v.room.phase !== ChangeCharOrderPhase.CHARACTER_SELECT) {
    return;
  }

  const seasonDescription = getSeasonDescription();

  v.room.sprites.characters.forEach((characterSprite, i) => {
    const tuple = seasonDescription.charPositions[i];
    const [, x, y] = tuple;
    const oneTileAboveButton = gridCoordinatesToWorldPosition(x, y - 1);
    const renderPosition = Isaac.WorldToScreen(oneTileAboveButton);
    renderPosition.Y += 10; // Nudge it a bit upwards to make it look better
    characterSprite.Render(renderPosition, VectorZero, VectorZero);
  });
}

function drawBuildVetoSprites() {
  if (v.room.phase !== ChangeCharOrderPhase.BUILD_VETO) {
    return;
  }

  const seasonDescription = getSeasonDescription();

  v.room.sprites.characters.forEach((characterSprite, i) => {
    if (seasonDescription.buildPositions === undefined) {
      error("buildPositions was undefined.");
    }

    const tuple = seasonDescription.buildPositions[i];
    const [, x, y] = tuple;
    const oneTileAboveButton = gridCoordinatesToWorldPosition(x, y - 1);
    const renderPosition = Isaac.WorldToScreen(oneTileAboveButton);
    characterSprite.Render(renderPosition, VectorZero, VectorZero);
  });
}
