import {
  log,
  ModCallbacksCustom,
  ModUpgraded,
  saveDataManagerSetGlobal,
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
import * as postEffectRender from "./callbacks/postEffectRender";
import * as postEffectUpdate from "./callbacks/postEffectUpdate";
import * as postEntityKill from "./callbacks/postEntityKill";
import * as postEntityRemove from "./callbacks/postEntityRemove";
import * as postFamiliarInit from "./callbacks/postFamiliarInit";
import * as postFamiliarRender from "./callbacks/postFamiliarRender";
import * as postFamiliarUpdate from "./callbacks/postFamiliarUpdate";
import * as postFireTear from "./callbacks/postFireTear";
import * as postGameEnd from "./callbacks/postGameEnd";
import * as postGameStarted from "./callbacks/postGameStarted";
import * as postLaserInit from "./callbacks/postLaserInit";
import * as postNewLevel from "./callbacks/postNewLevel";
import * as postNewRoom from "./callbacks/postNewRoom";
import * as postNPCInit from "./callbacks/postNPCInit";
import * as postNPCRender from "./callbacks/postNPCRender";
import * as postNPCUpdate from "./callbacks/postNPCUpdate";
import * as postPEffectUpdate from "./callbacks/postPEffectUpdate";
import * as postPickupInit from "./callbacks/postPickupInit";
import * as postPickupUpdate from "./callbacks/postPickupUpdate";
import * as postPlayerInit from "./callbacks/postPlayerInit";
import * as postPlayerRender from "./callbacks/postPlayerRender";
import * as postPlayerUpdate from "./callbacks/postPlayerUpdate";
import * as postProjectileInit from "./callbacks/postProjectileInit";
import * as postRender from "./callbacks/postRender";
import * as postTearUpdate from "./callbacks/postTearUpdate";
import * as postUpdate from "./callbacks/postUpdate";
import * as preEntitySpawn from "./callbacks/preEntitySpawn";
import * as preFamiliarCollision from "./callbacks/preFamiliarCollision";
import * as preGameExit from "./callbacks/preGameExit";
import * as preGetCollectible from "./callbacks/preGetCollectible";
import * as preNPCUpdate from "./callbacks/preNPCUpdate";
import * as preRoomEntitySpawn from "./callbacks/preRoomEntitySpawn";
import * as preSpawnClearAward from "./callbacks/preSpawnClearAward";
import * as preUseItem from "./callbacks/preUseItem";
import * as useCard from "./callbacks/useCard";
import * as useItem from "./callbacks/useItem";
import * as usePill from "./callbacks/usePill";
import * as postCursedTeleport from "./callbacksCustom/postCursedTeleport";
import * as postCustomRevive from "./callbacksCustom/postCustomRevive";
import * as postFirstEsauJr from "./callbacksCustom/postFirstEsauJr";
import * as postFirstFlip from "./callbacksCustom/postFirstFlip";
import * as postFlip from "./callbacksCustom/postFlip";
import * as postGridEntityInit from "./callbacksCustom/postGridEntityInit";
import * as postGridEntityRemove from "./callbacksCustom/postGridEntityRemove";
import * as postGridEntityUpdate from "./callbacksCustom/postGridEntityUpdate";
import * as postItemPickup from "./callbacksCustom/postItemPickup";
import * as postPickupCollect from "./callbacksCustom/postPickupCollect";
import * as postPlayerChangeType from "./callbacksCustom/postPlayerChangeType";
import * as postPlayerInitLate from "./callbacksCustom/postPlayerInitLate";
import * as postPurchase from "./callbacksCustom/postPurchase";
import * as postSacrifice from "./callbacksCustom/postSacrifice";
import * as postSlotUpdate from "./callbacksCustom/postSlotUpdate";
import * as postTransformation from "./callbacksCustom/postTransformation";
import * as preCustomRevive from "./callbacksCustom/preCustomRevive";
import * as preItemPickup from "./callbacksCustom/preItemPickup";
import { VERSION } from "./constants";
import initFeatureVariables from "./initFeatureVariables";

export default function main(): void {
  const mod = RegisterMod("racing-plus", 1);
  const modUpgraded = upgradeMod(mod);

  welcomeBanner();
  initFeatureVariables();
  saveDataManagerSetGlobal();
  registerCallbacks(modUpgraded);
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

function registerCallbacks(mod: ModUpgraded) {
  registerCallbacksMain(mod);
  registerCallbacksWithExtraArgument(mod);
  registerCallbacksCustom(mod);
  registerCallbacksCustomWithExtraArgument(mod);
}

function registerCallbacksMain(mod: ModUpgraded) {
  mod.AddCallback(ModCallbacks.MC_NPC_UPDATE, postNPCUpdate.main); // 0
  mod.AddCallback(ModCallbacks.MC_POST_UPDATE, postUpdate.main); // 1
  mod.AddCallback(ModCallbacks.MC_POST_RENDER, postRender.main); // 2
  mod.AddCallback(ModCallbacks.MC_USE_ITEM, useItem.main); // 3
  mod.AddCallback(ModCallbacks.MC_POST_PEFFECT_UPDATE, postPEffectUpdate.main);
  mod.AddCallback(ModCallbacks.MC_USE_CARD, useCard.main); // 5
  mod.AddCallback(ModCallbacks.MC_EVALUATE_CACHE, evaluateCache.main); // 8
  mod.AddCallback(ModCallbacks.MC_POST_PLAYER_INIT, postPlayerInit.main); // 9
  mod.AddCallback(ModCallbacks.MC_USE_PILL, usePill.main); // 10
  mod.AddCallback(ModCallbacks.MC_POST_CURSE_EVAL, postCurseEval.main); // 12
  mod.AddCallback(ModCallbacks.MC_POST_GAME_END, postGameEnd.main); // 16
  mod.AddCallback(ModCallbacks.MC_PRE_GAME_EXIT, preGameExit.main); // 17
  mod.AddCallback(ModCallbacks.MC_EXECUTE_CMD, executeCmd.main); // 22
  mod.AddCallback(ModCallbacks.MC_PRE_ENTITY_SPAWN, preEntitySpawn.main); // 24
  mod.AddCallback(
    ModCallbacks.MC_POST_FAMILIAR_RENDER,
    postFamiliarRender.main,
  ); // 25
  mod.AddCallback(ModCallbacks.MC_POST_NPC_INIT, postNPCInit.main); // 27
  mod.AddCallback(ModCallbacks.MC_POST_NPC_RENDER, postNPCRender.main); // 28
  mod.AddCallback(ModCallbacks.MC_POST_PLAYER_RENDER, postPlayerRender.main); // 32
  mod.AddCallback(ModCallbacks.MC_POST_PICKUP_INIT, postPickupInit.main); // 34
  mod.AddCallback(ModCallbacks.MC_POST_EFFECT_RENDER, postEffectRender.main); // 56
  mod.AddCallback(ModCallbacks.MC_POST_FIRE_TEAR, postFireTear.main); // 61
  mod.AddCallback(ModCallbacks.MC_PRE_GET_COLLECTIBLE, preGetCollectible.main); // 62
  mod.AddCallback(ModCallbacks.MC_GET_PILL_EFFECT, getPillEffect.main); // 65
  mod.AddCallback(ModCallbacks.MC_POST_ENTITY_REMOVE, postEntityRemove.main); // 67
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

function registerCallbacksWithExtraArgument(mod: ModUpgraded) {
  postNPCUpdate.init(mod); // 0
  useItem.init(mod); // 3
  useCard.init(mod); // 5
  postFamiliarUpdate.init(mod); // 6
  postFamiliarInit.init(mod); // 7
  usePill.init(mod); // 10
  entityTakeDmg.init(mod); // 11
  inputAction.init(mod); // 13
  preUseItem.init(mod); // 23
  postFamiliarRender.init(mod); // 25
  preFamiliarCollision.init(mod); // 26
  postNPCInit.init(mod); // 27
  postNPCRender.init(mod); // 28
  postPickupInit.init(mod); // 34
  postPickupUpdate.init(mod); // 35
  postTearUpdate.init(mod); // 40
  postProjectileInit.init(mod); // 43
  postLaserInit.init(mod); // 47
  postEffectInit.init(mod); // 54
  postEffectUpdate.init(mod); // 55
  postBombInit.init(mod); // 57
  postEntityKill.init(mod); // 68
  preNPCUpdate.init(mod); // 69
}

function registerCallbacksCustom(mod: ModUpgraded) {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GAME_STARTED_REORDERED,
    postGameStarted.main,
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_NEW_LEVEL_REORDERED,
    postNewLevel.main,
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_NEW_ROOM_REORDERED,
    postNewRoom.main,
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_PLAYER_UPDATE_REORDERED,
    postPlayerUpdate.main,
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_PLAYER_INIT_LATE,
    postPlayerInitLate.main,
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_PICKUP_COLLECT,
    postPickupCollect.main,
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_PRE_ITEM_PICKUP,
    preItemPickup.main,
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_ITEM_PICKUP,
    postItemPickup.main,
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_PLAYER_CHANGE_TYPE,
    postPlayerChangeType.main,
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_PRE_CUSTOM_REVIVE,
    preCustomRevive.main,
  );

  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_FLIP, postFlip.main);

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_FIRST_FLIP,
    postFirstFlip.main,
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_FIRST_ESAU_JR,
    postFirstEsauJr.main,
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_TRANSFORMATION,
    postTransformation.main,
  );

  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_PURCHASE, postPurchase.main);

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_SACRIFICE,
    postSacrifice.main,
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_CURSED_TELEPORT,
    postCursedTeleport.main,
  );
}

function registerCallbacksCustomWithExtraArgument(mod: ModUpgraded) {
  postItemPickup.init(mod);
  postCustomRevive.init(mod);
  postSlotUpdate.init(mod);
  postGridEntityInit.init(mod);
  postGridEntityUpdate.init(mod);
  postGridEntityRemove.init(mod);
}
