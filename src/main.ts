import { log } from "isaacscript-common";
import * as entityTakeDmg from "./callbacks/entityTakeDmg";
import * as evaluateCache from "./callbacks/evaluateCache";
import * as executeCmd from "./callbacks/executeCmd";
import * as getPillEffect from "./callbacks/getPillEffect";
import * as inputAction from "./callbacks/inputAction";
import * as postCurseEval from "./callbacks/postCurseEval";
import * as postEffectInit from "./callbacks/postEffectInit";
import * as postEffectUpdate from "./callbacks/postEffectUpdate";
import * as postEntityKill from "./callbacks/postEntityKill";
import * as postFamiliarInit from "./callbacks/postFamiliarInit";
import * as postFireTear from "./callbacks/postFireTear";
import * as postGameStarted from "./callbacks/postGameStarted";
import * as postNewLevel from "./callbacks/postNewLevel";
import * as postNewRoom from "./callbacks/postNewRoom";
import * as postNPCRender from "./callbacks/postNPCRender";
import * as postNPCUpdate from "./callbacks/postNPCUpdate";
import * as postPickupInit from "./callbacks/postPickupInit";
import * as postPlayerInit from "./callbacks/postPlayerInit";
import * as postPlayerRender from "./callbacks/postPlayerRender";
import * as postPlayerUpdate from "./callbacks/postPlayerUpdate";
import * as postRender from "./callbacks/postRender";
import * as postTearUpdate from "./callbacks/postTearUpdate";
import * as postUpdate from "./callbacks/postUpdate";
import * as preEntitySpawn from "./callbacks/preEntitySpawn";
import * as preGameExit from "./callbacks/preGameExit";
import * as preNPCUpdate from "./callbacks/preNPCUpdate";
import * as preRoomEntitySpawn from "./callbacks/preRoomEntitySpawn";
import * as preSpawnClearAward from "./callbacks/preSpawnClearAward";
import * as useCard from "./callbacks/useCard";
import * as useItem from "./callbacks/useItem";
import * as usePill from "./callbacks/usePill";
import { VERSION } from "./constants";
import * as modConfigMenu from "./modConfigMenu";
import * as saveDat from "./saveDat";

main();

function main() {
  const mod = RegisterMod("Racing+", 1);
  // const modUpgraded = upgradeMod(mod);

  welcomeBanner();

  saveDat.setMod(mod); // Give a copy of the mod object to the code in charge of saving
  saveDat.load(); // Load the "save1.dat" file

  modConfigMenu.register(); // Integrate with Mod Config Menu

  registerCallbacks(mod);
  // registerCallbacksCustom(modUpgraded);
}

function welcomeBanner() {
  const modName = "Racing+";
  const welcomeText = `${modName} ${VERSION} initialized.`;
  const hyphens = "-".repeat(welcomeText.length);
  const welcomeTextBorder = `+-${hyphens}-+`;
  log(welcomeTextBorder);
  log(`| ${welcomeText} |`);
  log(welcomeTextBorder);
}

function registerCallbacks(mod: Mod) {
  registerMainCallbacks(mod);

  // Register callbacks that take a 3rd argument for a specific entity
  postNPCUpdate.init(mod); // 0
  useItem.init(mod); // 3
  postFamiliarInit.init(mod); // 7
  entityTakeDmg.init(mod); // 11
  postPickupInit.init(mod); // 34
  postTearUpdate.init(mod); // 40
  postEffectInit.init(mod); // 54
  postEffectUpdate.init(mod); // 55
  postEntityKill.init(mod); // 68
  preNPCUpdate.init(mod); // 69
}

function registerMainCallbacks(mod: Mod) {
  mod.AddCallback(ModCallbacks.MC_POST_UPDATE, postUpdate.main); // 1
  mod.AddCallback(ModCallbacks.MC_POST_RENDER, postRender.main); // 2
  mod.AddCallback(ModCallbacks.MC_USE_CARD, useCard.main); // 5
  mod.AddCallback(ModCallbacks.MC_EVALUATE_CACHE, evaluateCache.main); // 8
  mod.AddCallback(ModCallbacks.MC_POST_PLAYER_INIT, postPlayerInit.main); // 9
  mod.AddCallback(ModCallbacks.MC_USE_PILL, usePill.main); // 10
  mod.AddCallback(ModCallbacks.MC_POST_CURSE_EVAL, postCurseEval.main); // 12
  mod.AddCallback(ModCallbacks.MC_INPUT_ACTION, inputAction.main); // 13
  mod.AddCallback(ModCallbacks.MC_POST_GAME_STARTED, postGameStarted.main); // 15
  mod.AddCallback(ModCallbacks.MC_PRE_GAME_EXIT, preGameExit.main); // 17
  mod.AddCallback(ModCallbacks.MC_POST_NEW_LEVEL, postNewLevel.main); // 18
  mod.AddCallback(ModCallbacks.MC_POST_NEW_ROOM, postNewRoom.main); // 19
  mod.AddCallback(ModCallbacks.MC_EXECUTE_CMD, executeCmd.main); // 22
  mod.AddCallback(ModCallbacks.MC_PRE_ENTITY_SPAWN, preEntitySpawn.main); // 24
  mod.AddCallback(ModCallbacks.MC_POST_NPC_RENDER, postNPCRender.main); // 28
  mod.AddCallback(ModCallbacks.MC_POST_PLAYER_UPDATE, postPlayerUpdate.main); // 31
  mod.AddCallback(ModCallbacks.MC_POST_PLAYER_RENDER, postPlayerRender.main); // 32
  mod.AddCallback(ModCallbacks.MC_POST_FIRE_TEAR, postFireTear.main); // 61
  mod.AddCallback(ModCallbacks.MC_GET_PILL_EFFECT, getPillEffect.main); // 65
  mod.AddCallback(ModCallbacks.MC_POST_ENTITY_KILL, postEntityKill.main); // 68
  mod.AddCallback(
    ModCallbacks.MC_PRE_SPAWN_CLEAN_AWARD,
    preSpawnClearAward.main,
  ); // 70
  mod.AddCallback(
    ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN,
    preRoomEntitySpawn.main,
  ); // 71
}

/*
function registerCallbacksCustom(mod: ModUpgraded) {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_ITEM_PICKUP,
    postItemPickup.main,
  );
}
*/
