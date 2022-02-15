import {
  arrayCopy,
  ensureAllCases,
  getDefaultColor,
  getPlayers,
  gridToPos,
  isEven,
  log,
  removeAllMatchingGridEntities,
  removeGridEntity,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import g from "../../globals";
import { CHANGE_CHAR_ORDER_POSITIONS } from "./constants";
import { ChangeCharOrderPhase } from "./types/ChangeCharOrderPhase";
import v from "./v";

const HALF_FADED_COLOR = Color(1, 1, 1, 0.5, 0, 0, 0);

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  drawButtonSprites();
}

function drawButtonSprites() {
  for (const [
    seasonAbbreviation,
    seasonSprite,
  ] of v.room.sprites.seasons.entries()) {
    const position = CHANGE_CHAR_ORDER_POSITIONS[seasonAbbreviation];
    const posButton = gridToPos(position.X, position.Y - 1);
    const posRender = Isaac.WorldToScreen(posButton);
    seasonSprite.RenderLayer(0, posRender);
  }
}

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  checkCreateButtons();
}

function checkCreateButtons() {
  const gameFrameCount = g.g.GetFrameCount();

  if (
    v.room.createButtonsFrame !== null &&
    gameFrameCount >= v.room.createButtonsFrame
  ) {
    v.room.createButtonsFrame = null;

    switch (v.room.phase) {
      case ChangeCharOrderPhase.CHARACTER_SELECT: {
        createCharacterButtons();
        break;
      }

      default: {
        log(`Unknown ChangeCharOrderPhase: ${v.room.phase}`);
        break;
      }
    }
  }
}

