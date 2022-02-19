import {
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
import { initGlowingItemSprite } from "../../sprite";
import { SEASON_2_STARTING_BUILDS } from "../speedrun/season2/constants";
import { CHANGE_CHAR_ORDER_POSITIONS } from "./constants";
import { ChangeCharOrderPhase } from "./types/ChangeCharOrderPhase";
import v, { getSeasonDescription } from "./v";

const HALF_FADED_COLOR = Color(1, 1, 1, 0.5, 0, 0, 0);

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

      case ChangeCharOrderPhase.BUILD_VETO: {
        createBuildVetoButtons();
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
  const nextToBottomDoor = g.r.GetGridPosition(97);
  for (const player of getPlayers()) {
    player.Position = nextToBottomDoor;
    player.Velocity = Vector.Zero;
  }

  const seasonDescription = getSeasonDescription();

  v.room.sprites.characters = [];
  for (const [characterID, x, y] of seasonDescription.charPositions) {
    // Spawn buttons for each characters
    const position = gridToPos(x, y);
    const gridIndex = g.r.GetGridIndex(position);
    spawnGridEntityWithVariant(
      GridEntityType.GRID_PRESSURE_PLATE,
      PressurePlateVariant.PRESSURE_PLATE,
      gridIndex,
    );

    // Spawn the character graphic next to the button
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
}

function createBuildVetoButtons() {
  const nextToBottomDoor = g.r.GetGridPosition(97);
  for (const player of getPlayers()) {
    player.Position = nextToBottomDoor;
    player.Velocity = Vector.Zero;
  }

  const seasonDescription = getSeasonDescription();
  if (seasonDescription.buildPositions === undefined) {
    error("buildPositions is undefined.");
  }

  // We use the "characters" array for the builds to avoid making a new data structure
  v.room.sprites.characters = [];
  for (const [buildIndex, x, y] of seasonDescription.buildPositions) {
    // Spawn buttons for each characters
    const position = gridToPos(x, y);
    const gridIndex = g.r.GetGridIndex(position);
    spawnGridEntityWithVariant(
      GridEntityType.GRID_PRESSURE_PLATE,
      PressurePlateVariant.PRESSURE_PLATE,
      gridIndex,
    );

    // Spawn the build graphic next to the button
    const build = SEASON_2_STARTING_BUILDS[buildIndex];
    if (build === undefined) {
      error(`Failed to get the build at index: ${buildIndex}`);
    }
    const firstItem = build[0];
    const characterSprite = initGlowingItemSprite(firstItem);
    v.room.sprites.characters.push(characterSprite);
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

  const newPhase =
    seasonChosenAbbreviation === "R7S2"
      ? ChangeCharOrderPhase.BUILD_VETO
      : ChangeCharOrderPhase.CHARACTER_SELECT;
  v.room.phase = newPhase;
  v.room.seasonChosenAbbreviation = seasonChosenAbbreviation;

  removeAllMatchingGridEntities(GridEntityType.GRID_PRESSURE_PLATE);

  // Delete all of the season sprites
  v.room.sprites.seasons.clear();

  // Mark to create new buttons (for the characters) on the next frame
  v.room.createButtonsFrame = gameFrameCount + 1;
}

function checkPressedPhaseCharacterSelect(gridEntity: GridEntity) {
  const seasonDescription = getSeasonDescription();

  for (let i = 0; i < seasonDescription.charPositions.length; i++) {
    const [, x, y] = seasonDescription.charPositions[i];
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
  const seasonDescription = getSeasonDescription();

  const characterID = seasonDescription.charPositions[i][0];
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
  if (v.room.charOrder.length === seasonDescription.numChars) {
    // We are done, so write the changes to persistent storage
    if (v.room.seasonChosenAbbreviation === null) {
      error("seasonChosenAbbreviation was null.");
    }
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
  const seasonDescription = getSeasonDescription();

  const [, x, y] = seasonDescription.charPositions[i];
  const position = gridToPos(x, y);
  const gridEntity = g.r.GetGridEntityFromPos(position);
  if (gridEntity !== undefined) {
    removeGridEntity(gridEntity);
  }

  // We also need to remove the sprite
  v.room.sprites.characters[i] = Sprite();
}

function checkPressedPhaseBuildVeto(gridEntity: GridEntity) {
  const seasonDescription = getSeasonDescription();

  if (seasonDescription.buildPositions === undefined) {
    error("buildPositions is undefined.");
  }

  for (let i = 0; i < seasonDescription.buildPositions.length; i++) {
    const [, x, y] = seasonDescription.buildPositions[i];
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
  const seasonDescription = getSeasonDescription();
  if (seasonDescription.numBuildVetos === undefined) {
    error("numBuildVetos is undefined.");
  }
  if (seasonDescription.buildPositions === undefined) {
    error("buildPositions is undefined.");
  }

  if (v.room.buildsChosen.length === seasonDescription.numBuildVetos) {
    return;
  }

  const buildIndex = seasonDescription.buildPositions[i][0];
  v.room.buildsChosen.push(buildIndex);

  // Mark that we have pressed this button
  gridEntity.VarData = 1;

  // Change the graphic to that of a number
  v.room.sprites.characters[i].Load("gfx/timer/timer.anm2", true);
  v.room.sprites.characters[i].SetFrame("Default", v.room.buildsChosen.length);

  // Check to see if this is our last build
  if (v.room.buildsChosen.length === seasonDescription.numBuildVetos) {
    // We are done, so write the changes to persistent storage
    if (v.room.seasonChosenAbbreviation === null) {
      error("seasonChosenAbbreviation was null.");
    }
    v.persistent.charOrders.set(
      v.room.seasonChosenAbbreviation,
      v.room.buildsChosen,
    );
    g.g.Fadeout(0.05, FadeoutTarget.MAIN_MENU);
  }
}
