import { ISCFeature, ModCallbackCustom, upgradeMod } from "isaacscript-common";
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

const CUSTOM_CALLBACKS_USED = [
  ModCallbackCustom.POST_AMBUSH_STARTED,
  ModCallbackCustom.POST_BOMB_EXPLODED,
  ModCallbackCustom.POST_BONE_SWING,
  ModCallbackCustom.POST_CURSED_TELEPORT,
  ModCallbackCustom.POST_CUSTOM_REVIVE,
  ModCallbackCustom.POST_FIRST_ESAU_JR,
  ModCallbackCustom.POST_FIRST_FLIP,
  ModCallbackCustom.POST_FLIP,
  ModCallbackCustom.POST_GAME_STARTED_REORDERED,
  ModCallbackCustom.POST_GRID_ENTITY_INIT,
  ModCallbackCustom.POST_GRID_ENTITY_REMOVE,
  ModCallbackCustom.POST_GRID_ENTITY_STATE_CHANGED,
  ModCallbackCustom.POST_GRID_ENTITY_UPDATE,
  ModCallbackCustom.POST_ITEM_PICKUP,
  ModCallbackCustom.POST_NEW_LEVEL_REORDERED,
  ModCallbackCustom.POST_NEW_ROOM_REORDERED,
  ModCallbackCustom.POST_NPC_INIT_LATE,
  ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED,
  ModCallbackCustom.POST_PICKUP_COLLECT,
  ModCallbackCustom.POST_PLAYER_CHANGE_TYPE,
  ModCallbackCustom.POST_PLAYER_INIT_LATE,
  ModCallbackCustom.POST_PRESSURE_PLATE_UPDATE,
  ModCallbackCustom.POST_PURCHASE,
  ModCallbackCustom.POST_ROOM_CLEAR_CHANGED,
  ModCallbackCustom.POST_SACRIFICE,
  ModCallbackCustom.POST_SLOT_ANIMATION_CHANGED,
  ModCallbackCustom.POST_TEAR_INIT_VERY_LATE,
  ModCallbackCustom.POST_TRANSFORMATION,
  ModCallbackCustom.PRE_CUSTOM_REVIVE,
  ModCallbackCustom.PRE_ITEM_PICKUP,
] as const;

const modVanilla = RegisterMod(MOD_NAME, 1);
export const mod = upgradeMod(
  modVanilla,
  ISC_FEATURES_FOR_THIS_MOD,
  CUSTOM_CALLBACKS_USED,
);
