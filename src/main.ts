import * as entityTakeDmg from "./callbacks/entityTakeDmg";
import * as evaluateCache from "./callbacks/evaluateCache";
import * as executeCmd from "./callbacks/executeCmd";
import * as getPillEffect from "./callbacks/getPillEffect";
import * as inputAction from "./callbacks/inputAction";
import * as NPCUpdate from "./callbacks/NPCUpdate";
import * as postCurseEval from "./callbacks/postCurseEval";
import * as postEntityKill from "./callbacks/postEntityKill";
import * as postEntityRemove from "./callbacks/postEntityRemove";
import * as postFamiliarRender from "./callbacks/postFamiliarRender";
import * as postFireTear from "./callbacks/postFireTear";
import * as postGameStarted from "./callbacks/postGameStarted";
import * as postNewLevel from "./callbacks/postNewLevel";
import * as postNewRoom from "./callbacks/postNewRoom";
import * as postNPCInit from "./callbacks/postNPCInit";
import * as postPlayerInit from "./callbacks/postPlayerInit";
import * as postRender from "./callbacks/postRender";
import * as postTearUpdate from "./callbacks/postTearUpdate";
import * as postUpdate from "./callbacks/postUpdate";
import * as preEntitySpawn from "./callbacks/preEntitySpawn";
import * as preGameExit from "./callbacks/preGameExit";
import { VERSION } from "./constants";
import { log } from "./misc";
import * as modConfigMenu from "./modConfigMenu";
import * as saveDat from "./saveDat";

// Register the mod
// (which will make it show up in the list of mods on the mod screen in the main menu)
const racingPlus = RegisterMod("Racing+", 1);

// Welcome banner
const modName = "Racing+";
const welcomeText = `${modName} ${VERSION} initialized.`;
const hyphens = "-".repeat(welcomeText.length);
const welcomeTextBorder = `+-${hyphens}-+`;
log(welcomeTextBorder);
log(`| ${welcomeText} |`);
log(welcomeTextBorder);

saveDat.setMod(racingPlus); // Give a copy of the mod object to the code in charge of saving
saveDat.load(); // Load the "save#.dat" file

// Racing+ integrates with Mod Config Menu
modConfigMenu.register();

// Register miscellaneous callbacks
racingPlus.AddCallback(ModCallbacks.MC_NPC_UPDATE, NPCUpdate.main); // 0
racingPlus.AddCallback(ModCallbacks.MC_POST_UPDATE, postUpdate.main); // 1
racingPlus.AddCallback(ModCallbacks.MC_POST_RENDER, postRender.main); // 2
racingPlus.AddCallback(ModCallbacks.MC_EVALUATE_CACHE, evaluateCache.main); // 8
racingPlus.AddCallback(ModCallbacks.MC_POST_PLAYER_INIT, postPlayerInit.main); // 9
racingPlus.AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, entityTakeDmg.main); // 11
racingPlus.AddCallback(ModCallbacks.MC_POST_CURSE_EVAL, postCurseEval.main); // 12
racingPlus.AddCallback(ModCallbacks.MC_INPUT_ACTION, inputAction.main); // 13
racingPlus.AddCallback(ModCallbacks.MC_POST_GAME_STARTED, postGameStarted.main); // 15
racingPlus.AddCallback(ModCallbacks.MC_PRE_GAME_EXIT, preGameExit.main); // 17
racingPlus.AddCallback(ModCallbacks.MC_POST_NEW_LEVEL, postNewLevel.main); // 18
racingPlus.AddCallback(ModCallbacks.MC_POST_NEW_ROOM, postNewRoom.main); // 19
racingPlus.AddCallback(ModCallbacks.MC_EXECUTE_CMD, executeCmd.main); // 22
racingPlus.AddCallback(ModCallbacks.MC_PRE_ENTITY_SPAWN, preEntitySpawn.main); // 24
racingPlus.AddCallback(ModCallbacks.MC_POST_NPC_INIT, postNPCInit.main); // 27
racingPlus.AddCallback(
  ModCallbacks.MC_POST_ENTITY_REMOVE,
  postEntityRemove.main,
); // 67
racingPlus.AddCallback(ModCallbacks.MC_POST_FIRE_TEAR, postFireTear.main); // 61
racingPlus.AddCallback(ModCallbacks.MC_GET_PILL_EFFECT, getPillEffect.main); // 65
racingPlus.AddCallback(ModCallbacks.MC_POST_ENTITY_KILL, postEntityKill.main); // 68

// Register NPC callbacks (0)
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.ragling,
  EntityType.ENTITY_RAGLING, // 246
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.stoney,
  EntityType.ENTITY_STONEY, // 302
);

// Register PostFamiliarRender callbacks (25)
racingPlus.AddCallback(
  ModCallbacks.MC_POST_FAMILIAR_RENDER,
  postFamiliarRender.paschalCandle,
  FamiliarVariant.PASCHAL_CANDLE,
);

// Register PostEffectInit callbacks (40)
racingPlus.AddCallback(
  ModCallbacks.MC_POST_TEAR_UPDATE,
  postTearUpdate.blood,
  TearVariant.BLOOD,
);
