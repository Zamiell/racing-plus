import { getPlayers } from "isaacscript-common";
import g from "../../../../globals";
import { EffectVariantCustom } from "../../../../types/enums";
import { FADE_TO_BLACK_FRAMES, FRAMES_BEFORE_JUMP } from "./constants";
import { FastTravelState } from "./enums";
import setNewState, { setPlayersVisible } from "./setNewState";
import v from "./v";

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  switch (v.run.state) {
    case FastTravelState.FADING_TO_BLACK: {
      postRenderFadingToBlack();
      break;
    }

    case FastTravelState.FADING_IN: {
      postRenderFadingIn();
      break;
    }

    default: {
      break;
    }
  }
}

function postRenderFadingToBlack() {
  incrementFramesPassed();

  if (v.run.framesPassed < FADE_TO_BLACK_FRAMES) {
    return;
  }

  // The FadingToBlack state is completed when the screen is completely black
  setNewState(FastTravelState.CHANGING_TO_STARTING_ROOM);
}

function postRenderFadingIn() {
  incrementFramesPassed();

  if (v.run.framesPassed === FRAMES_BEFORE_JUMP) {
    const players = getPlayers();

    resetPlayerCollision(players);
    setPlayersVisible(players, true);
    makePlayersJump(players);
  }

  if (v.run.framesPassed < FADE_TO_BLACK_FRAMES) {
    return;
  }

  // The FadingToBlack state is completed when the screen is completely black
  setNewState(FastTravelState.DISABLED);
}

function incrementFramesPassed() {
  // Only increment the fade timer if the game is not paused
  // To avoid this, we could base the timer on game frames, but that does not result in a smooth
  // enough fade out (because it is only updated on every other render frame)
  if (!g.g.IsPaused()) {
    v.run.framesPassed += 1;
  }
}

function resetPlayerCollision(players: EntityPlayer[]) {
  // Set the collision for all players back to normal
  for (const player of players) {
    player.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL;
  }
}

function makePlayersJump(players: EntityPlayer[]) {
  for (const player of players) {
    // Play the jumping out of the hole animation
    player.PlayExtraAnimation("Jump");
  }

  // Make the hole(s) disappear
  const pitfalls = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariantCustom.PITFALL_CUSTOM,
  );
  for (const pitfall of pitfalls) {
    const sprite = pitfall.GetSprite();
    sprite.Play("Disappear", true);
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  switch (v.run.state) {
    case FastTravelState.CHANGING_TO_STARTING_ROOM: {
      postNewRoomChangingToStartingRoom();
      break;
    }

    case FastTravelState.GOING_TO_NEW_FLOOR: {
      postNewRoomGoingToNewFloor();
      break;
    }

    default: {
      break;
    }
  }
}

function postNewRoomChangingToStartingRoom() {
  // The ChangingToStartingRoom state is completed once we arrive in the new room
  setNewState(FastTravelState.GOING_TO_NEW_FLOOR);
}

function postNewRoomGoingToNewFloor() {
  // The GoingToNewFloor state is completed once we arrive on the new floor
  setNewState(FastTravelState.FADING_IN);
}