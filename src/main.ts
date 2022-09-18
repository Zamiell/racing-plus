import { Keyboard } from "isaac-typescript-definitions";
import {
  enableExtraConsoleCommands,
  log,
  ModUpgraded,
  saveDataManagerSetGlobal,
  setHotkey,
  setLogFunctionsGlobal,
  setTracebackFunctionsGlobal,
  upgradeMod,
} from "isaacscript-common";
import * as entityTakeDmg from "./callbacks/entityTakeDmg";
import * as evaluateCache from "./callbacks/evaluateCache";
import * as executeCmd from "./callbacks/executeCmd";
import * as getPillEffect from "./callbacks/getPillEffect";
import * as inputAction from "./callbacks/inputAction";
import * as postBombInit from "./callbacks/postBombInit";
import * as postCurseEval from "./callbacks/postCurseEval";
import * as postEffectInit from "./callbacks/postEffectInit";
import * as postEffectUpdate from "./callbacks/postEffectUpdate";
import * as postEntityKill from "./callbacks/postEntityKill";
import * as postEntityRemove from "./callbacks/postEntityRemove";
import * as postFamiliarInit from "./callbacks/postFamiliarInit";
import * as postFamiliarRender from "./callbacks/postFamiliarRender";
import * as postFamiliarUpdate from "./callbacks/postFamiliarUpdate";
import * as postGameEnd from "./callbacks/postGameEnd";
import * as postLaserInit from "./callbacks/postLaserInit";
import * as postNPCInit from "./callbacks/postNPCInit";
import * as postNPCRender from "./callbacks/postNPCRender";
import * as postNPCUpdate from "./callbacks/postNPCUpdate";
import * as postPickupInit from "./callbacks/postPickupInit";
import * as postPickupRender from "./callbacks/postPickupRender";
import * as postPickupUpdate from "./callbacks/postPickupUpdate";
import * as postPlayerInit from "./callbacks/postPlayerInit";
import * as postPlayerRender from "./callbacks/postPlayerRender";
import * as postProjectileInit from "./callbacks/postProjectileInit";
import * as postRender from "./callbacks/postRender";
import * as postTearUpdate from "./callbacks/postTearUpdate";
import * as postUpdate from "./callbacks/postUpdate";
import * as useCard from "./callbacks/postUseCard";
import * as useItem from "./callbacks/postUseItem";
import * as usePill from "./callbacks/postUsePill";
import * as preEntitySpawn from "./callbacks/preEntitySpawn";
import * as preFamiliarCollision from "./callbacks/preFamiliarCollision";
import * as preGameExit from "./callbacks/preGameExit";
import * as preGetCollectible from "./callbacks/preGetCollectible";
import * as preNPCUpdate from "./callbacks/preNPCUpdate";
import * as preRoomEntitySpawn from "./callbacks/preRoomEntitySpawn";
import * as preSpawnClearAward from "./callbacks/preSpawnClearAward";
import * as preUseItem from "./callbacks/preUseItem";
import * as postAmbushStarted from "./callbacksCustom/postAmbushStarted";
import * as postBombExploded from "./callbacksCustom/postBombExploded";
import * as postBoneSwing from "./callbacksCustom/postBoneSwing";
import * as postCursedTeleport from "./callbacksCustom/postCursedTeleport";
import * as postCustomRevive from "./callbacksCustom/postCustomRevive";
import * as postFirstEsauJr from "./callbacksCustom/postFirstEsauJr";
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
import * as postNPCInitLate from "./callbacksCustom/postNPCInitLate";
import * as postPEffectUpdateReordered from "./callbacksCustom/postPEffectUpdateReordered";
import * as postPickupCollect from "./callbacksCustom/postPickupCollect";
import * as postPlayerChangeType from "./callbacksCustom/postPlayerChangeType";
import * as postPlayerInitLate from "./callbacksCustom/postPlayerInitLate";
import * as postPressurePlateUpdate from "./callbacksCustom/postPressurePlateUpdate";
import * as postPurchase from "./callbacksCustom/postPurchase";
import * as postRoomClearChanged from "./callbacksCustom/postRoomClearChanged";
import * as postSacrifice from "./callbacksCustom/postSacrifice";
import * as postSlotAnimationChanged from "./callbacksCustom/postSlotAnimationChanged";
import * as postTearInitVeryLate from "./callbacksCustom/postTearInitVeryLate";
import * as postTransformation from "./callbacksCustom/postTransformation";
import * as preCustomRevive from "./callbacksCustom/preCustomRevive";
import * as preItemPickup from "./callbacksCustom/preItemPickup";
import { MOD_NAME, VERSION } from "./constants";
import { hotkey1Function, hotkey2Function } from "./debugCode";
import { enableExtraConsoleCommandsRacingPlus } from "./features/mandatory/extraConsoleCommands";
import g from "./globals";
import { initFeatureVariables } from "./initFeatureVariables";
import { initMinimapAPI } from "./minimapAPI";

