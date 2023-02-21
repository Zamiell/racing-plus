import {
  ButtonAction,
  EntityCollisionClass,
  EntityType,
  FamiliarVariant,
  GameStateFlag,
  LevelStage,
  PlayerType,
  PlayerVariant,
} from "isaac-typescript-definitions";
import {
  changeRoom,
  game,
  getFamiliars,
  getPlayers,
  getRoomGridIndex,
  inSecretExit,
  isCharacter,
  log,
  onRepentanceStage,
  ReadonlySet,
  spawnEffect,
  VectorZero,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { EffectVariantCustom } from "../../../../enums/EffectVariantCustom";
import { FastTravelState } from "../../../../enums/FastTravelState";
import { RaceGoal } from "../../../../enums/RaceGoal";
import { RacerStatus } from "../../../../enums/RacerStatus";
import { RaceStatus } from "../../../../enums/RaceStatus";
import { g } from "../../../../globals";
import { mod } from "../../../../mod";
import { moveEsauNextToJacob } from "../../../../utils";
import { inClearedMomBossRoom } from "../../../../utilsGlobals";
import {
  planetariumFixBeginWarp,
  shouldApplyPlanetariumFix,
} from "../../../mandatory/planetariumFix";
import { INVERTED_TRAPDOOR_GRID_INDEX } from "../../../speedrun/season3/callbacks/preItemPickup";
import { decrementNumRoomsEntered } from "../../../utils/numRoomsEntered";
import * as blackSprite from "./blackSprite";
import { FAST_TRAVEL_DEBUG, FAST_TRAVEL_FEATURE_NAME } from "./constants";
import { NORMAL_TRAPDOOR_GRID_INDEX } from "./fastTravel";
import * as nextFloor from "./nextFloor";
import { v } from "./v";

export function setNewFastTravelState(fastTravelState: FastTravelState): void {
  v.run.state = fastTravelState;
  logFastTravelStateChanged();

  switch (fastTravelState) {
    case FastTravelState.FADING_TO_BLACK: {
      // `setFadingToBlack` is manually called by other functions since it has extra arguments.
      break;
    }

    case FastTravelState.GOING_TO_NEW_FLOOR: {
      setGoingToNewFloor();
      break;
    }

    case FastTravelState.FADING_IN: {
      setFadingIn();
      break;
    }

    case FastTravelState.DISABLED: {
      setDisabled();
      break;
    }
  }
}

export function setFadingToBlack(
  player: EntityPlayer,
  position: Vector,
  upwards: boolean,
): void {
  // Begin the process of moving the player to the next floor. If this is a multiplayer game, only
  // the player who touched the trapdoor / heaven door will play the traveling animation.
  v.run.state = FastTravelState.FADING_TO_BLACK;
  v.run.renderFramesPassed = 0;
  v.run.upwards = upwards;
  v.run.repentanceSecretExit = inSecretExit();
  logFastTravelStateChanged();

  const whitelist = new ReadonlySet([
    // Allow the player to toggle the map.
    ButtonAction.MAP,

    // Allow the player to save & quit in order to e.g. get a soul heart from a Monstro.
    ButtonAction.PAUSE,
  ]);
  mod.disableAllInputsExceptFor(FAST_TRAVEL_FEATURE_NAME, whitelist);

  setGameStateFlags(position);
  setPlayerAttributes(player, position);
  warpForgottenBody(player);
  dropTaintedForgotten(player);
  playTravelingAnimation(player, upwards);
}

function setGameStateFlags(position: Vector) {
  const stage = g.l.GetStage();

  // If the player has gone through the trapdoor past the strange door.
  if (stage === LevelStage.DEPTHS_2 && !onRepentanceStage() && inSecretExit()) {
    // Set the game state flag that results in Mausoleum 2 having Dad's Note at the end of it.
    game.SetStateFlag(GameStateFlag.BACKWARDS_PATH_INIT, true);
  }

  // If the player has gone through the custom trapdoor after the Mom fight in races to The Beast or
  // on Season 3.
  if (goingToMausoleum2ThroughCustomTrapdoor(position)) {
    // Set the game state flag that results in Mausoleum 2 having Dad's Note at the end of it.
    game.SetStateFlag(GameStateFlag.BACKWARDS_PATH_INIT, true);

    // Furthermore, we want to prevent the new floor from being reseeded, so pretend that the boss
    // room with Mom in it is a Repentance secret exit. (Even though Repentance floors are on the
    // same stage, they do not need to be reseeded.)
    v.run.repentanceSecretExit = true;
  }

  if (goingToCorpse1ThroughCustomTrapdoor(position)) {
    game.SetStateFlag(GameStateFlag.MAUSOLEUM_HEART_KILLED, true);
  }
}

function goingToMausoleum2ThroughCustomTrapdoor(position: Vector): boolean {
  const gridIndex = g.r.GetGridIndex(position);
  const challenge = Isaac.GetChallenge();
  const repentanceStage = onRepentanceStage();
  const clearedMomBossRoom = inClearedMomBossRoom();

  return (
    ((g.race.status === RaceStatus.IN_PROGRESS &&
      g.race.myStatus === RacerStatus.RACING &&
      g.race.goal === RaceGoal.THE_BEAST &&
      gridIndex === NORMAL_TRAPDOOR_GRID_INDEX) ||
      (challenge === ChallengeCustom.SEASON_3 &&
        gridIndex === INVERTED_TRAPDOOR_GRID_INDEX)) &&
    clearedMomBossRoom &&
    !repentanceStage
  );
}

function goingToCorpse1ThroughCustomTrapdoor(position: Vector): boolean {
  const gridIndex = g.r.GetGridIndex(position);
  const challenge = Isaac.GetChallenge();
  const repentanceStage = onRepentanceStage();
  const clearedMomBossRoom = inClearedMomBossRoom();

  return (
    challenge === ChallengeCustom.SEASON_3 &&
    gridIndex === NORMAL_TRAPDOOR_GRID_INDEX &&
    clearedMomBossRoom &&
    repentanceStage
  );
}

function setPlayerAttributes(
  playerTouchedTrapdoor: EntityPlayer,
  position: Vector,
) {
  movePlayerToTrapdoor(playerTouchedTrapdoor, position);

  for (const player of getPlayers()) {
    // Freeze all players.
    player.Velocity = VectorZero;

    // We don't want enemy attacks to move the players.
    player.EntityCollisionClass = EntityCollisionClass.NONE;
  }
}

function movePlayerToTrapdoor(player: EntityPlayer, position: Vector) {
  // Snap the player to the exact position of the trapdoor so that they cleanly jump down the hole.
  // We also need to handle if Tainted Soul is holding Tainted Forgotten.
  const shouldMoveOther = shouldMoveTaintedSoul(player);

  player.Position = position;
  if (shouldMoveOther) {
    const taintedSoul = player.GetOtherTwin();
    if (taintedSoul !== undefined) {
      taintedSoul.Position = position;
    }
  }
}

function shouldMoveTaintedSoul(player: EntityPlayer) {
  if (!isCharacter(player, PlayerType.FORGOTTEN_B)) {
    return false;
  }

  const taintedSoul = player.GetOtherTwin();
  if (taintedSoul === undefined) {
    return false;
  }

  // If Tainted Soul jumps down a trapdoor or heaven door while holding Tainted Forgotten, the
  // player object that gets to this function will be The Forgotten.
  return (
    player.Position.X === taintedSoul.Position.X &&
    player.Position.Y === taintedSoul.Position.Y
  );
}

/**
 * If The Soul is traveling to the next floor, the Forgotten body will also need to be teleported.
 */
function warpForgottenBody(player: EntityPlayer) {
  if (!isCharacter(player, PlayerType.SOUL)) {
    return;
  }

  // If the player has Birthright, the Forgotten body might not be in this room. If this is the
  // case, do nothing.
  const forgottenBodies = getFamiliars(FamiliarVariant.FORGOTTEN_BODY);
  if (forgottenBodies.length === 0) {
    return;
  }

  // If we change the position of the Forgotten body manually, it will warp back to the same spot on
  // the next frame. Instead, manually switch to the Forgotten to avoid this bug.
  mod.forgottenSwitch(player);

  // Also warp the body to where The Soul is so that The Forgotten won't jump down through a
  // non-trapdoor tile.
  for (const forgottenBody of forgottenBodies) {
    forgottenBody.Position = player.Position;
  }
}

function dropTaintedForgotten(player: EntityPlayer) {
  if (isCharacter(player, PlayerType.FORGOTTEN_B)) {
    const taintedSoul = player.GetOtherTwin();
    if (taintedSoul !== undefined) {
      taintedSoul.ThrowHeldEntity(VectorZero);
    }
  }
}

function playTravelingAnimation(player: EntityPlayer, upwards: boolean) {
  // Playing the vanilla animations results in the player re-appearing, because the animations are
  // not long enough to last for the full fade-out. Instead, use custom animations that are 40
  // frames long.
  let animation: string;
  if (upwards) {
    // The vanilla "LightTravel" animation is 28 frames long.
    animation = "LightTravelCustom";
  } else {
    // The vanilla "Trapdoor" animation is 16 frames long.
    animation = "TrapdoorCustom";
  }
  player.PlayExtraAnimation(animation);

  // If Tainted Forgotten is overlapping with Tainted Soul, playing two jumping animations does not
  // work. Instead, just make Tainted Soul invisible. (They will automatically become visible again
  // when we reach the next floor.)
  if (isCharacter(player, PlayerType.FORGOTTEN_B)) {
    const taintedSoul = player.GetOtherTwin();
    if (
      taintedSoul !== undefined &&
      taintedSoul.Position.X === player.Position.X &&
      taintedSoul.Position.Y === player.Position.Y
    ) {
      taintedSoul.Visible = false;
    }
  }
}

function setGoingToNewFloor() {
  const roomGridIndex = getRoomGridIndex();

  blackSprite.setFullyOpaque();

  // Before moving to the next floor, we need to change the room so that health from a Strength card
  // is properly decremented. We arbitrarily reload the current room (instead of e.g. teleporting to
  // the starting room of the floor) so that the room type and room grid index remain unchanged for
  // the purposes of calculating the next stage and stage type.
  changeRoom(roomGridIndex);
  decrementNumRoomsEntered(); // This should not count as entering a room.
  // (Technically, we only need to change the room if the player has used a Strength card, which
  // will be the exception rather than the norm. However, if we do not change the room, a weird bug
  // can occur where the location of the wall on the new floor can get messed up. This can be
  // observed when going from Sheol to the Dark Room. By unconditionally changing the room before
  // executing the stage transition, this bug goes away.)

  // Defer going to the next floor if we need to visit other rooms first. (The
  // "finishGoingToNewFloor" function will be manually called later in the PostUpdate callback.)
  if (shouldApplyPlanetariumFix()) {
    planetariumFixBeginWarp();
    return;
  }

  finishGoingToNewFloor();
}

/**
 * In some situations, we manually interrupt fast-travel before going to the next floor. Splitting
 * the final logic into a separate function allows other features to resume fast-travel.
 */
export function finishGoingToNewFloor(): void {
  nextFloor.goto(v.run.upwards);
  setNewFastTravelState(FastTravelState.FADING_IN);
}

function setFadingIn() {
  const players = getPlayers();

  v.run.renderFramesPassed = 0;

  adjustJacobAndEsau(players);
  adjustTaintedForgotten(players);
  spawnHoles(players);
  setPlayersVisible(players, false);
}

function adjustJacobAndEsau(players: EntityPlayer[]) {
  if (players.length !== 2) {
    return;
  }

  const centerPos = g.r.GetCenterPos();

  // By default, Jacob and Esau will spawn offset from each other. Instead, make them spawn together
  // in the center of the room like what happens when starting a new run.
  const jacobs = Isaac.FindByType(
    EntityType.PLAYER,
    PlayerVariant.PLAYER,
    PlayerType.JACOB,
  );
  for (const jacob of jacobs) {
    jacob.Position = centerPos;
  }
  moveEsauNextToJacob();
}

function adjustTaintedForgotten(players: EntityPlayer[]) {
  if (players.length !== 2) {
    return;
  }

  const centerPos = g.r.GetCenterPos();

  // By default, Tainted Forgotten and Tainted Soul will spawn offset from each other. Instead, make
  // them spawn together in the center of the room like what happens when starting a new run.
  const taintedForgottens = Isaac.FindByType(
    EntityType.PLAYER,
    PlayerVariant.PLAYER,
    PlayerType.FORGOTTEN_B,
  );
  for (const taintedForgotten of taintedForgottens) {
    const player = taintedForgotten.ToPlayer();
    if (player === undefined) {
      continue;
    }

    taintedForgotten.Position = centerPos;
    const taintedSoul = player.GetOtherTwin();
    if (taintedSoul !== undefined) {
      taintedSoul.Position = centerPos;
    }
  }
}

export function spawnHoles(players: EntityPlayer[]): void {
  // Spawn a hole for each player to jump out of.
  for (const player of players) {
    spawnEffect(EffectVariantCustom.PITFALL_CUSTOM, 0, player.Position);
  }
}

export function setPlayersVisible(
  players: EntityPlayer[],
  visible: boolean,
): void {
  for (const player of players) {
    player.Visible = visible;
  }
}

function setDisabled() {
  blackSprite.setFullyTransparent();
  mod.enableAllInputs(FAST_TRAVEL_FEATURE_NAME);
}

function logFastTravelStateChanged() {
  if (FAST_TRAVEL_DEBUG) {
    log(
      `Fast-travel state changed: ${FastTravelState[v.run.state]} (${
        v.run.state
      })`,
    );
  }
}
