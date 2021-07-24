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
import * as useCard from "./callbacks/useCard";
import * as useItem from "./callbacks/useItem";
import * as usePill from "./callbacks/usePill";
import { VERSION } from "./constants";
import log from "./log";
import * as modConfigMenu from "./modConfigMenu";
import * as saveDat from "./saveDat";

main();

function main() {
  const racingPlus = RegisterMod("Racing+", 1);
  welcomeBanner();

  saveDat.setMod(racingPlus); // Give a copy of the mod object to the code in charge of saving
  saveDat.load(); // Load the "save1.dat" file

  modConfigMenu.register(); // Integrate with Mod Config Menu

  registerCallbacks(racingPlus);
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

function registerCallbacks(racingPlus: Mod) {
  registerMiscCallbacks(racingPlus);

  // Register callbacks that take a 3rd argument for a specific entity
  registerNPCUpdateCallbacks(racingPlus); // 0
  registerPostItemUseCallbacks(racingPlus); // 3
  registerPostFamiliarInitCallbacks(racingPlus); // 7
  registerEntityTakeDmgCallbacks(racingPlus); // 11
  registerPostPickupInitCallbacks(racingPlus); // 34
  registerPostTearUpdateCallbacks(racingPlus); // 40
  registerPostEffectInitCallbacks(racingPlus); // 54
  registerPostEffectUpdateCallbacks(racingPlus); // 55
  registerPreNPCUpdateCallbacks(racingPlus); // 69
}

function registerMiscCallbacks(racingPlus: Mod) {
  racingPlus.AddCallback(ModCallbacks.MC_POST_UPDATE, postUpdate.main); // 1
  racingPlus.AddCallback(ModCallbacks.MC_POST_RENDER, postRender.main); // 2
  racingPlus.AddCallback(ModCallbacks.MC_USE_CARD, useCard.main); // 5
  racingPlus.AddCallback(ModCallbacks.MC_EVALUATE_CACHE, evaluateCache.main); // 8
  racingPlus.AddCallback(ModCallbacks.MC_POST_PLAYER_INIT, postPlayerInit.main); // 9
  racingPlus.AddCallback(ModCallbacks.MC_USE_PILL, usePill.main); // 10
  racingPlus.AddCallback(ModCallbacks.MC_POST_CURSE_EVAL, postCurseEval.main); // 12
  racingPlus.AddCallback(ModCallbacks.MC_INPUT_ACTION, inputAction.main); // 13
  racingPlus.AddCallback(
    ModCallbacks.MC_POST_GAME_STARTED,
    postGameStarted.main,
  ); // 15
  racingPlus.AddCallback(ModCallbacks.MC_PRE_GAME_EXIT, preGameExit.main); // 17
  racingPlus.AddCallback(ModCallbacks.MC_POST_NEW_LEVEL, postNewLevel.main); // 18
  racingPlus.AddCallback(ModCallbacks.MC_POST_NEW_ROOM, postNewRoom.main); // 19
  racingPlus.AddCallback(ModCallbacks.MC_EXECUTE_CMD, executeCmd.main); // 22
  racingPlus.AddCallback(ModCallbacks.MC_PRE_ENTITY_SPAWN, preEntitySpawn.main); // 24
  racingPlus.AddCallback(ModCallbacks.MC_POST_NPC_RENDER, postNPCRender.main); // 28
  racingPlus.AddCallback(
    ModCallbacks.MC_POST_PLAYER_UPDATE,
    postPlayerUpdate.main,
  ); // 31
  racingPlus.AddCallback(
    ModCallbacks.MC_POST_PLAYER_RENDER,
    postPlayerRender.main,
  ); // 32
  racingPlus.AddCallback(ModCallbacks.MC_POST_FIRE_TEAR, postFireTear.main); // 61
  racingPlus.AddCallback(ModCallbacks.MC_GET_PILL_EFFECT, getPillEffect.main); // 65
  racingPlus.AddCallback(ModCallbacks.MC_POST_ENTITY_KILL, postEntityKill.main); // 68
  racingPlus.AddCallback(
    ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN,
    preRoomEntitySpawn.main,
  ); // 71
}

// 0
function registerNPCUpdateCallbacks(racingPlus: Mod) {
  racingPlus.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    postNPCUpdate.globin,
    EntityType.ENTITY_GLOBIN, // 24
  );
  racingPlus.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    postNPCUpdate.death,
    EntityType.ENTITY_DEATH, // 66
  );
  racingPlus.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    postNPCUpdate.momsHand,
    EntityType.ENTITY_MOMS_HAND, // 213
  );
  racingPlus.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    postNPCUpdate.wizoob,
    EntityType.ENTITY_WIZOOB, // 219
  );
  racingPlus.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    postNPCUpdate.haunt,
    EntityType.ENTITY_THE_HAUNT, // 260
  );
  racingPlus.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    postNPCUpdate.redGhost,
    EntityType.ENTITY_RED_GHOST, // 285
  );
  racingPlus.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    postNPCUpdate.momsDeadHand,
    EntityType.ENTITY_MOMS_DEAD_HAND, // 287
  );
}

