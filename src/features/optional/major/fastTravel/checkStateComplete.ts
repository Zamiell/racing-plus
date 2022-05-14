import { EntityCollisionClass } from "isaac-typescript-definitions";
import { ensureAllCases, getEffects, getPlayers } from "isaacscript-common";
import { EffectVariantCustom } from "../../../../enums/EffectVariantCustom";
import { FastTravelState } from "../../../../enums/FastTravelState";
import g from "../../../../globals";
import { isDreamCatcherWarping } from "../../quality/showDreamCatcherItem/v";
import { FADE_TO_BLACK_FRAMES, FRAMES_BEFORE_JUMP } from "./constants";
import { setNewFastTravelState, setPlayersVisible } from "./setNewState";
import v from "./v";

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  switch (v.run.state) {
    case FastTravelState.DISABLED: {
      return;
    }

    case FastTravelState.FADING_TO_BLACK: {
      postRenderFadingToBlack();
      return;
    }

    case FastTravelState.GOING_TO_NEW_FLOOR: {
      return;
    }

    case FastTravelState.FADING_IN: {
      postRenderFadingIn();
      return;
    }

    default: {
      ensureAllCases(v.run.state);
    }
  }
}

function postRenderFadingToBlack() {
  incrementFramesPassed();

  if (v.run.renderFramesPassed < FADE_TO_BLACK_FRAMES) {
    return;
  }

  // The FadingToBlack state is completed when the screen is completely black
  setNewFastTravelState(FastTravelState.GOING_TO_NEW_FLOOR);
}

function postRenderFadingIn() {
  incrementFramesPassed();

  if (v.run.renderFramesPassed === FRAMES_BEFORE_JUMP) {
    const players = getPlayers();

    resetPlayerCollision(players);
    setPlayersVisible(players, true);
    makePlayersJump(players);
  }

  if (v.run.renderFramesPassed < FADE_TO_BLACK_FRAMES) {
    return;
  }

  // The FadingToBlack state is completed when the screen is completely black.
  setNewFastTravelState(FastTravelState.DISABLED);
}

function incrementFramesPassed() {
  // Only increment the fade timer if the game is not paused. To avoid this, we could base the timer
  // on game frames, but that does not result in a smooth enough fade out (because it is only
  // updated on every other render frame).
  if (g.g.IsPaused()) {
    return;
  }

  // Defer the jump animation until later if we are warping to new rooms
  if (isDreamCatcherWarping()) {
    return;
  }

  v.run.renderFramesPassed += 1;
}

function resetPlayerCollision(players: EntityPlayer[]) {
  // Set the collision for all players back to normal.
  for (const player of players) {
    player.EntityCollisionClass = EntityCollisionClass.ALL;
  }
}

function makePlayersJump(players: EntityPlayer[]) {
  for (const player of players) {
    // Play the jumping out of the hole animation
    player.PlayExtraAnimation("Jump");
  }

  // Make the hole(s) disappear
  const customPitfalls = getEffects(EffectVariantCustom.PITFALL_CUSTOM);
  for (const customPitfall of customPitfalls) {
    const sprite = customPitfall.GetSprite();
    sprite.Play("Disappear", true);
  }
}