function createCharacterButtons() {
  if (v.room.seasonChosenAbbreviation === null) {
    error(
      "Cannot create the character buttons because the seasonChosen is null.",
    );
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[v.room.seasonChosenAbbreviation];

  v.room.sprites.characters = [];
  for (const [characterID, x, y] of season.charPositions) {
    // Spawn buttons for each characters
    const position = gridToPos(x, y);
    const gridIndex = g.r.GetGridIndex(position);
    spawnGridEntityWithVariant(
      GridEntityType.GRID_PRESSURE_PLATE,
      PressurePlateVariant.PRESSURE_PLATE,
      gridIndex,
    );

    // Spawn the character selection graphic next to the button
    const characterSprite = Sprite();
    characterSprite.Load(
      `gfx/changeCharOrder/characters/${characterID}.anm2`,
      true,
    );
    // The 5th frame is rather interesting
    characterSprite.SetFrame("Death", 5);
    // Fade the character so it looks like a ghost
    characterSprite.Color = HALF_FADED_COLOR;

    v.room.sprites.characters.push(characterSprite);
  }

  const nextToBottomDoor = g.r.GetGridPosition(97);
  for (const player of getPlayers()) {
    player.Position = nextToBottomDoor;
  }
}

// ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE
// GridEntityType.GRID_PRESSURE_PLATE (20)
export function postGridEntityUpdatePressurePlate(
  gridEntity: GridEntity,
): void {
  checkPressed(gridEntity);
}

function checkPressed(gridEntity: GridEntity) {
  switch (v.room.phase) {
    case ChangeCharOrderPhase.SEASON_SELECT: {
      checkPressedPhaseSeasonSelect(gridEntity);
      break;
    }

    case ChangeCharOrderPhase.CHARACTER_SELECT: {
      checkPressedPhaseCharacterSelect(gridEntity);
      break;
    }

    case ChangeCharOrderPhase.BUILD_VETO: {
      checkPressedPhaseBuildVeto(gridEntity);
      break;
    }

    default: {
      ensureAllCases(v.room.phase);
      break;
    }
  }
}

function checkPressedPhaseSeasonSelect(gridEntity: GridEntity) {
  for (const [key, position] of Object.entries(CHANGE_CHAR_ORDER_POSITIONS)) {
    const buttonPosition = gridToPos(position.X, position.Y);
    if (
      gridEntity.State === PressurePlateState.PRESSURE_PLATE_PRESSED &&
      gridEntity.Position.X === buttonPosition.X &&
      gridEntity.Position.Y === buttonPosition.Y
    ) {
      seasonButtonPressed(key);
      return;
    }
  }
}

function seasonButtonPressed(seasonChosenAbbreviation: string) {
  const gameFrameCount = g.g.GetFrameCount();

  v.room.phase = ChangeCharOrderPhase.CHARACTER_SELECT;
  v.room.seasonChosenAbbreviation = seasonChosenAbbreviation;
  removeAllMatchingGridEntities(GridEntityType.GRID_PRESSURE_PLATE);

  // Delete all of the season sprites
  v.room.sprites.seasons.clear();

  // Mark to create new buttons (for the characters) on the next frame
  v.room.createButtonsFrame = gameFrameCount + 1;
}

function checkPressedPhaseCharacterSelect(gridEntity: GridEntity) {
  if (v.room.seasonChosenAbbreviation === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[v.room.seasonChosenAbbreviation];

  for (let i = 0; i < season.charPositions.length; i++) {
    const [, x, y] = season.charPositions[i];
    const buttonPosition = gridToPos(x, y);
    if (
      gridEntity.State === PressurePlateState.PRESSURE_PLATE_PRESSED &&
      gridEntity.VarData === 0 && // We set it to 1 to mark that we have pressed it
      gridEntity.Position.X === buttonPosition.X &&
      gridEntity.Position.Y === buttonPosition.Y
    ) {
      characterButtonPressed(gridEntity, i);
    }
  }
}

function characterButtonPressed(gridEntity: GridEntity, i: int) {
  if (v.room.seasonChosenAbbreviation === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[v.room.seasonChosenAbbreviation];
  const characterID = season.charPositions[i][0];
  v.room.charOrder.push(characterID);

  // Mark that we have pressed this button
  gridEntity.VarData = 1;

  // Change the graphic to that of a number
  v.room.sprites.characters[i].Load("gfx/timer/timer.anm2", true);
  v.room.sprites.characters[i].SetFrame("Default", v.room.charOrder.length);
  v.room.sprites.characters[i].Color = getDefaultColor(); // Remove the fade

  if (v.room.seasonChosenAbbreviation === "R7S1") {
    season1DeleteOtherCharButton(i);
  }

  // Check to see if this is our last character
  if (v.room.charOrder.length === season.numChars) {
    // We are done, so write the changes to persistent storage
    v.persistent.charOrders.set(
      v.room.seasonChosenAbbreviation,
      v.room.charOrder,
    );
    g.g.Fadeout(0.05, FadeoutTarget.MAIN_MENU);
  }
}

function season1DeleteOtherCharButton(i: int) {
  let otherCharIndex: int;
  if (isEven(i)) {
    // A normal character was chosen
    // Delete the corresponding tainted character button
    otherCharIndex = i + 1;
  } else {
    // A tainted character was chosen
    // Delete the corresponding normal character button
    otherCharIndex = i - 1;
  }

  deleteCharacterButtonAtIndex(otherCharIndex);
}

function deleteCharacterButtonAtIndex(i: int) {
  if (v.room.seasonChosenAbbreviation === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[v.room.seasonChosenAbbreviation];
  const [, x, y] = season.charPositions[i];
  const position = gridToPos(x, y);
  const gridEntity = g.r.GetGridEntityFromPos(position);
  if (gridEntity !== undefined) {
    removeGridEntity(gridEntity);
  }

  // We also need to remove the sprite
  v.room.sprites.characters[i] = Sprite();
}

function checkPressedPhaseBuildVeto(gridEntity: GridEntity) {
  if (v.room.seasonChosenAbbreviation === null) {
    error("seasonChosen is null.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[v.room.seasonChosenAbbreviation];

  if (season.buildPositions === undefined) {
    error("buildPositions is undefined.");
  }

  for (let i = 0; i < season.buildPositions.length; i++) {
    const [, x, y] = season.buildPositions[i];
    const buttonPosition = gridToPos(x, y);
    if (
      gridEntity.State === PressurePlateState.PRESSURE_PLATE_PRESSED &&
      gridEntity.VarData === 0 && // We set it to 1 to mark that we have pressed it
      gridEntity.Position.X === buttonPosition.X &&
      gridEntity.Position.Y === buttonPosition.Y
    ) {
      buildButtonPressed(gridEntity, i);
    }
  }
}

function buildButtonPressed(gridEntity: GridEntity, i: int) {
  if (v.room.seasonChosenAbbreviation === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[v.room.seasonChosenAbbreviation];

  if (season.buildPositions === undefined) {
    error("buildPositions is undefined.");
  }
  const buildIndex = season.buildPositions[i][0];
  v.room.buildsChosen.push(buildIndex);

  // Mark that we have pressed this button
  gridEntity.VarData = 1;

  // Check to see if this is our last build
  if (season.numBuildVetos === undefined) {
    error("numBuildVetos is undefined.");
  }
  if (v.room.buildsChosen.length === season.numBuildVetos) {
    // We are done, so write the changes to persistent storage
    v.persistent.buildVetos = arrayCopy(v.room.buildsChosen);
    g.g.Fadeout(0.05, FadeoutTarget.MAIN_MENU);
  }
}
