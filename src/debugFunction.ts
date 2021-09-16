import { isKeyboardPressed } from "isaacscript-common";
import g from "./globals";

const DEBUG_HOTKEY = Keyboard.KEY_F2;

let debugHotkeyPressed = false;

export default function debugFunction(): void {
  g.debug = true;
}

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  if (!g.debug) {
    return;
  }

  if (isKeyboardPressed(DEBUG_HOTKEY)) {
    if (!debugHotkeyPressed) {
      hotkeyFunction();
    }
    debugHotkeyPressed = true;
  } else {
    debugHotkeyPressed = false;
  }
}

function hotkeyFunction() {}

// ModCallbacks.MC_POST_FAMILIAR_RENDER (25)
export function postFamiliarRender(_familiar: EntityFamiliar): void {
  // const text = `State: ${familiar.State}`;
  // const text = `Position: ${familiar.Position.X}, ${familiar.Position.Y}`;
  // const text = `Animation: ${familiar.GetSprite().GetAnimation()}`;
  // const text = `Visible: ${familiar.IsVisible()}`;
  // const position = Isaac.WorldToRenderPosition(familiar.Position);
  // Isaac.RenderText(text, position.X, position.Y, 1, 1, 1, 1);
}

// ModCallbacks.MC_POST_NPC_RENDER (28)
export function postNPCRender(_npc: EntityNPC): void {
  /*
  if (npc.Parent !== undefined) {
    return;
  }
  */
  // const text = `State: ${npc.State}, StateFrame: ${npc.StateFrame}, I1: ${npc.I1}, I2: ${npc.I2}, V1: ${npc.V1}, V2: ${npc.V2}`;
  // const sprite = npc.GetSprite();
  // const animation = sprite.GetAnimation();
  // const text = `Animation: ${animation}`;
  // const position = Isaac.WorldToRenderPosition(npc.Position);
  // Isaac.RenderText(text, position.X, position.Y, 1, 1, 1, 1);
}

// ModCallbacks.MC_POST_EFFECT_RENDER (56)
export function postEffectRender(_effect: EntityEffect): void {
  // const text = `State: ${effect.State}`;
  // const text = `Position: ${effect.Position.X}, ${effect.Position.Y}`;
  // const position = Isaac.WorldToRenderPosition(effect.Position);
  // Isaac.RenderText(text, position.X, position.Y, 1, 1, 1, 1);
}
