import { ModCallback } from "isaac-typescript-definitions";
import {
  ISCFeature,
  logTearFlags,
  setTracebackFunctionsGlobal,
  upgradeMod,
} from "isaacscript-common";
import { MOD_NAME } from "./constants";

const ISC_FEATURES_FOR_THIS_MOD = [
  ISCFeature.COLLECTIBLE_ITEM_POOL_TYPE,
  ISCFeature.CUSTOM_HOTKEYS,
  ISCFeature.DEPLOY_JSON_ROOM,
  ISCFeature.DISABLE_INPUTS,
  ISCFeature.DISABLE_ALL_SOUND,
  ISCFeature.FLYING_DETECTION,
  ISCFeature.FORGOTTEN_SWITCH,
  ISCFeature.GAME_REORDERED_CALLBACKS,
  ISCFeature.ITEM_POOL_DETECTION,
  ISCFeature.EXTRA_CONSOLE_COMMANDS,
  ISCFeature.MODDED_ELEMENT_DETECTION,
  ISCFeature.MODDED_ELEMENT_SETS,
  ISCFeature.PERSISTENT_ENTITIES,
  ISCFeature.PONY_DETECTION,
  ISCFeature.PREVENT_COLLECTIBLE_ROTATION,
  ISCFeature.PREVENT_GRID_ENTITY_RESPAWN,
  ISCFeature.RUN_IN_N_FRAMES,
  ISCFeature.SAVE_DATA_MANAGER,
  ISCFeature.SPAWN_COLLECTIBLE,
] as const;

setTracebackFunctionsGlobal();
const modVanilla = RegisterMod(MOD_NAME, 1);
export const mod = upgradeMod(modVanilla, ISC_FEATURES_FOR_THIS_MOD);

mod.AddCallback(ModCallback.POST_FIRE_TEAR, (tear) => {
  logTearFlags(tear.TearFlags);
});
