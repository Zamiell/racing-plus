import {
  changeRoom,
  getPlayers,
  getRoomIndex,
  isRepentanceStage,
} from "isaacscript-common";
import g from "../../../../globals";
import { EffectVariantCustom } from "../../../../types/enums";
import { moveEsauNextToJacob } from "../../../../util";
import * as blackSprite from "./blackSprite";
import { FastTravelState } from "./enums";
import * as nextFloor from "./nextFloor";

export default function setNewState(fastTravelState: FastTravelState): void {
  g.run.fastTravel.state = fastTravelState;

  switch (fastTravelState) {
    case FastTravelState.FadingToBlack: {
      // "setFadingToBlack()" is manually called by other functions since it has extra arguments
      break;
    }

    case FastTravelState.ChangingToSameRoom: {
      setChangingToNewRoom();
      break;
    }

    case FastTravelState.GoingToNewFloor: {
      setGoingToNewFloor();
      break;
    }

    case FastTravelState.FadingIn: {
      setFadingIn();
      break;
    }

    case FastTravelState.Disabled: {
      setDisabled();
      break;
    }

    default: {
      break;
    }
  }
}

export function setFadingToBlack(
  entity: GridEntity | EntityEffect,
  player: EntityPlayer,
  upwards: boolean,
): void {
  const roomIndex = getRoomIndex();

  // Begin the process of moving the player to the next floor
  // If this is a multiplayer game, only the player who touched the trapdoor / heaven door will play
  // the travelling animation
  g.run.fastTravel.state = FastTravelState.FadingToBlack;
  g.run.fastTravel.framesPassed = 0;
  g.run.fastTravel.upwards = upwards;
  g.run.fastTravel.blueWomb = roomIndex === GridRooms.ROOM_BLUE_WOOM_IDX;
  g.run.fastTravel.theVoid = roomIndex === GridRooms.ROOM_THE_VOID_IDX;
  g.run.fastTravel.repentanceSecretExit =
    roomIndex === GridRooms.ROOM_SECRET_EXIT_IDX;

  setGameStateFlags();
  setPlayerAttributes(player, entity.Position);
  warpForgottenBody(player);
  dropTaintedForgotten(player);
  playTravellingAnimation(player, upwards);
}

function setGameStateFlags() {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const repentanceStage = isRepentanceStage();
  const roomIndex = getRoomIndex();

  // If the player has gone through the trapdoor past the strange door
  if (
    !repentanceStage &&
    stage === 6 &&
    roomIndex === GridRooms.ROOM_SECRET_EXIT_IDX
  ) {
    // Set the game state flag that results in Mausoleum 2 having Dad's Note at the end of it
    g.g.SetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH_INIT, true);
  }

  // If the player has gone through the custom trapdoor after the Mom fight in races to The Beast
  if (
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "The Beast" &&
    !repentanceStage &&
    stage === 6 &&
    roomType === RoomType.ROOM_BOSS
  ) {
    // Set the game state flag that results in Mausoleum 2 having Dad's Note at the end of it
    g.g.SetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH_INIT, true);

    // Furthermore, we want to prevent the new floor from being reseeded,
    // so pretend that the boss room with Mom in it is an Repentance secret exit
    // (even though Repentance floors are on the same stage, they do not need to be reseeded)
    g.run.fastTravel.repentanceSecretExit = true;
  }
}

function setPlayerAttributes(
  playerTouchedTrapdoor: EntityPlayer,
  position: Vector,
) {
  movePlayerToTrapdoor(playerTouchedTrapdoor, position);

  for (const player of getPlayers()) {
    // Freeze all players
    player.Velocity = Vector.Zero;

    // We don't want enemy attacks to move the players
    player.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
  }
}

function movePlayerToTrapdoor(player: EntityPlayer, position: Vector) {
  // Snap the player to the exact position of the trapdoor so that they cleanly jump down the hole
  // We also need to handle if Tainted Soul is holding Tainted Forgotten
  const shouldMoveOther = shouldMoveTaintedSoul(player);

  player.Position = position;
  if (shouldMoveOther) {
    const taintedSoul = player.GetOtherTwin();
    taintedSoul.Position = position;
  }
}

