import { DEFAULT_KCOLOR, Vector.Zero } from "../constants";
import g from "../globals";
import { ChallengeCustom, ChangeKeybindingsPhase } from "./enums";

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.CHANGE_KEYBINDINGS) {
    return;
  }

  if (RacingPlusData === null) {
    return;
  }

  // Wait a moment just in case they were mashing stuff while it was loading
  if (gameFrameCount < 1) {
    return;
  }

  if (
    g.changeKeybindings.challengePhase ===
    ChangeKeybindingsPhase.START_TO_FADE_OUT
  ) {
    g.changeKeybindings.challengePhase = ChangeKeybindingsPhase.FINISHED;
    g.g.Fadeout(0.05, FadeoutTarget.FADEOUT_MAIN_MENU);
  } else if (
    g.changeKeybindings.challengePhase === ChangeKeybindingsPhase.FINISHED
  ) {
    return;
  }

  // Wait a moment if they just set a hotkey
  if (g.changeKeybindings.challengeFramePressed + 15 >= gameFrameCount) {
    return;
  }

  const hotkeyDrop = RacingPlusData.Get("hotkeyDrop") as int | undefined;
  const hotkeyDropTrinket = RacingPlusData.Get("hotkeyDropTrinket") as
    | int
    | undefined;
  const hotkeyDropPocket = RacingPlusData.Get("hotkeyDropPocket") as
    | int
    | undefined;
  const hotkeySwitch = RacingPlusData.Get("hotkeySwitch") as int | undefined;
  const hotkeyAutofire = RacingPlusData.Get("hotkeyAutofire") as
    | int
    | undefined;

  const text: string[] = [];
  switch (g.changeKeybindings.challengePhase) {
    case ChangeKeybindingsPhase.FAST_DROP: {
      if (hotkeyDrop === undefined || hotkeyDrop === 0) {
        text.push("The fast-drop hotkey is not bound.");
      } else {
        text.push("The fast-drop hotkey is currently bound to:");
        text.push(`${getKeyName(hotkeyDrop)} (code: ${hotkeyDrop})`);
      }
      break;
    }

    case ChangeKeybindingsPhase.FAST_DROP_TRINKET: {
      if (hotkeyDropTrinket === undefined || hotkeyDropTrinket === 0) {
        text.push("The fast-drop (trinket-only) hotkey is not bound.");
      } else {
        text.push("The fast-drop (trinket-only) hotkey is currently bound to:");
        text.push(
          `${getKeyName(hotkeyDropTrinket)} (code: ${hotkeyDropTrinket})`,
        );
      }
      break;
    }

    case ChangeKeybindingsPhase.FAST_DROP_POCKET: {
      if (hotkeyDropPocket === undefined || hotkeyDropPocket === 0) {
        text.push("The fast-drop (pocket-item-only) hotkey is not bound.");
      } else {
        text.push(
          "The fast-drop (pocket-item-only) hotkey is currently bound to:",
        );
        text.push(
          `${getKeyName(hotkeyDropPocket)} (code: ${hotkeyDropPocket})`,
        );
      }
      break;
    }

    case ChangeKeybindingsPhase.SCHOOLBAG_SWITCH: {
      if (hotkeySwitch === undefined || hotkeySwitch === 0) {
        text.push("The Schoolbag-switch hotkey is not bound.");
      } else {
        text.push("The Schoolbag-switch hotkey is currently bound to:");
        text.push(`${getKeyName(hotkeySwitch)} (code: ${hotkeySwitch})`);
      }
      break;
    }

    case ChangeKeybindingsPhase.AUTOFIRE: {
      if (hotkeyAutofire === undefined || hotkeyAutofire === 0) {
        text.push("The autofire hotkey is not bound.");
      } else {
        text.push("The autofire hotkey is currently bound to:");
        text.push(`${getKeyName(hotkeyAutofire)} (code: ${hotkeyAutofire})`);
      }
      break;
    }

    default: {
      break;
    }
  }

  if (text.length < 2) {
    text.push("");
  }

  text.push("");
  text.push("Press the desired key now.");
  text.push("Or press F12 to keep the vanilla behavior.");
  text.push("(For controller players, you must bind these");
  text.push("to a keyboard key && ) { use Joy2Key.)");

  for (let i = 0; i < text.length; i++) {
    const line = text[i];
    const y = 50 + 20 * (i + 1);
    g.font.DrawString(line, 100, y, DEFAULT_KCOLOR, 0, true);
  }

  // We only check controller ID 0 (i.e. the keyboard)
  for (const [, value] of pairs(Keyboard)) {
    if (Input.IsButtonPressed(value, 0)) {
      switch (g.changeKeybindings.challengePhase) {
        case ChangeKeybindingsPhase.FAST_DROP: {
          setRacingPlusDataAndSetFrame("hotkeyDrop", value);
          g.changeKeybindings.challengePhase =
            ChangeKeybindingsPhase.FAST_DROP_TRINKET;
          break;
        }

        case ChangeKeybindingsPhase.FAST_DROP_TRINKET: {
          setRacingPlusDataAndSetFrame("hotkeyDropTrinket", value);
          g.changeKeybindings.challengePhase =
            ChangeKeybindingsPhase.FAST_DROP_POCKET;
          break;
        }

        case ChangeKeybindingsPhase.FAST_DROP_POCKET: {
          setRacingPlusDataAndSetFrame("hotkeyDropPocket", value);
          g.changeKeybindings.challengePhase =
            ChangeKeybindingsPhase.SCHOOLBAG_SWITCH;
          break;
        }

        case ChangeKeybindingsPhase.SCHOOLBAG_SWITCH: {
          setRacingPlusDataAndSetFrame("hotkeySwitch", value);
          g.changeKeybindings.challengePhase = ChangeKeybindingsPhase.AUTOFIRE;
          break;
        }

        case ChangeKeybindingsPhase.AUTOFIRE: {
          setRacingPlusDataAndSetFrame("hotkeyAutofire", value);
          g.changeKeybindings.challengePhase =
            ChangeKeybindingsPhase.START_TO_FADE_OUT;
          break;
        }

        default: {
          break;
        }
      }
    }
  }
}

