import { Keyboard } from "isaac-typescript-definitions";
import {
  log,
  setLogFunctionsGlobal,
  setTracebackFunctionsGlobal,
} from "isaacscript-common";
import * as entityTakeDmg from "./callbacks/entityTakeDmg";
import * as postEffectInit from "./callbacks/postEffectInit";
import * as postEffectUpdate from "./callbacks/postEffectUpdate";
import * as postEntityKill from "./callbacks/postEntityKill";
import * as postEntityRemove from "./callbacks/postEntityRemove";
import * as postLaserInit from "./callbacks/postLaserInit";
import * as postNPCInit from "./callbacks/postNPCInit";
import * as postNPCUpdate from "./callbacks/postNPCUpdate";
import * as postPickupInit from "./callbacks/postPickupInit";
import * as postProjectileInit from "./callbacks/postProjectileInit";
import * as postRender from "./callbacks/postRender";
import * as postUpdate from "./callbacks/postUpdate";
import * as postUseCard from "./callbacks/postUseCard";
import * as postUseItem from "./callbacks/postUseItem";
import * as postUsePill from "./callbacks/postUsePill";
import * as preEntitySpawn from "./callbacks/preEntitySpawn";
import * as preGameExit from "./callbacks/preGameExit";
import * as preSpawnClearAward from "./callbacks/preSpawnClearAward";
import * as preUseItem from "./callbacks/preUseItem";
import * as postCustomRevive from "./callbacksCustom/postCustomRevive";
import * as postFirstFlip from "./callbacksCustom/postFirstFlip";
import * as postFlip from "./callbacksCustom/postFlip";
import * as postGameStartedReordered from "./callbacksCustom/postGameStartedReordered";
import * as postGridEntityInit from "./callbacksCustom/postGridEntityInit";
import * as postGridEntityRemove from "./callbacksCustom/postGridEntityRemove";
import * as postGridEntityStateChanged from "./callbacksCustom/postGridEntityStateChanged";
import * as postGridEntityUpdate from "./callbacksCustom/postGridEntityUpdate";
import * as postItemPickup from "./callbacksCustom/postItemPickup";
import * as postNewLevelReordered from "./callbacksCustom/postNewLevelReordered";
import * as postNewRoomReordered from "./callbacksCustom/postNewRoomReordered";
import * as postPEffectUpdateReordered from "./callbacksCustom/postPEffectUpdateReordered";
import * as postPressurePlateUpdate from "./callbacksCustom/postPressurePlateUpdate";
import * as postRoomClearChanged from "./callbacksCustom/postRoomClearChanged";
import * as postSacrifice from "./callbacksCustom/postSacrifice";
import * as postTransformation from "./callbacksCustom/postTransformation";
import * as preCustomRevive from "./callbacksCustom/preCustomRevive";
import * as preItemPickup from "./callbacksCustom/preItemPickup";
import { MOD_NAME, VERSION } from "./constants";
import { hotkey1Function, hotkey2Function } from "./debugCode";
import { enableExtraConsoleCommandsRacingPlus } from "./features/mandatory/extraConsoleCommands";
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
  postUseItem.init(); // 3
  postUseCard.init(); // 5
  postUsePill.init(); // 10
  entityTakeDmg.init(); // 11
  preGameExit.init(); // 17
  preUseItem.init(); // 23
  preEntitySpawn.init(); // 24
  postNPCInit.init(); // 27
  postPickupInit.init(); // 34
  postProjectileInit.init(); // 43
  postLaserInit.init(); // 47
  postEffectInit.init(); // 54
  postEffectUpdate.init(); // 55
  postEntityRemove.init(); // 67
  postEntityKill.init(); // 68
  preSpawnClearAward.init(); // 70
}

function registerCallbacksCustom() {
  postCustomRevive.init();
  postFirstFlip.init();
  postFlip.init();
  postGameStartedReordered.init();
  postGridEntityInit.init();
  postGridEntityRemove.init();
  postGridEntityStateChanged.init();
  postGridEntityUpdate.init();
  postItemPickup.init();
  postNewLevelReordered.init();
  postNewRoomReordered.init();
  postPEffectUpdateReordered.init();
  postPressurePlateUpdate.init();
  postRoomClearChanged.init();
  postSacrifice.init();
  postTransformation.init();
  preCustomRevive.init();
  preItemPickup.init();
}