main();

function main() {
  const modVanilla = RegisterMod(MOD_NAME, 1);
  const mod = upgradeMod(modVanilla);

  welcomeBanner();
  initFeatureVariables();
  initMinimapAPI();

  enableExtraConsoleCommands(mod); // Initialize extra console commands from the standard library.
  enableExtraConsoleCommandsRacingPlus(); // Initialize extra console commands from Racing+.

  registerCallbacksVanilla(mod);
  registerCallbacksCustom(mod);

  if (g.debug) {
    // We don't use the "enableDevFeatures" function since it would interfere with the fast reset
    // feature.
    saveDataManagerSetGlobal();
    setLogFunctionsGlobal();
    setTracebackFunctionsGlobal();

    // F1 shows the version of Racing+.
    setHotkey(Keyboard.F2, hotkey1Function);
    setHotkey(Keyboard.F3, hotkey2Function);
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

function registerCallbacksVanilla(mod: ModUpgraded) {
  postNPCUpdate.init(mod); // 0
  postUpdate.init(mod); // 1
  postRender.init(mod); // 2
  useItem.init(mod); // 3
  useCard.init(mod); // 5
  postFamiliarUpdate.init(mod); // 6
  postFamiliarInit.init(mod); // 7
  evaluateCache.init(mod); // 8
  postPlayerInit.init(mod); // 9
  usePill.init(mod); // 10
  entityTakeDmg.init(mod); // 11
  postCurseEval.init(mod); // 12
  inputAction.init(mod); // 13
  postGameEnd.init(mod); // 16
  preGameExit.init(mod); // 17
  executeCmd.init(mod); // 22
  preUseItem.init(mod); // 23
  preEntitySpawn.init(mod); // 24
  postFamiliarRender.init(mod); // 25
  preFamiliarCollision.init(mod); // 26
  postNPCInit.init(mod); // 27
  postNPCRender.init(mod); // 28
  postPlayerRender.init(mod); // 32
  postPickupInit.init(mod); // 34
  postPickupUpdate.init(mod); // 35
  postPickupRender.init(mod); // 36
  postTearUpdate.init(mod); // 40
  postProjectileInit.init(mod); // 43
  postLaserInit.init(mod); // 47
  postEffectInit.init(mod); // 54
  postEffectUpdate.init(mod); // 55
  postBombInit.init(mod); // 57
  preGetCollectible.init(mod); // 62
  getPillEffect.init(mod); // 65
  postEntityRemove.init(mod); // 67
  postEntityKill.init(mod); // 68
  preNPCUpdate.init(mod); // 69
  preSpawnClearAward.init(mod); // 70
  preRoomEntitySpawn.init(mod); // 71
}

function registerCallbacksCustom(mod: ModUpgraded) {
  postAmbushStarted.init(mod);
  postBombExploded.init(mod);
  postBoneSwing.init(mod);
  postCursedTeleport.init(mod);
  postCustomRevive.init(mod);
  postFirstEsauJr.init(mod);
  postFirstFlip.init(mod);
  postFlip.init(mod);
  postGameStartedReordered.init(mod);
  postGridEntityInit.init(mod);
  postGridEntityRemove.init(mod);
  postGridEntityStateChanged.init(mod);
  postGridEntityUpdate.init(mod);
  postItemPickup.init(mod);
  postNewLevelReordered.init(mod);
  postNewRoomReordered.init(mod);
  postNPCInitLate.init(mod);
  postPEffectUpdateReordered.init(mod);
  postPickupCollect.init(mod);
  postPlayerChangeType.init(mod);
  postPlayerInitLate.init(mod);
  postPressurePlateUpdate.init(mod);
  postPurchase.init(mod);
  postRoomClearChanged.init(mod);
  postSacrifice.init(mod);
  postSlotAnimationChanged.init(mod);
  postTearInitVeryLate.init(mod);
  postTransformation.init(mod);
  preCustomRevive.init(mod);
  preItemPickup.init(mod);
}