function getKeyName(keyCode: int) {
  for (const [key, value] of pairs(Keyboard)) {
    if (value === keyCode) {
      return key.substring(4); // Chop off the "KEY_" prefix
    }
  }

  return "not found";
}

function setRacingPlusDataAndSetFrame(key: string, value: int) {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  if (value === Keyboard.KEY_F12) {
    value = 0;
  }
  RacingPlusData.Set(key, value);

  g.changeKeybindings.challengeFramePressed = gameFrameCount;
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.CHANGE_KEYBINDINGS) {
    return;
  }

  if (RacingPlusData === null) {
    return;
  }

  if (g.run.roomsEntered === 1) {
    Isaac.ExecuteCommand("stage 1a"); // The Cellar is the cleanest floor
    g.run.goingToDebugRoom = true;
    Isaac.ExecuteCommand("goto d.0"); // We do more things in the next "PostNewRoom" callback
    return;
  }

  if (g.run.roomsEntered !== 2) {
    return;
  }

  // Remove all enemies
  for (const entity of Isaac.GetRoomEntities()) {
    const npc = entity.ToNPC();
    if (npc !== null) {
      entity.Remove();
    }
  }
  g.r.SetClear(true);

  // We want to trap the player in the room, so delete all 4 doors
  for (let i = 0; i < 4; i++) {
    g.r.RemoveDoor(i);
  }

  // Put the player next to the bottom door
  g.p.Position = Vector(320, 400);

  // Get rid of the HUD
  g.seeds.AddSeedEffect(SeedEffect.SEED_NO_HUD);

  // Make the player invisible
  g.p.Position = g.r.GetCenterPos();
  g.p.SpriteScale = Vector.Zero;

  // Reset variables used in the challenge
  g.changeKeybindings.challengePhase = ChangeKeybindingsPhase.FAST_DROP;
  g.changeKeybindings.challengeFramePressed = -100;
  Isaac.DebugString('Entered the "Change Keybindings" custom challenge.');
}