// 3
function registerPostItemUseCallbacks(racingPlus: Mod) {
  racingPlus.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    useItem.fortuneCookie,
    CollectibleType.COLLECTIBLE_FORTUNE_COOKIE, // 557
  );
}

// 7
function registerPostFamiliarInitCallbacks(racingPlus: Mod) {
  racingPlus.AddCallback(
    ModCallbacks.MC_FAMILIAR_INIT,
    postFamiliarInit.paschalCandle,
    FamiliarVariant.PASCHAL_CANDLE, // 221
  );
}

// 11
function registerEntityTakeDmgCallbacks(racingPlus: Mod) {
  racingPlus.AddCallback(
    ModCallbacks.MC_ENTITY_TAKE_DMG,
    entityTakeDmg.player,
    EntityType.ENTITY_PLAYER, // 1
  );
}

// 34
function registerPostPickupInitCallbacks(racingPlus: Mod) {
  racingPlus.AddCallback(
    ModCallbacks.MC_POST_PICKUP_INIT,
    postPickupInit.collectible,
    PickupVariant.PICKUP_COLLECTIBLE, // 100
  );
  racingPlus.AddCallback(
    ModCallbacks.MC_POST_PICKUP_INIT,
    postPickupInit.bigChest,
    PickupVariant.PICKUP_BIGCHEST, // 340
  );
}

// 40
function registerPostTearUpdateCallbacks(racingPlus: Mod) {
  racingPlus.AddCallback(
    ModCallbacks.MC_POST_TEAR_UPDATE,
    postTearUpdate.blood,
    TearVariant.BLOOD, // 1
  );
}

// 54
function registerPostEffectInitCallbacks(racingPlus: Mod) {
  racingPlus.AddCallback(
    ModCallbacks.MC_POST_EFFECT_INIT,
    postEffectInit.poof01,
    EffectVariant.POOF01, // 15
  );

  racingPlus.AddCallback(
    ModCallbacks.MC_POST_EFFECT_INIT,
    postEffectInit.creepRed,
    EffectVariant.CREEP_RED, // 22
  );

  racingPlus.AddCallback(
    ModCallbacks.MC_POST_EFFECT_INIT,
    postEffectInit.playerCreepGreen,
    EffectVariant.PLAYER_CREEP_GREEN, // 53
  );
}

// 55
function registerPostEffectUpdateCallbacks(racingPlus: Mod) {
  racingPlus.AddCallback(
    ModCallbacks.MC_POST_EFFECT_UPDATE,
    postEffectUpdate.heavenLightDoor,
    EffectVariant.HEAVEN_LIGHT_DOOR, // 39
  );
}

// 69
function registerPreNPCUpdateCallbacks(racingPlus: Mod) {
  racingPlus.AddCallback(
    ModCallbacks.MC_PRE_NPC_UPDATE,
    preNPCUpdate.momsHand,
    EntityType.ENTITY_MOMS_HAND, // 213
  );
  racingPlus.AddCallback(
    ModCallbacks.MC_PRE_NPC_UPDATE,
    preNPCUpdate.momsDeadHand,
    EntityType.ENTITY_MOMS_DEAD_HAND, // 287
  );
}
