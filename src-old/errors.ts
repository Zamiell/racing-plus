import { ChallengeCustom } from "./challenges/enums";
import { inSpeedrun } from "./challenges/misc";
import * as speedrun from "./challenges/speedrun";
import g from "./globals";

const STARTING_X = 115;
const STARTING_Y = 70;

export function draw(): boolean {
  // Local variables
  const challenge = Isaac.GetChallenge();

  // We only want to show one error to the user at a time
  // Errors are checked for in order of precedence
  if (g.errors.corrupted) {
    drawCorrupted();
    return true;
  }
  if (g.errors.resumedOldRun) {
    drawResumedOldRun();
    return true;
  }
  if (!g.saveFile.fullyUnlocked) {
    drawInvalidSaveFile();
    return true;
  }
  if (g.errors.invalidItemsXML) {
    drawInvalidItemsXML();
    return true;
  }
  if (!g.luaDebug && g.raceVars.shadowEnabled) {
    drawNoLuaDebug();
    return true;
  }
  if (
    (inSpeedrun() || challenge === ChallengeCustom.CHANGE_CHAR_ORDER) &&
    RacingPlusData === null
  ) {
    drawRacingPlusData1();
    return true;
  }
  if (
    challenge === Isaac.GetChallengeIdByName("Change Keybindings") &&
    RacingPlusData === null
  ) {
    drawRacingPlusData2();
    return true;
  }
  if (
    challenge === ChallengeCustom.R7_SEASON_5 &&
    SinglePlayerCoopBabies === null
  ) {
    drawEnableBabiesMod();
    return true;
  }
  if (
    inSpeedrun() &&
    challenge !== ChallengeCustom.R7_SEASON_5 &&
    SinglePlayerCoopBabies !== null
  ) {
    drawDisableBabiesMod();
    return true;
  }
  if (
    challenge === ChallengeCustom.R7_SEASON_9 &&
    RacingPlusRebalancedVersion === null
  ) {
    drawEnableBalanceMod();
    return true;
  }
  if (
    inSpeedrun() &&
    challenge !== ChallengeCustom.R7_SEASON_9 &&
    RacingPlusRebalancedVersion !== null
  ) {
    drawDisableBalanceMod();
    return true;
  }
  if (inSpeedrun() && !speedrun.checkValidCharOrder()) {
    drawSetCharOrder();
    return true;
  }

  return false;
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

function drawResumedOldRun() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText(
    "Error: Racing+ does not support continuing old",
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
    "runs that were played prior to opening the",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText("game. Please reset the run.", x, y, 2, 2, 2, 2);
}

function drawInvalidSaveFile() {
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
  Isaac.RenderText("unlocked save file at.", x, y, 2, 2, 2, 2);
  x -= 42;
  y += 20;
  Isaac.RenderText(
    "https://www.speedrun.com/afterbirthplus/resources",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 20;
  Isaac.RenderText(
    "For save file troubleshooting, please read the",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText("following link:", x, y, 2, 2, 2, 2);
  y += 20;
  Isaac.RenderText("https://pastebin.com/1YY4jb4P", x, y, 2, 2, 2, 2);
}

function drawInvalidItemsXML() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText(
    "Error: You are using a mod that conflicts with",
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
    "Racing+. Please disable all other mods, and then",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText(
    "completely close and re-open the game. See the",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText(
    "Discord server for more information about legal",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText("mods.", x, y, 2, 2, 2, 2);
  x -= 42;
  y += 20;
  Isaac.RenderText(
    "https://www.speedrun.com/afterbirthplus/thread/pffgt", // cspell:disable-line
    x,
    y,
    2,
    2,
    2,
    2,
  );
}

function drawNoLuaDebug() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText(
    "Error: In order for Racing+ to draw the opponent's",
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
    'shadows, you must set "--luadebug" in the Steam',
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText(
    "launch options for the game. Before doing this,",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText(
    "it is imperative that you disable any mods that",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText(
    "you do not fully trust. For more information,",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText("please read the following link.", x, y, 2, 2, 2, 2);
  y += 20;
  Isaac.RenderText("https://pastebin.com/2ZnRxDba", x, y, 2, 2, 2, 2);
}

function drawRacingPlusData1() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText("Error: You must subscribe to and enable", x, y, 2, 2, 2, 2);
  x += 42;
  y += 10;
  Isaac.RenderText('the "Racing+ Data" mod on the Steam', x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText(
    "Workshop in order to play multi-character",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText("custom challenges.", x, y, 2, 2, 2, 2);
  x -= 42;
  y += 20;
  Isaac.RenderText("https://steamcommunity.com/sharedfiles/", x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText("filedetails/?id=2004774809", x, y, 2, 2, 2, 2);
}

function drawRacingPlusData2() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText("Error: You must subscribe to and enable", x, y, 2, 2, 2, 2);
  x += 42;
  y += 10;
  Isaac.RenderText('the "Racing+ Data" mod on the Steam', x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText("Workshop in order to use the extra", x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText("keybindings provided by Racing+.", x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText("(The Racing+ Data mod is entirely", x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText("separate from the Racing+ mod.)", x, y, 2, 2, 2, 2);
  x -= 42;
  y += 20;
  Isaac.RenderText("https://steamcommunity.com/sharedfiles/", x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText("filedetails/?id=2004774809", x, y, 2, 2, 2, 2);
}

function drawEnableBabiesMod() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText("Error: You must subscribe to and enable", x, y, 2, 2, 2, 2);
  x += 42;
  y += 10;
  Isaac.RenderText('"The Babies Mod" on the Steam Workshop', x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText(
    "in order for the Racing+ season 5 custom",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText("challenge to work correctly.", x, y, 2, 2, 2, 2);
  x -= 42;
  y += 20;
  Isaac.RenderText("https://steamcommunity.com/sharedfiles/", x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText("filedetails/?id=1545273881", x, y, 2, 2, 2, 2);
}

function drawDisableBabiesMod() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText("Error: You must disable The Babies Mod", x, y, 2, 2, 2, 2);
  x += 42;
  y += 10;
  Isaac.RenderText("in order for this custom challenge to", x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText("work correctly.", x, y, 2, 2, 2, 2);
}

function drawEnableBalanceMod() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText(
    "Error: You must subscribe to and enable the",
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
    '"Racing+ Rebalanced" mod on the Steam Workshop',
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText(
    "in order for the Racing+ season 9 custom",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText("challenge to work correctly.", x, y, 2, 2, 2, 2);
  x -= 42;
  y += 20;
  Isaac.RenderText("https://steamcommunity.com/sharedfiles/", x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText("filedetails/?id=2263635610", x, y, 2, 2, 2, 2);
}

function drawDisableBalanceMod() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText(
    "Error: You must disable the Racing+ Rebalanced",
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
    "mod in order for this custom challenge to",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText("work correctly.", x, y, 2, 2, 2, 2);
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
