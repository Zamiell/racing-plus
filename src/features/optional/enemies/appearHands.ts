import g from "../../../globals";

// ModCallbacks.MC_NPC_UPDATE (0)
export function postNPCUpdate(npc: EntityNPC): void {
  if (!g.config.appearHands) {
    return;
  }

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
export function preNPCUpdate(npc: EntityNPC): boolean | null {
  if (!g.config.appearHands) {
    return null;
  }

  const sprite = npc.GetSprite();

  // Ignore the normal AI when it is playing the custom "Appear" animation
  if (sprite.IsPlaying("Appear")) {
    return true;
  }

  return null;
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!g.config.appearHands) {
    return;
  }

  // Mute the audio tell of Mom laughing, since it is obnoxious
  g.sfx.Stop(SoundEffect.SOUND_MOM_VOX_EVILLAUGH);
}
