import { Keyboard } from "isaac-typescript-definitions";
import {
  log,
  setLogFunctionsGlobal,
  setTracebackFunctionsGlobal,
} from "isaacscript-common";
import { version } from "../package.json";
import { postNPCUpdateInit } from "./callbacks/postNPCUpdate";
import { postNPCRenderInit } from "./callbacks/postRender";
import { postUpdateInit } from "./callbacks/postUpdate";
import { preGameExitInit } from "./callbacks/preGameExit";
import { preSpawnClearAwardInit } from "./callbacks/preSpawnClearAward";
import { preUseItemInit } from "./callbacks/preUseItem";
import { postGameStartedReorderedInit } from "./callbacksCustom/postGameStartedReordered";
import { postItemPickupInit } from "./callbacksCustom/postItemPickup";
import { postNewLevelReorderedInit } from "./callbacksCustom/postNewLevelReordered";
import { postNewRoomReorderedInit } from "./callbacksCustom/postNewRoomReordered";
import { postPEffectUpdateReorderedInit } from "./callbacksCustom/postPEffectUpdateReordered";
import { MOD_NAME } from "./constants";
import { hotkey1Function, hotkey2Function } from "./debugCode";
import { enableExtraConsoleCommandsRacingPlus } from "./extraConsoleCommands";
import { g } from "./globals";
import { initFeatureClasses } from "./initFeatureClasses";
import { initFeatureVariables } from "./initFeatureVariables";
import { initMinimapAPI } from "./minimapAPI";
import { mod } from "./mod";

export function main(): void {
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
  const welcomeText = `${MOD_NAME} ${version} initialized.`;
  const hyphens = "-".repeat(welcomeText.length);
  const welcomeTextBorder = `+-${hyphens}-+`;
  log(welcomeTextBorder);
  log(`| ${welcomeText} |`);
  log(welcomeTextBorder);
}

function registerCallbacksVanilla() {
  postNPCUpdateInit(); // 0
  postUpdateInit(); // 1
  postNPCRenderInit(); // 2
  preGameExitInit(); // 17
  preUseItemInit(); // 23
  preSpawnClearAwardInit(); // 70
}

function registerCallbacksCustom() {
  postGameStartedReorderedInit();
  postItemPickupInit();
  postNewLevelReorderedInit();
  postNewRoomReorderedInit();
  postPEffectUpdateReorderedInit();
}
