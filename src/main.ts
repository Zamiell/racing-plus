import { Keyboard } from "isaac-typescript-definitions";
import {
  log,
  setLogFunctionsGlobal,
  setTracebackFunctionsGlobal,
} from "isaacscript-common";
import * as postNPCUpdate from "./callbacks/postNPCUpdate";
import * as postRender from "./callbacks/postRender";
import * as postUpdate from "./callbacks/postUpdate";
import * as preGameExit from "./callbacks/preGameExit";
import * as preSpawnClearAward from "./callbacks/preSpawnClearAward";
import * as preUseItem from "./callbacks/preUseItem";
import * as postGameStartedReordered from "./callbacksCustom/postGameStartedReordered";
import * as postItemPickup from "./callbacksCustom/postItemPickup";
import * as postNewLevelReordered from "./callbacksCustom/postNewLevelReordered";
import * as postNewRoomReordered from "./callbacksCustom/postNewRoomReordered";
import * as postPEffectUpdateReordered from "./callbacksCustom/postPEffectUpdateReordered";
import * as postPressurePlateUpdate from "./callbacksCustom/postPressurePlateUpdate";
import { MOD_NAME, VERSION } from "./constants";
import { hotkey1Function, hotkey2Function } from "./debugCode";
import { enableExtraConsoleCommandsRacingPlus } from "./extraConsoleCommands";
import { g } from "./globals";
import { initFeatureClasses } from "./initFeatureClasses";
import { initFeatureVariables } from "./initFeatureVariables";
import { initMinimapAPI } from "./minimapAPI";
import { mod } from "./mod";

main();

function main() {
  welcomeBanner();
  initFeatureClasses();
  initFeatureVariables();
  initMinimapAPI();

  enableExtraConsoleCommandsRacingPlus();

  registerCallbacksVanilla();
  registerCallbacksCustom();

  if (g.debug) {
    log("Racing+ debug mode enabled.");
    setLogFunctionsGlobal();
    setTracebackFunctionsGlobal();
    mod.saveDataManagerSetGlobal();

    // F1 shows the version of Racing+.
    mod.setHotkey(Keyboard.F2, hotkey1Function);
    mod.setHotkey(Keyboard.F3, hotkey2Function);
  }
}

function welcomeBanner() {
  const welcomeText = `${MOD_NAME} ${VERSION} initialized.`;
  const hyphens = "-".repeat(welcomeText.length);
  const welcomeTextBorder = `+-${hyphens}-+`;
  log(welcomeTextBorder);
  log(`| ${welcomeText} |`);
  log(welcomeTextBorder);
}

function registerCallbacksVanilla() {
  postNPCUpdate.init(); // 0
  postUpdate.init(); // 1
  postRender.init(); // 2
  preGameExit.init(); // 17
  preUseItem.init(); // 23
  preSpawnClearAward.init(); // 70
}

function registerCallbacksCustom() {
  postGameStartedReordered.init();
  postItemPickup.init();
  postNewLevelReordered.init();
  postNewRoomReordered.init();
  postPEffectUpdateReordered.init();
  postPressurePlateUpdate.init();
}
