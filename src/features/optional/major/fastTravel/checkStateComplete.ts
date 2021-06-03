import g from "../../../../globals";
import { changeRoom, getPlayers } from "../../../../misc";
import { EffectVariantCustom } from "../../../../types/enums";
import * as blackSprite from "./blackSprite";
import { FADE_TO_BLACK_FRAMES, FAMES_BEFORE_JUMP } from "./constants";
import { FastTravelState } from "./enums";
import * as nextFloor from "./nextFloor";

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
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  incrementFramesPassed();

  if (g.run.fastTravel.framesPassed < FADE_TO_BLACK_FRAMES) {
    return;
  }

  // The FadingToBlack state is completed when the screen is completely black
  g.run.fastTravel.state = FastTravelState.ChangingToSameRoom;

  blackSprite.setFullyOpaque();

  // Before moving to the next floor, we need to change the room so that health from a Strength card
  // is properly decremented
  changeRoom(startingRoomIndex);
}

function postRenderFadingIn() {
  incrementFramesPassed();

  if (g.run.fastTravel.framesPassed === FAMES_BEFORE_JUMP) {
    makePlayersJump();
  }

  if (g.run.fastTravel.framesPassed < FADE_TO_BLACK_FRAMES) {
    return;
  }

  // The FadingToBlack state is completed when the screen is completely black
  g.run.fastTravel.state = FastTravelState.Disabled;

  blackSprite.setFullyTransparent();
  nextFloor.mobilizeAllPlayers();
}

function incrementFramesPassed() {
  // Only increment the fade timer if the game is not paused
  // To avoid this, we could base the timer on game frames, but that does not result in a smooth
  // enough fade out (because it is only updated on every other render frame)
  if (!g.g.IsPaused()) {
    g.run.fastTravel.framesPassed += 1;
  }
}

function makePlayersJump() {
  for (const player of getPlayers()) {
    // Play the jumping out of the hole animation
    player.PlayExtraAnimation("Jump");
  }

  // Make the hole disappear
  const pitfalls = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariantCustom.PITFALL_CUSTOM,
    -1,
    false,
    false,
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
  g.run.fastTravel.state = FastTravelState.GoingToNewFloor;

  nextFloor.goto(g.run.fastTravel.upwards);
}

function postNewRoomGoingToNewFloor() {
  // The GoingToNewFloor state is completed once we arrive on the new floor
  g.run.fastTravel.state = FastTravelState.FadingIn;
  g.run.fastTravel.framesPassed = 0;

  // Spawn a hole for the player to jump out of
  Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariantCustom.PITFALL_CUSTOM,
    0,
    g.p.Position,
    Vector.Zero,
    null,
  );
}
