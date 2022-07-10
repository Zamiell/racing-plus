import {
  FadeoutTarget,
  GridEntityType,
  PlayerType,
  PressurePlateState,
  PressurePlateVariant,
} from "isaac-typescript-definitions";
import {
  emptyArray,
  game,
  getDefaultColor,
  getPlayers,
  gridCoordinatesToWorldPosition,
  isEven,
  removeAllMatchingGridEntities,
  removeGrid,
  spawnGridWithVariant,
  VectorZero,
} from "isaacscript-common";
import { ChallengeCustom } from "../../enums/ChallengeCustom";
import { ChangeCharOrderPhase } from "../../enums/ChangeCharOrderPhase";
import g from "../../globals";
import { initGlowingItemSprite } from "../../sprite";
import { SEASON_2_STARTING_BUILDS } from "../speedrun/season2/constants";
import { season2SetBansTime } from "../speedrun/season2/v";
import { CHANGE_CHAR_ORDER_POSITIONS } from "./constants";
import v, { getSeasonDescription } from "./v";

/** This is the largest value that works. */
const FADE_RENDER_FRAMES = 38;

const HALF_FADED_COLOR = Color(1, 1, 1, 0.5, 0, 0, 0);

// ModCallback.POST_UPDATE (1)
export function postUpdate(): void {
  checkCreateButtons();
}

function checkCreateButtons() {
  const gameFrameCount = game.GetFrameCount();

  if (
    v.room.createButtonsFrame === null ||
    gameFrameCount < v.room.createButtonsFrame
  ) {
    return;
  }
  v.room.createButtonsFrame = null;

  switch (v.room.phase) {
    case ChangeCharOrderPhase.SEASON_SELECT: {
      break;
    }

    case ChangeCharOrderPhase.CHARACTER_SELECT: {
      createCharacterButtons();
      break;
    }

    case ChangeCharOrderPhase.BUILD_VETO: {
      createBuildVetoButtons();
      break;
    }
  }
}

function createCharacterButtons() {
  const nextToBottomDoor = g.r.GetGridPosition(97);
  for (const player of getPlayers()) {
    player.Position = nextToBottomDoor;
    player.Velocity = VectorZero;
  }

  const seasonDescription = getSeasonDescription();

  emptyArray(v.room.sprites.characters);
  for (const [characterID, x, y] of seasonDescription.charPositions) {
    // Spawn buttons for each characters.
    const position = gridCoordinatesToWorldPosition(x, y);
    const gridIndex = g.r.GetGridIndex(position);
    spawnGridWithVariant(
      GridEntityType.PRESSURE_PLATE,
      PressurePlateVariant.PRESSURE_PLATE,
      gridIndex,
    );

    // Spawn the character graphic next to the button.
    const characterSprite = Sprite();
    characterSprite.Load(
      `gfx/changeCharOrder/characters/${characterID}.anm2`,
      true,
    );

    // The 5th frame is rather interesting.
    characterSprite.SetFrame("Death", 5);

    // Fade the character so it looks like a ghost.
    characterSprite.Color = HALF_FADED_COLOR;

    v.room.sprites.characters.push(characterSprite);
  }
}

function createBuildVetoButtons() {
  const nextToBottomDoor = g.r.GetGridPosition(97);
  for (const player of getPlayers()) {
    player.Position = nextToBottomDoor;
    player.Velocity = VectorZero;
  }

  const seasonDescription = getSeasonDescription();
  if (seasonDescription.buildPositions === undefined) {
    error("buildPositions is undefined.");
  }

  // We use the "characters" array for the builds to avoid making a new data structure.
  emptyArray(v.room.sprites.characters);
  for (const [buildIndex, x, y] of seasonDescription.buildPositions) {
    // Spawn buttons for each characters.
    const position = gridCoordinatesToWorldPosition(x, y);
    const gridIndex = g.r.GetGridIndex(position);
    spawnGridWithVariant(
      GridEntityType.PRESSURE_PLATE,
      PressurePlateVariant.PRESSURE_PLATE,
      gridIndex,
    );

    // Spawn the build graphic next to the button.
    const build = SEASON_2_STARTING_BUILDS[buildIndex];
    if (build === undefined) {
      error(`Failed to get the build at index: ${buildIndex}`);
    }
    const firstItem = build[0];
    if (firstItem === undefined) {
      error(`Failed to get the first item for build at index: ${buildIndex}`);
    }
    const characterSprite = initGlowingItemSprite(firstItem);
    v.room.sprites.characters.push(characterSprite);
  }
}

