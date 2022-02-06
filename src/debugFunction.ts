import {
  isKeyboardPressed,
  log,
  logNewGlobals,
  printConsole,
} from "isaacscript-common";
import g from "./globals";
import { hotkeys } from "./modConfigMenu";

const DEBUG_HOTKEY = Keyboard.KEY_F2;
const DEBUG_HOTKEY2 = Keyboard.KEY_F3;

let debugHotkeyPressed = false;
let debugHotkey2Pressed = false;

function debugCode() {
  logNewGlobals();
}

export function debugFunction(): void {
  g.debug = true;
  // saveDataManagerSetGlobal();
  // setLogFunctionsGlobal();

  log("Entering debug function.");
  debugCode();
  log("Exiting debug function.");
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

  if (isKeyboardPressed(DEBUG_HOTKEY2)) {
    if (!debugHotkey2Pressed) {
      hotkey2Function();
    }
    debugHotkey2Pressed = true;
  } else {
    debugHotkey2Pressed = false;
  }
}

function hotkeyFunction() {}

function hotkey2Function() {
  hotkeys.fastDropAll = Keyboard.KEY_Z;
  hotkeys.autofire = Keyboard.KEY_F;
  hotkeys.roll = Keyboard.KEY_G;

  printConsole("Test hotkeys set.");
}

// ModCallbacks.MC_POST_FAMILIAR_RENDER (25)
export function postFamiliarRender(_familiar: EntityFamiliar): void {
  /*
  const text = `State: ${familiar.State}`;
  const text = `Position: ${familiar.Position.X}, ${familiar.Position.Y}`;
  const text = `Animation: ${familiar.GetSprite().GetAnimation()}`;
  const text = `Visible: ${familiar.IsVisible()}`;
  const position = Isaac.WorldToScreen(familiar.Position);
  Isaac.RenderText(text, position.X, position.Y, 1, 1, 1, 1);
  */
}

// ModCallbacks.MC_POST_NPC_RENDER (28)
export function postNPCRender(_npc: EntityNPC): void {
  /*
  const text = `State: ${npc.State}, StateFrame: ${npc.StateFrame}, I1: ${npc.I1}, I2: ${npc.I2}, V1: ${npc.V1}, V2: ${npc.V2}`;
  const position = Isaac.WorldToScreen(npc.Position);
  Isaac.RenderText(text, position.X, position.Y, 1, 1, 1, 1);
  */
}

// ModCallbacks.MC_POST_PLAYER_RENDER (32)
export function postPlayerRender(_player: EntityPlayer): void {
  /*
  const x = round(player.Velocity.X, 1);
  const y = round(player.Velocity.Y, 1);
  const text = `Velocity: ${x}, ${y}`;
  const position = Isaac.WorldToScreen(player.Position);
  Isaac.RenderText(text, position.X, position.Y, 1, 1, 1, 1);
  */
}

// ModCallbacks.MC_POST_EFFECT_RENDER (56)
export function postEffectRender(_effect: EntityEffect): void {
  /*
  const text = `State: ${effect.State}`;
  const text = `Position: ${effect.Position.X}, ${effect.Position.Y}`;
  const position = Isaac.WorldToScreen(effect.Position);
  Isaac.RenderText(text, position.X, position.Y, 1, 1, 1, 1);
  */
}
