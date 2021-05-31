import g from "../../globals";
import { SaveFileState } from "../../types/enums";
import { checkValidCharOrder, inSpeedrun } from "../speedrun/speedrun";

const STARTING_X = 115;
const STARTING_Y = 70;

declare const REPENTANCE: boolean | null;

export function postRender(): boolean {
  if (REPENTANCE === undefined) {
    drawNoRepentance();
    return true;
  }

  if (g.corrupted) {
    drawCorrupted();
    return true;
  }

  if (
    g.saveFile.state === SaveFileState.Finished &&
    !g.saveFile.fullyUnlocked
  ) {
    drawNotFullyUnlocked();
    return true;
  }

  if (inSpeedrun() && !checkValidCharOrder()) {
    drawSetCharOrder();
    return true;
  }

  return false;
}

function drawNoRepentance() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText(
    "Error: You must have the Repentance DLC installed",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  x += 42;
  y += 10;
  Isaac.RenderText("in order to use Racing+.", x, y, 2, 2, 2, 2);
  y += 20;
  Isaac.RenderText(
    "If you want to use the Afterbirth+ version",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText("of the mod, then you must download it", x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText("manually from GitHub.", x, y, 2, 2, 2, 2);
}

function drawCorrupted() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText(
    "Error: You must close and re-open the game after",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  x += 42;
  y += 10;
  Isaac.RenderText("enabling or disabling any mods.", x, y, 2, 2, 2, 2);
  y += 20;
  Isaac.RenderText(
    "If this error persists after re-opening the game,",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText(
    "then your Racing+ mod is corrupted and needs to be",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText("redownloaded/reinstalled.", x, y, 2, 2, 2, 2);
}

function drawNotFullyUnlocked() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText(
    "Error: You must use a fully unlocked save file to",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  x += 42;
  y += 10;
  Isaac.RenderText(
    "play the Racing+ mod. This is so that all",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText(
    "players will have consistent items in races",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText("and speedruns. You can download a fully", x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText("unlocked save file at:", x, y, 2, 2, 2, 2);
  x -= 42;
  y += 20;
  Isaac.RenderText(
    "https://www.speedrun.com/repentance/resources",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 20;
  Isaac.RenderText(
    "If you have problems, please read this guide:",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 20;
  Isaac.RenderText("https://pastebin.com/1YY4jb4P", x, y, 2, 2, 2, 2);
}

function drawSetCharOrder() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText(
    "Error: You must set a character order first",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  x += 42;
  y += 10;
  Isaac.RenderText('by using the "Change Char Order" custom', x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText("challenge.", x, y, 2, 2, 2, 2);
}
