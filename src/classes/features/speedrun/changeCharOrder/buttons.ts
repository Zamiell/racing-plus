import {
  FadeoutTarget,
  GridEntityType,
  PlayerType,
  PressurePlateState,
  PressurePlateVariant,
} from "isaac-typescript-definitions";
import {
  VectorZero,
  emptyArray,
  game,
  getPlayers,
  gridCoordinatesToWorldPosition,
  isEven,
  removeAllMatchingGridEntities,
  removeGridEntity,
  setSpriteOpacity,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import { ChangeCharOrderPhase } from "../../../../enums/ChangeCharOrderPhase";
import {
  CHALLENGE_CUSTOM_ABBREVIATION_TO_CHALLENGE_CUSTOM,
  ChallengeCustomAbbreviation,
} from "../../../../speedrun/constants";
import { newGlowingCollectibleSprite } from "../../../../sprite";
import { setBuildBansTime } from "../RandomCharacterOrder";
import { SEASON_2_STARTING_BUILDS } from "../season2/constants";
import { CHANGE_CHAR_ORDER_POSITIONS_MAP } from "./constants";
import { getSeasonDescription, v } from "./v";

/** This is the largest value that works. */
const FADE_RENDER_FRAMES = 38;

const FADE_AMOUNT = 0.5;

// ModCallback.POST_UPDATE (1)
export function changeCharOrderButtonsPostUpdate(): void {
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
  const room = game.GetRoom();
  const nextToBottomDoor = room.GetGridPosition(97);

  for (const player of getPlayers()) {
    player.Position = nextToBottomDoor;
    player.Velocity = VectorZero;
  }

  const seasonDescription = getSeasonDescription();

  emptyArray(v.room.sprites.characters);
  for (const { character, x, y } of seasonDescription.charPositions) {
    // Spawn buttons for each characters.
    const position = gridCoordinatesToWorldPosition(x, y);
    const gridIndex = room.GetGridIndex(position);
    spawnGridEntityWithVariant(
      GridEntityType.PRESSURE_PLATE,
      PressurePlateVariant.PRESSURE_PLATE,
      gridIndex,
    );

    // Spawn the character graphic next to the button.
    const characterSprite = Sprite();
    characterSprite.Load(
      `gfx/change-char-order/characters/${character}.anm2`,
      true,
    );

    // The 5th frame is rather interesting.
    characterSprite.SetFrame("Death", 5);

    // Fade the character so it looks like a ghost.
    setSpriteOpacity(characterSprite, FADE_AMOUNT);

    v.room.sprites.characters.push(characterSprite);
  }
}

function createBuildVetoButtons() {
  const room = game.GetRoom();
  const nextToBottomDoor = room.GetGridPosition(97);

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
  for (const { buildIndex, x, y } of seasonDescription.buildPositions) {
    // Spawn buttons for each characters.
    const position = gridCoordinatesToWorldPosition(x, y);
    const gridIndex = room.GetGridIndex(position);
    spawnGridEntityWithVariant(
      GridEntityType.PRESSURE_PLATE,
      PressurePlateVariant.PRESSURE_PLATE,
      gridIndex,
    );

    // Spawn the build graphic next to the button.
    const build = SEASON_2_STARTING_BUILDS[buildIndex];
    if (build === undefined) {
      error(`Failed to get the build at index: ${buildIndex}`);
    }
    const firstCollectibleType = build[0];
    const characterSprite = newGlowingCollectibleSprite(firstCollectibleType);
    v.room.sprites.characters.push(characterSprite);
  }
}

// ModCallbackCustom.POST_PRESSURE_PLATE_UPDATE
export function changeCharOrderButtonsPostPressurePlateUpdate(
  pressurePlate: GridEntityPressurePlate,
): void {
  checkPressed(pressurePlate);
}

function checkPressed(pressurePlate: GridEntityPressurePlate) {
  switch (v.room.phase) {
    case ChangeCharOrderPhase.SEASON_SELECT: {
      checkPressedPhaseSeasonSelect(pressurePlate);
      break;
    }

    case ChangeCharOrderPhase.CHARACTER_SELECT: {
      checkPressedPhaseCharacterSelect(pressurePlate);
      break;
    }

    case ChangeCharOrderPhase.BUILD_VETO: {
      checkPressedPhaseBuildVeto(pressurePlate);
      break;
    }
  }
}

function checkPressedPhaseSeasonSelect(pressurePlate: GridEntityPressurePlate) {
  for (const [
    challengeCustomAbbreviation,
    seasonDescription,
  ] of CHANGE_CHAR_ORDER_POSITIONS_MAP) {
    const buttonPosition = gridCoordinatesToWorldPosition(
      seasonDescription.X,
      seasonDescription.Y,
    );
    if (
      pressurePlate.State === PressurePlateState.PRESSURE_PLATE_PRESSED &&
      pressurePlate.Position.X === buttonPosition.X &&
      pressurePlate.Position.Y === buttonPosition.Y
    ) {
      seasonButtonPressed(challengeCustomAbbreviation);
      return;
    }
  }
}

function seasonButtonPressed(
  challengeCustomAbbreviation: ChallengeCustomAbbreviation,
) {
  const gameFrameCount = game.GetFrameCount();

  const newPhase =
    challengeCustomAbbreviation === ChallengeCustomAbbreviation.SEASON_2
      ? ChangeCharOrderPhase.BUILD_VETO
      : ChangeCharOrderPhase.CHARACTER_SELECT;
  v.room.phase = newPhase;
  v.room.challengeCustomAbbreviation = challengeCustomAbbreviation;

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

  seasonDescription.charPositions.forEach((charPosition, i) => {
    const { x, y } = charPosition;
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

  const charPosition = seasonDescription.charPositions[i];
  if (charPosition === undefined) {
    error(`Failed to find the positions for character: ${i}`);
  }
  const { character } = charPosition;
  v.room.charOrder.push(character);

  // Mark that we have pressed this button.
  gridEntity.VarData = 1;

  // Change the graphic to that of a number.
  const sprite = v.room.sprites.characters[i];
  if (sprite === undefined) {
    error(`Failed to find the sprite for character: ${i}`);
  }
  sprite.Load("gfx/timer/timer.anm2", true);
  sprite.SetFrame("Default", v.room.charOrder.length);
  setSpriteOpacity(sprite, 1); // Remove the fade.

  if (v.room.challengeCustomAbbreviation === "R7S1") {
    season1DeleteOtherCharButton(i);
  }

  // Check to see if this is our last character.
  if (v.room.charOrder.length === seasonDescription.numChars) {
    // We are done, so write the changes to persistent storage.
    if (v.room.challengeCustomAbbreviation === null) {
      error("challengeCustomAbbreviation was null.");
    }
    v.persistent.charOrders.set(
      v.room.challengeCustomAbbreviation,
      v.room.charOrder,
    );
    fadeOutToChallenge();
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
  const room = game.GetRoom();
  const seasonDescription = getSeasonDescription();

  const charPosition = seasonDescription.charPositions[i];
  if (charPosition === undefined) {
    error(`Failed to find the positions for character: ${i}`);
  }
  const { x, y } = charPosition;
  const position = gridCoordinatesToWorldPosition(x, y);
  const gridEntity = room.GetGridEntityFromPos(position);
  if (gridEntity !== undefined) {
    removeGridEntity(gridEntity, false);
  }

  // We also need to remove the sprite.
  v.room.sprites.characters[i] = Sprite();
}

function checkPressedPhaseBuildVeto(pressurePlate: GridEntityPressurePlate) {
  const seasonDescription = getSeasonDescription();

  if (seasonDescription.buildPositions === undefined) {
    error("buildPositions is undefined.");
  }

  seasonDescription.buildPositions.forEach((buildPosition, i) => {
    const { x, y } = buildPosition;
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

  const buildPosition = seasonDescription.buildPositions[i];
  if (buildPosition === undefined) {
    error(`Failed to find the positions for build: ${i}`);
  }
  const { buildIndex } = buildPosition;
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
    if (v.room.challengeCustomAbbreviation === null) {
      error("challengeCustomAbbreviation was null.");
    }
    v.persistent.charOrders.set(
      v.room.challengeCustomAbbreviation,
      v.room.buildsChosen as PlayerType[],
    );
    setBuildBansTime();
    fadeOutToChallenge();
  }
}

function fadeOutToChallenge() {
  game.Fadeout(0.05, FadeoutTarget.MAIN_MENU);

  if (v.room.challengeCustomAbbreviation === null) {
    v.room.challengeTarget = null;
  } else {
    v.room.challengeTarget =
      CHALLENGE_CUSTOM_ABBREVIATION_TO_CHALLENGE_CUSTOM[
        v.room.challengeCustomAbbreviation
      ];
  }
  v.room.resetRenderFrame = Isaac.GetFrameCount() + FADE_RENDER_FRAMES;
}
