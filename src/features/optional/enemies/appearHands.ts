import g from "../../../globals";
import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_NPC_UPDATE (0)
// EntityType.ENTITY_MOMS_HAND (213)
export function postNPCUpdateMomsHand(npc: EntityNPC): void {
  if (!config.appearHands) {
    return;
  }

  postNPCUpdate(npc);
}

// ModCallbacks.MC_NPC_UPDATE (0)
// EntityType.ENTITY_MOMS_DEAD_HAND (287)
export function postNPCUpdateMomsDeadHand(npc: EntityNPC): void {
  if (!config.appearHands) {
    return;
  }

  postNPCUpdate(npc);
}

function postNPCUpdate(npc: EntityNPC) {
  // Play a custom "Appear" animation when they first spawn
  // This cannot be in the PostNPCInit callback because when done there,
  // a shadow will appear below the hand, which does not look very good,
  // and I don't know of a way to remove the shadow
  if (npc.FrameCount === 0) {
    const sprite = npc.GetSprite();
    sprite.Play("Appear", true);
  }
}

// ModCallbacks.MC_PRE_NPC_UPDATE (69)
// EntityType.ENTITY_MOMS_HAND (213)
export function preNPCUpdateMomsHand(npc: EntityNPC): boolean | void {
  if (!config.appearHands) {
    return undefined;
  }

  return preNPCUpdate(npc);
}

// ModCallbacks.MC_PRE_NPC_UPDATE (69)
// EntityType.ENTITY_MOMS_DEAD_HAND (287)
export function preNPCUpdateMomsDeadHand(npc: EntityNPC): boolean | void {
  if (!config.appearHands) {
    return undefined;
  }

  return preNPCUpdate(npc);
}

function preNPCUpdate(npc: EntityNPC) {
  const sprite = npc.GetSprite();

  // Ignore the normal AI when it is playing the custom "Appear" animation
  if (sprite.IsPlaying("Appear")) {
    return true;
  }

  return undefined;
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.appearHands) {
    return;
  }

  // Mute the audio tell of Mom laughing, since it is obnoxious
  g.sfx.Stop(SoundEffect.SOUND_MOM_VOX_EVILLAUGH);
}
