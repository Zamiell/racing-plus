import { SoundEffect } from "isaac-typescript-definitions";
import { sfxManager } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallback.PRE_NPC_UPDATE (69)
// EntityType.MOMS_HAND (213)
export function preNPCUpdateMomsHand(npc: EntityNPC): boolean | undefined {
  if (!config.appearHands) {
    return undefined;
  }

  return preNPCUpdate(npc);
}

// ModCallback.PRE_NPC_UPDATE (69)
// EntityType.MOMS_DEAD_HAND (287)
export function preNPCUpdateMomsDeadHand(npc: EntityNPC): boolean | undefined {
  if (!config.appearHands) {
    return undefined;
  }

  return preNPCUpdate(npc);
}

function preNPCUpdate(npc: EntityNPC) {
  const sprite = npc.GetSprite();

  // Ignore the normal AI when it is playing the custom "Appear" animation.
  if (sprite.IsPlaying("Appear")) {
    return true;
  }

  return undefined;
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.appearHands) {
    return;
  }

  // Mute the audio tell of Mom laughing, since it is obnoxious.
  sfxManager.Stop(SoundEffect.MOM_VOX_EVIL_LAUGH);
}

// ModCallback.POST_NPC_INIT_LATE
// EntityType.MOMS_HAND (213)
export function postNPCInitLateMomsHand(npc: EntityNPC): void {
  if (!config.appearHands) {
    return;
  }

  playCustomAppearAnimation(npc);
}

// ModCallbackCustom.POST_NPC_INIT_LATE
// EntityType.MOMS_DEAD_HAND (287)
export function postNPCInitLateMomsDeadHand(npc: EntityNPC): void {
  if (!config.appearHands) {
    return;
  }

  playCustomAppearAnimation(npc);
}

/**
 * Play a custom animation when hands first spawn. (They jump up to the ceiling from the floor.)
 *
 * This cannot be in the `POST_NPC_INIT` callback because if it is done there, a shadow will appear
 * below the hand, which does not look very good, and I don't know of a way to remove the shadow.
 */
function playCustomAppearAnimation(npc: EntityNPC) {
  const sprite = npc.GetSprite();
  sprite.Play("Appear", true);
}