function shouldMoveTaintedSoul(player: EntityPlayer) {
  const character = player.GetPlayerType();

  // If Tainted Soul jumps down a trapdoor or heaven door while holding Tainted Forgotten,
  // the player object that gets to this function will be The Forgotten
  if (character === PlayerType.PLAYER_THEFORGOTTEN_B) {
    const taintedSoul = player.GetOtherTwin();
    return (
      player.Position.X === taintedSoul.Position.X &&
      player.Position.Y === taintedSoul.Position.Y
    );
  }

  return false;
}

function warpForgottenBody(player: EntityPlayer) {
  // If The Soul is travelling to the next floor, the Forgotten body will also need to be teleported
  if (player.GetPlayerType() !== PlayerType.PLAYER_THESOUL) {
    return;
  }

  // If we change the position of the Forgotten Body manually,
  // it will warp back to the same spot on the next frame
  // Instead, manually switch to the Forgotten to avoid this bug
  g.run.switchForgotten = true;

  // Also warp the body to where The Soul is so that The Forgotten won't jump down through a normal
  // floor
  const forgottenBodies = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.FORGOTTEN_BODY,
  );
  for (const forgottenBody of forgottenBodies) {
    forgottenBody.Position = player.Position;
  }
}

function dropTaintedForgotten(player: EntityPlayer) {
  const character = player.GetPlayerType();
  if (character === PlayerType.PLAYER_THEFORGOTTEN_B) {
    const taintedSoul = player.GetOtherTwin();
    taintedSoul.ThrowHeldEntity(Vector.Zero);
  }
}

function playTravellingAnimation(player: EntityPlayer, upwards: boolean) {
  const character = player.GetPlayerType();

  // Playing the vanilla animations results in the player re-appearing,
  // because the animations are not long enough to last for the full fade-out
  // Use custom animations instead that are 40 frames long
  let animation: string;
  if (upwards) {
    // The vanilla "LightTravel" animation is 28 frames long
    animation = "LightTravelCustom";
  } else {
    // The vanilla "Trapdoor" animation is 16 frames long
    animation = "TrapdoorCustom";
  }
  player.PlayExtraAnimation(animation);

  // If Tainted Forgotten is overlapping with Tainted Soul,
  // playing two jumping animations does not work
  // Instead, just make Tainted Soul invisible
  // (it will automatically become visible again when we reach the next floor)
  if (character === PlayerType.PLAYER_THEFORGOTTEN_B) {
    const taintedSoul = player.GetOtherTwin();
    if (
      player.Position.X === taintedSoul.Position.X &&
      player.Position.Y === taintedSoul.Position.Y
    ) {
      taintedSoul.Visible = false;
    }
  }
}

function setChangingToNewRoom() {
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  blackSprite.setFullyOpaque();

  // Before moving to the next floor, we need to change the room so that health from a Strength
  // card is properly decremented
  // We arbitrarily use the starting room for this
  changeRoom(startingRoomIndex);
}

function setGoingToNewFloor() {
  nextFloor.goto(g.run.fastTravel.upwards);
}

function setFadingIn() {
  const players = getPlayers();

  g.run.fastTravel.framesPassed = 0;

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

  // By default, Jacob and Esau will spawn offset from each other
  // Instead, make them spawn together in the center of the room like what happens when starting a
  // new run
  const jacobs = Isaac.FindByType(
    EntityType.ENTITY_PLAYER,
    0,
    PlayerType.PLAYER_JACOB,
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

  // By default, Tainted Forgotten and Tainted Soul will spawn offset from each other
  // Instead, make them spawn together in the center of the room like what happens when starting a
  // new run
  const taintedForgottens = Isaac.FindByType(
    EntityType.ENTITY_PLAYER,
    0,
    PlayerType.PLAYER_THEFORGOTTEN_B,
  );
  for (const taintedForgotten of taintedForgottens) {
    const player = taintedForgotten.ToPlayer();
    if (player !== null) {
      taintedForgotten.Position = centerPos;
      const taintedSoul = player.GetOtherTwin();
      taintedSoul.Position = centerPos;
    }
  }
}

function spawnHoles(players: EntityPlayer[]) {
  // Spawn a hole for each player to jump out of
  for (const player of players) {
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariantCustom.PITFALL_CUSTOM,
      0,
      player.Position,
      Vector.Zero,
      null,
    );
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
}
