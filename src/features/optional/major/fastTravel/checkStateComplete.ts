import g from "../../../../globals";
import { getPlayers } from "../../../../misc";
import { EffectVariantCustom } from "../../../../types/enums";
import { FADE_TO_BLACK_FRAMES, FAMES_BEFORE_JUMP } from "./constants";
import { FastTravelState } from "./enums";
import setNewState, { setPlayersVisible } from "./setNewState";

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  switch (g.run.fastTravel.state) {
    case FastTravelState.FadingToBlack: {
      postRenderFadingToBlack();
      break;
    }

    case FastTravelState.FadingIn: {
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

  if (g.run.fastTravel.framesPassed < FADE_TO_BLACK_FRAMES) {
    return;
  }

  // The FadingToBlack state is completed when the screen is completely black
  setNewState(FastTravelState.ChangingToSameRoom);
}

function postRenderFadingIn() {
  incrementFramesPassed();

  if (g.run.fastTravel.framesPassed === FAMES_BEFORE_JUMP) {
    resetPlayerCollision();
    setPlayersVisible(getPlayers(), true);
    makePlayersJump();
  }

  if (g.run.fastTravel.framesPassed < FADE_TO_BLACK_FRAMES) {
    return;
  }

  // The FadingToBlack state is completed when the screen is completely black
  setNewState(FastTravelState.Disabled);
}

function incrementFramesPassed() {
  // Only increment the fade timer if the game is not paused
  // To avoid this, we could base the timer on game frames, but that does not result in a smooth
  // enough fade out (because it is only updated on every other render frame)
  if (!g.g.IsPaused()) {
    g.run.fastTravel.framesPassed += 1;
  }
}

function resetPlayerCollision() {
  // Set the collision for all players back to normal
  for (const player of getPlayers()) {
    player.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL;
  }
}

function makePlayersJump() {
  for (const player of getPlayers()) {
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
  switch (g.run.fastTravel.state) {
    case FastTravelState.ChangingToSameRoom: {
      postNewRoomChangingToSameRoom();
      break;
    }

    case FastTravelState.GoingToNewFloor: {
      postNewRoomGoingToNewFloor();
      break;
    }

    default: {
      break;
    }
  }
}

function postNewRoomChangingToSameRoom() {
  // The ChangingToSameRoom state is completed once we arrive in the new room
  setNewState(FastTravelState.GoingToNewFloor);
}

function postNewRoomGoingToNewFloor() {
  // The GoingToNewFloor state is completed once we arrive on the new floor
  setNewState(FastTravelState.FadingIn);
}