// ModCallbackCustom.POST_PRESSURE_PLATE_UPDATE
export function postPressurePlateUpdate(
  pressurePlate: GridEntityPressurePlate,
): void {
  checkPressed(pressurePlate);
}

function checkPressed(pressurePlate: GridEntityPressurePlate) {
  switch (v.room.phase) {
    case ChangeCharOrderPhase.SEASON_SELECT: {
      return checkPressedPhaseSeasonSelect(pressurePlate);
    }

    case ChangeCharOrderPhase.CHARACTER_SELECT: {
      return checkPressedPhaseCharacterSelect(pressurePlate);
    }

    case ChangeCharOrderPhase.BUILD_VETO: {
      return checkPressedPhaseBuildVeto(pressurePlate);
    }
  }
}

function checkPressedPhaseSeasonSelect(pressurePlate: GridEntityPressurePlate) {
  for (const [key, position] of Object.entries(CHANGE_CHAR_ORDER_POSITIONS)) {
    const buttonPosition = gridCoordinatesToWorldPosition(
      position.X,
      position.Y,
    );
    if (
      pressurePlate.State === PressurePlateState.PRESSURE_PLATE_PRESSED &&
      pressurePlate.Position.X === buttonPosition.X &&
      pressurePlate.Position.Y === buttonPosition.Y
    ) {
      seasonButtonPressed(key);
      return;
    }
  }
}

function seasonButtonPressed(seasonChosenAbbreviation: string) {
  const gameFrameCount = game.GetFrameCount();

  const newPhase =
    seasonChosenAbbreviation === "R7S2"
      ? ChangeCharOrderPhase.BUILD_VETO
      : ChangeCharOrderPhase.CHARACTER_SELECT;
  v.room.phase = newPhase;
  v.room.seasonChosenAbbreviation = seasonChosenAbbreviation;

  removeAllMatchingGridEntities(GridEntityType.PRESSURE_PLATE);

  // Delete all of the season sprites.
  v.room.sprites.seasons.clear();

  // Mark to create new buttons (for the characters) on the next frame.
  v.room.createButtonsFrame = gameFrameCount + 1;
}

function checkPressedPhaseCharacterSelect(
  pressurePlate: GridEntityPressurePlate,
) {
  const seasonDescription = getSeasonDescription();

  seasonDescription.charPositions.forEach((tuple, i) => {
    const [, x, y] = tuple;
    const buttonPosition = gridCoordinatesToWorldPosition(x, y);
    if (
      pressurePlate.State === PressurePlateState.PRESSURE_PLATE_PRESSED &&
      pressurePlate.VarData === 0 && // We set it to 1 to mark that we have pressed it.
      pressurePlate.Position.X === buttonPosition.X &&
      pressurePlate.Position.Y === buttonPosition.Y
    ) {
      characterButtonPressed(pressurePlate, i);
    }
  });
}

function characterButtonPressed(gridEntity: GridEntity, i: int) {
  const seasonDescription = getSeasonDescription();

  const tuple = seasonDescription.charPositions[i];
  if (tuple === undefined) {
    error(`Failed to find the positions for character: ${i}`);
  }
  const characterID = tuple[0];
  v.room.charOrder.push(characterID);

  // Mark that we have pressed this button.
  gridEntity.VarData = 1;

  // Change the graphic to that of a number.
  const sprite = v.room.sprites.characters[i];
  if (sprite === undefined) {
    error(`Failed to find the sprite for character: ${i}`);
  }
  sprite.Load("gfx/timer/timer.anm2", true);
  sprite.SetFrame("Default", v.room.charOrder.length);
  sprite.Color = getDefaultColor(); // Remove the fade.

  if (v.room.seasonChosenAbbreviation === "R7S1") {
    season1DeleteOtherCharButton(i);
  }

  // Check to see if this is our last character.
  if (v.room.charOrder.length === seasonDescription.numChars) {
    // We are done, so write the changes to persistent storage.
    if (v.room.seasonChosenAbbreviation === null) {
      error("seasonChosenAbbreviation was null.");
    }
    v.persistent.charOrders.set(
      v.room.seasonChosenAbbreviation,
      v.room.charOrder,
    );
    game.Fadeout(0.05, FadeoutTarget.MAIN_MENU);
    v.room.challengeTarget = ChallengeCustom.SEASON_1;
    v.room.resetRenderFrame = Isaac.GetFrameCount() + FADE_RENDER_FRAMES;
  }
}

function season1DeleteOtherCharButton(i: int) {
  let otherCharIndex: int;
  if (isEven(i)) {
    // A normal character was chosen. Delete the corresponding tainted character button.
    otherCharIndex = i + 1;
  } else {
    // A tainted character was chosen. Delete the corresponding normal character button.
    otherCharIndex = i - 1;
  }

  deleteCharacterButtonAtIndex(otherCharIndex);
}

function deleteCharacterButtonAtIndex(i: int) {
  const seasonDescription = getSeasonDescription();

  const tuple = seasonDescription.charPositions[i];
  if (tuple === undefined) {
    error(`Failed to find the positions for character: ${i}`);
  }
  const [, x, y] = tuple;
  const position = gridCoordinatesToWorldPosition(x, y);
  const gridEntity = g.r.GetGridEntityFromPos(position);
  if (gridEntity !== undefined) {
    removeGrid(gridEntity);
  }

  // We also need to remove the sprite.
  v.room.sprites.characters[i] = Sprite();
}

function checkPressedPhaseBuildVeto(pressurePlate: GridEntityPressurePlate) {
  const seasonDescription = getSeasonDescription();

  if (seasonDescription.buildPositions === undefined) {
    error("buildPositions is undefined.");
  }

  seasonDescription.buildPositions.forEach((tuple, i) => {
    const [, x, y] = tuple;
    const buttonPosition = gridCoordinatesToWorldPosition(x, y);
    if (
      pressurePlate.State === PressurePlateState.PRESSURE_PLATE_PRESSED &&
      pressurePlate.VarData === 0 && // We set it to 1 to mark that we have pressed it.
      pressurePlate.Position.X === buttonPosition.X &&
      pressurePlate.Position.Y === buttonPosition.Y
    ) {
      buildButtonPressed(pressurePlate, i);
    }
  });
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

  const tuple = seasonDescription.buildPositions[i];
  if (tuple === undefined) {
    error(`Failed to find the positions for build: ${i}`);
  }
  const buildIndex = tuple[0];
  v.room.buildsChosen.push(buildIndex);

  // Mark that we have pressed this button.
  gridEntity.VarData = 1;

  // Change the graphic to that of a number.
  const sprite = v.room.sprites.characters[i];
  if (sprite === undefined) {
    error(`Failed to find the sprite for build: ${i}`);
  }
  sprite.Load("gfx/timer/timer.anm2", true);
  sprite.SetFrame("Default", v.room.buildsChosen.length);

  // Check to see if this is our last build.
  if (v.room.buildsChosen.length === seasonDescription.numBuildVetos) {
    // We are done, so write the changes to persistent storage.
    if (v.room.seasonChosenAbbreviation === null) {
      error("seasonChosenAbbreviation was null.");
    }
    v.persistent.charOrders.set(
      v.room.seasonChosenAbbreviation,
      v.room.buildsChosen as PlayerType[],
    );
    season2SetBansTime();
    game.Fadeout(0.05, FadeoutTarget.MAIN_MENU);
    v.room.challengeTarget = ChallengeCustom.SEASON_2;
    v.room.resetRenderFrame = Isaac.GetFrameCount() + FADE_RENDER_FRAMES;
  }
}
