// Define imports
import * as NPCUpdate from "./callbacks/NPCUpdate";
import * as postUpdate from "./callbacks/postUpdate";
import { VERSION } from "./constants";
import g from "./globals";
import isaacScriptInit from "./isaacScriptInit";
import * as schoolbag from "./items/schoolbag";

// Initialize some IsaacScript-specific functions
isaacScriptInit();

// Register the mod
// (which will make it show up in the list of mods on the mod screen in the main menu)
const racingPlus = RegisterMod("Racing+", 1);

// Make a copy of this object so that we can use it elsewhere
g.racingPlus = racingPlus; // (this is needed for saving and loading the "save.dat" file)

// Set some specific global variables so that other mods can access Racing+ functionality
declare let RacingPlusSchoolbag: any; // eslint-disable-line @typescript-eslint/no-explicit-any
RacingPlusSchoolbag = schoolbag; // eslint-disable-line prefer-const

// Define miscellaneous callbacks
racingPlus.AddCallback(ModCallbacks.MC_NPC_UPDATE, NPCUpdate.main); // 0
racingPlus.AddCallback(ModCallbacks.MC_POST_UPDATE, postUpdate.main); // 1
/*
racingPlus.AddCallback(ModCallbacks.MC_POST_RENDER, postRender.main); // 2
racingPlus.AddCallback(ModCallbacks.MC_USE_ITEM, useItem.main); // 3
racingPlus.AddCallback(ModCallbacks.MC_USE_CARD, useCard.main); // 5
racingPlus.AddCallback(ModCallbacks.MC_EVALUATE_CACHE, evaluateCache.main); // 8
racingPlus.AddCallback(ModCallbacks.MC_POST_PLAYER_INIT, postPlayerInit.main); // 9
racingPlus.AddCallback(ModCallbacks.MC_USE_PILL, usePill.main); // 10
racingPlus.AddCallback(ModCallbacks.MC_POST_CURSE_EVAL, postCurseEval.main); // 12
racingPlus.AddCallback(ModCallbacks.MC_POST_GAME_STARTED, postGameStarted.main); // 15
racingPlus.AddCallback(ModCallbacks.MC_POST_GAME_END, speedrun.postGameEnd); // 16
racingPlus.AddCallback(ModCallbacks.MC_POST_NEW_LEVEL, postNewLevel.main); // 18
racingPlus.AddCallback(ModCallbacks.MC_POST_NEW_ROOM, postNewRoom.main); // 19
racingPlus.AddCallback(ModCallbacks.MC_GET_CARD, getCard.main); // 20
racingPlus.AddCallback(ModCallbacks.MC_EXECUTE_CMD, executeCmd.main); // 22
racingPlus.AddCallback(ModCallbacks.MC_PRE_ENTITY_SPAWN, PreEntitySpawn.Main); // 24
racingPlus.AddCallback(ModCallbacks.MC_POST_NPC_INIT, FastClear.PostNPCInit); // 27
racingPlus.AddCallback(
  ModCallbacks.MC_POST_PICKUP_UPDATE,
  PostPickupUpdate.Main,
); // 35
racingPlus.AddCallback(ModCallbacks.MC_POST_BOMB_UPDATE, PostBombUpdate.Main); // 58
racingPlus.AddCallback(ModCallbacks.MC_POST_FIRE_TEAR, PostFireTear.Main); // 61
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_GET_COLLECTIBLE,
  PreGetCollectible.Main,
); // 62
racingPlus.AddCallback(ModCallbacks.MC_GET_PILL_EFFECT, GetPillEffect.Main); // 65
racingPlus.AddCallback(
  ModCallbacks.MC_POST_ENTITY_REMOVE,
  FastClear.PostEntityRemove,
); // 67
racingPlus.AddCallback(ModCallbacks.MC_POST_ENTITY_KILL, PostEntityKill.Main); // 68
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN,
  PreRoomEntitySpawn.Main,
); // 71

// Define NPC callbacks (0)
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.Globin,
  EntityType.ENTITY_GLOBIN, // 24
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.FearImmunity,
  EntityType.ENTITY_HOST, // 27
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.Chub,
  EntityType.ENTITY_CHUB, // 28
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.FlamingHopper,
  EntityType.ENTITY_FLAMINGHOPPER, // 54
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.Pin,
  EntityType.ENTITY_PIN, // 62
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.Death,
  EntityType.ENTITY_DEATH, // 66
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.FreezeImmunity,
  EntityType.ENTITY_BLASTOCYST_BIG, // 74
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.FreezeImmunity,
  EntityType.ENTITY_BLASTOCYST_MEDIUM, // 75
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.FreezeImmunity,
  EntityType.ENTITY_BLASTOCYST_SMALL, // 76
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.FearImmunity,
  EntityType.ENTITY_MOBILE_HOST, // 204
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.SpeedupHand,
  EntityType.ENTITY_MOMS_HAND, // 213
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  FastClear.Ragling,
  EntityType.ENTITY_RAGLING, // 246
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.SpeedupHand,
  EntityType.ENTITY_MOMS_DEAD_HAND, // 287
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.SpeedupGhost,
  EntityType.ENTITY_WIZOOB, // 219
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.Dingle,
  EntityType.ENTITY_DINGLE, // 261
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.SpeedupGhost,
  EntityType.ENTITY_RED_GHOST, // 285
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.TheLamb,
  EntityType.ENTITY_THE_LAMB, // 273
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.MegaSatan2,
  EntityType.ENTITY_MEGA_SATAN_2, // 273
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  FastClear.Stoney,
  EntityType.ENTITY_STONEY, // 302
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.FearImmunity,
  EntityType.ENTITY_FORSAKEN, // 403
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.UltraGreed, // 406
  EntityType.ENTITY_ULTRA_GREED,
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.BigHorn,
  EntityType.ENTITY_BIG_HORN, // 411
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  NPCUpdate.Matriarch,
  EntityType.ENTITY_MATRIARCH, // 413
);

// Define post-use item callbacks (3)
racingPlus.AddCallback(
  ModCallbacks.MC_USE_ITEM,
  UseItem.Teleport, // This callback is also used by Broken Remote
  CollectibleType.COLLECTIBLE_TELEPORT, // 44
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_ITEM,
  UseItem.D6,
  CollectibleType.COLLECTIBLE_D6, // 105
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_ITEM,
  UseItem.ForgetMeNow,
  CollectibleType.COLLECTIBLE_FORGET_ME_NOW, // 127
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_ITEM,
  UseItem.BlankCard,
  CollectibleType.COLLECTIBLE_BLANK_CARD, // 286
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_ITEM,
  UseItem.Undefined,
  CollectibleType.COLLECTIBLE_UNDEFINED, // 324
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_ITEM,
  UseItem.Void,
  CollectibleType.COLLECTIBLE_VOID, // 477
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_ITEM,
  UseItem.MovingBox,
  CollectibleType.COLLECTIBLE_MOVING_BOX, // 523
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_ITEM,
  Debug.Main,
  CollectibleType.COLLECTIBLE_DEBUG,
);

// Define post-use item callbacks for seeding player-generated pedestals (3)
racingPlus.AddCallback(
  ModCallbacks.MC_USE_ITEM,
  UseItem.PlayerGeneratedPedestal,
  CollectibleType.COLLECTIBLE_BLUE_BOX, // 297
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_ITEM,
  UseItem.PlayerGeneratedPedestal,
  CollectibleType.COLLECTIBLE_EDENS_SOUL, // 490
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_ITEM,
  UseItem.PlayerGeneratedPedestal,
  CollectibleType.COLLECTIBLE_MYSTERY_GIFT, // 515
);

// Define card callbacks (5)
racingPlus.AddCallback(
  ModCallbacks.MC_USE_CARD,
  UseCard.Teleport,
  Card.CARD_FOOL,
); // 1
racingPlus.AddCallback(
  ModCallbacks.MC_USE_CARD,
  UseCard.Teleport,
  Card.CARD_EMPEROR,
); // 5
racingPlus.AddCallback(
  ModCallbacks.MC_USE_CARD,
  UseCard.Justice,
  Card.CARD_JUSTICE,
); // 9
racingPlus.AddCallback(
  ModCallbacks.MC_USE_CARD,
  UseCard.Teleport,
  Card.CARD_HERMIT,
); // 10
racingPlus.AddCallback(
  ModCallbacks.MC_USE_CARD,
  UseCard.Strength,
  Card.CARD_STRENGTH,
); // 12
racingPlus.AddCallback(
  ModCallbacks.MC_USE_CARD,
  UseCard.Teleport,
  Card.CARD_STARS,
); // 18
racingPlus.AddCallback(
  ModCallbacks.MC_USE_CARD,
  UseCard.Teleport,
  Card.CARD_MOON,
); // 19
racingPlus.AddCallback(
  ModCallbacks.MC_USE_CARD,
  UseCard.Teleport,
  Card.CARD_JOKER,
); // 31
racingPlus.AddCallback(
  ModCallbacks.MC_USE_CARD,
  UseCard.BlackRune,
  Card.RUNE_BLACK,
); // 41
racingPlus.AddCallback(
  ModCallbacks.MC_USE_CARD,
  UseCard.QuestionMark,
  Card.CARD_QUESTIONMARK,
); // 48

// Define evaluate cache callbacks (8)
racingPlus.AddCallback(
  ModCallbacks.MC_EVALUATE_CACHE,
  evaluateCache.damage,
  CacheFlag.CACHE_DAMAGE, // 1
);
racingPlus.AddCallback(
  ModCallbacks.MC_EVALUATE_CACHE,
  evaluateCache.fireDelay,
  CacheFlag.CACHE_FIREDELAY, // 2
);
racingPlus.AddCallback(
  ModCallbacks.MC_EVALUATE_CACHE,
  evaluateCache.shotSpeed,
  CacheFlag.CACHE_SHOTSPEED, // 4
);
racingPlus.AddCallback(
  ModCallbacks.MC_EVALUATE_CACHE,
  evaluateCache.range,
  CacheFlag.CACHE_RANGE, // 8
);
racingPlus.AddCallback(
  ModCallbacks.MC_EVALUATE_CACHE,
  evaluateCache.speed,
  CacheFlag.CACHE_SPEED, // 16
);
racingPlus.AddCallback(
  ModCallbacks.MC_EVALUATE_CACHE,
  evaluateCache.luck,
  CacheFlag.CACHE_LUCK, // 1024
);

// Define pill callbacks (10)
racingPlus.AddCallback(
  ModCallbacks.MC_USE_PILL,
  UsePill.HealthDown,
  PillEffect.PILLEFFECT_HEALTH_DOWN, // 6
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_PILL,
  UsePill.HealthUp,
  PillEffect.PILLEFFECT_HEALTH_UP, // 7
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_PILL,
  UsePill.Telepills,
  PillEffect.PILLEFFECT_TELEPILLS, // 19
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_PILL,
  UsePill.OneMakesYouLarger,
  PillEffect.PILLEFFECT_LARGER, // 32
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_PILL,
  UsePill.OneMakesYouSmaller,
  PillEffect.PILLEFFECT_SMALLER, // 33
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_PILL,
  UsePill.InfestedExclamation,
  PillEffect.PILLEFFECT_INFESTED_EXCLAMATION, // 34
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_PILL,
  UsePill.InfestedQuestion,
  PillEffect.PILLEFFECT_INFESTED_QUESTION, // 35
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_PILL,
  UsePill.PowerPill,
  PillEffect.PILLEFFECT_POWER, // 36
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_PILL,
  UsePill.RetroVision,
  PillEffect.PILLEFFECT_RETRO_VISION, // 37
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_PILL,
  UsePill.Horf,
  PillEffect.PILLEFFECT_HORF, // 44
);

// Define entity damage callbacks (11)
racingPlus.AddCallback(
  ModCallbacks.MC_ENTITY_TAKE_DMG,
  EntityTakeDmg.Player,
  EntityType.ENTITY_PLAYER, // 1
);
racingPlus.AddCallback(
  ModCallbacks.MC_ENTITY_TAKE_DMG,
  Season7.EntityTakeDmgRemoveArmor,
  EntityType.ENTITY_ULTRA_GREED, // 406
);
racingPlus.AddCallback(
  ModCallbacks.MC_ENTITY_TAKE_DMG,
  Season7.EntityTakeDmgRemoveArmor,
  EntityType.ENTITY_HUSH, // 407
);

// Define input action callbacks (13)
racingPlus.AddCallback(
  ModCallbacks.MC_INPUT_ACTION,
  InputAction.IsActionPressed,
  InputHook.IS_ACTION_PRESSED, // 0
);
racingPlus.AddCallback(
  ModCallbacks.MC_INPUT_ACTION,
  InputAction.IsActionTriggered,
  InputHook.IS_ACTION_TRIGGERED, // 1
);
racingPlus.AddCallback(
  ModCallbacks.MC_INPUT_ACTION,
  InputAction.GetActionValue,
  InputHook.GET_ACTION_VALUE, // 2
);

// Define pre-use item callbacks (23)
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_USE_ITEM,
  PreUseItem.WeNeedToGoDeeper,
  CollectibleType.COLLECTIBLE_WE_NEED_GO_DEEPER, // 84
);
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_USE_ITEM,
  PreUseItem.BookOfSin,
  CollectibleType.COLLECTIBLE_BOOK_OF_SIN, // 97
);
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_USE_ITEM,
  PreUseItem.DeadSeaScrolls,
  CollectibleType.COLLECTIBLE_DEAD_SEA_SCROLLS, // 124
);
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_USE_ITEM,
  PreUseItem.GuppysHead,
  CollectibleType.COLLECTIBLE_GUPPYS_HEAD, // 145
);
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_USE_ITEM,
  PreUseItem.GlowingHourGlass,
  CollectibleType.COLLECTIBLE_GLOWING_HOUR_GLASS, // 422
);
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_USE_ITEM,
  PreUseItem.Smelter,
  CollectibleType.COLLECTIBLE_SMELTER, // 479
);

// Define pre-use item callbacks for preventing item pedestal effects (23)
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_USE_ITEM,
  PreUseItem.PreventItemPedestalEffects,
  CollectibleType.COLLECTIBLE_D6, // 105
  // This callback will also fire for D100, D Infinity when used as a D6/D100, && Dice Shard
  // However, we will want to explicitly hook D100 && D Infinity since they be able to use the
  // provided recharge to get infinite item uses
);
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_USE_ITEM,
  PreUseItem.PreventItemPedestalEffects,
  CollectibleType.COLLECTIBLE_D100, // 283
);
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_USE_ITEM,
  PreUseItem.PreventItemPedestalEffects,
  CollectibleType.COLLECTIBLE_DIPLOPIA, // 347
);
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_USE_ITEM,
  PreUseItem.PreventItemPedestalEffects,
  CollectibleType.COLLECTIBLE_VOID, // 477
);
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_USE_ITEM,
  PreUseItem.PreventItemPedestalEffects,
  CollectibleType.COLLECTIBLE_CROOKED_PENNY, // 485
);
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_USE_ITEM,
  PreUseItem.PreventItemPedestalEffects,
  CollectibleType.COLLECTIBLE_DINF, // 489
);
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_USE_ITEM,
  PreUseItem.PreventItemPedestalEffects,
  CollectibleType.COLLECTIBLE_MOVING_BOX, // 523
);

// Define post-NPC-initialization callbacks (27)
racingPlus.AddCallback(
  ModCallbacks.MC_POST_NPC_INIT,
  PostNPCInit.Baby,
  EntityType.ENTITY_BABY, // 38
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_NPC_INIT,
  Season7.PostNPCInitIsaac,
  EntityType.ENTITY_ISAAC, // 102
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_NPC_INIT,
  PostNPCInit.TheHaunt,
  EntityType.ENTITY_THE_HAUNT, // 260
);

// Define post-NPC-render callbacks (28)
racingPlus.AddCallback(
  ModCallbacks.MC_POST_NPC_RENDER,
  PostNPCRender.Pitfall,
  EntityType.ENTITY_PITFALL, // 291
);

// Define post pickup init callbacks (34)
racingPlus.AddCallback(
  ModCallbacks.MC_POST_PICKUP_INIT,
  PostPickupInit.Coin,
  PickupVariant.PICKUP_COIN, // 20
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_PICKUP_INIT,
  PostPickupInit.CheckSpikedChestUnavoidable,
  PickupVariant.PICKUP_SPIKEDCHEST, // 52
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_PICKUP_INIT,
  PostPickupInit.CheckSpikedChestUnavoidable,
  PickupVariant.PICKUP_MIMICCHEST, // 54
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_PICKUP_INIT,
  PostPickupInit.TarotCard,
  PickupVariant.PICKUP_TAROTCARD, // 300
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_PICKUP_INIT,
  PostPickupInit.BigChest,
  PickupVariant.PICKUP_BIGCHEST, // 340
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_PICKUP_INIT,
  PostPickupInit.Trophy,
  PickupVariant.PICKUP_TROPHY, // 370
);

// Define post pickup update callbacks (35)
racingPlus.AddCallback(
  ModCallbacks.MC_POST_PICKUP_UPDATE,
  PostPickupUpdate.Heart,
  PickupVariant.PICKUP_HEART, // 10
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_PICKUP_UPDATE,
  PostPickupUpdate.Coin,
  PickupVariant.PICKUP_COIN, // 20
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_PICKUP_UPDATE,
  PostPickupUpdate.Collectible,
  PickupVariant.PICKUP_COLLECTIBLE, // 100
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_PICKUP_UPDATE,
  PostPickupUpdate.TarotCard,
  PickupVariant.PICKUP_TAROTCARD, // 300
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_PICKUP_UPDATE,
  PostPickupUpdate.Trinket,
  PickupVariant.PICKUP_TRINKET, // 350
);

// Define post laser init callbacks (47)
racingPlus.AddCallback(
  ModCallbacks.MC_POST_LASER_INIT,
  PostLaserInit.GiantRed,
  g.LaserVariant.LASER_GIANT_RED, // 6
);

// Define post effect init callbacks (54)
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_INIT,
  PostEffectInit.Poof01,
  EffectVariant.POOF01, // 15
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_INIT,
  PostEffectInit.HotBombFire,
  EffectVariant.HOT_BOMB_FIRE, // 51
);

// Define post effect update callbacks (55)
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_UPDATE,
  PostEffectUpdate.Devil,
  EffectVariant.DEVIL, // 6
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_UPDATE,
  PostEffectUpdate.TearPoof,
  EffectVariant.TEAR_POOF_A, // 12
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_UPDATE,
  PostEffectUpdate.TearPoof,
  EffectVariant.TEAR_POOF_B, // 13
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_UPDATE,
  PostEffectUpdate.HeavenLightDoor,
  EffectVariant.HEAVEN_LIGHT_DOOR, // 39
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_UPDATE,
  PostEffectUpdate.DiceFloor,
  EffectVariant.DICE_FLOOR, // 76
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_UPDATE,
  PostEffectUpdate.Trapdoor,
  EffectVariant.TRAPDOOR_FAST_TRAVEL,
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_UPDATE,
  PostEffectUpdate.Trapdoor,
  EffectVariant.WOMB_TRAPDOOR_FAST_TRAVEL,
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_UPDATE,
  PostEffectUpdate.Trapdoor,
  EffectVariant.BLUE_WOMB_TRAPDOOR_FAST_TRAVEL,
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_UPDATE,
  PostEffectUpdate.Crawlspace,
  EffectVariant.CRAWLSPACE_FAST_TRAVEL,
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_UPDATE,
  PostEffectUpdate.HeavenDoor,
  EffectVariant.HEAVEN_DOOR_FAST_TRAVEL,
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_UPDATE,
  PostEffectUpdate.VoidPortal,
  EffectVariant.VOID_PORTAL_FAST_TRAVEL,
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_UPDATE,
  PostEffectUpdate.MegaSatanTrapdoor,
  EffectVariant.MEGA_SATAN_TRAPDOOR,
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_UPDATE,
  PostEffectUpdate.CrackTheSkyBase,
  EffectVariant.CRACK_THE_SKY_BASE,
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_UPDATE,
  PostEffectUpdate.StickyNickel,
  EffectVariant.STICKY_NICKEL,
);

// Define post bomb init callbacks (57)
racingPlus.AddCallback(
  ModCallbacks.MC_POST_BOMB_INIT,
  PostBombInit.SetTimer,
  BombVariant.BOMB_TROLL, // 3
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_BOMB_INIT,
  PostBombInit.SetTimer,
  BombVariant.BOMB_SUPERTROLL, // 4
);

// Define post entity kill callbacks (68)
racingPlus.AddCallback(
  ModCallbacks.MC_POST_ENTITY_KILL,
  PostEntityKill.Mom,
  EntityType.ENTITY_MOM, // 45
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_ENTITY_KILL,
  PostEntityKill.MomsHeart,
  EntityType.ENTITY_MOMS_HEART, // 78
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_ENTITY_KILL,
  PostEntityKill.Fallen,
  EntityType.ENTITY_FALLEN, // 81
  // (to handle fast-drops)
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_ENTITY_KILL,
  PostEntityKill.Angel,
  EntityType.ENTITY_URIEL, // 271
  // (to handle fast-drops)
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_ENTITY_KILL,
  PostEntityKill.Angel,
  EntityType.ENTITY_GABRIEL, // 272
  // (to handle fast-drops)
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_ENTITY_KILL,
  PostEntityKill.UltraGreed,
  EntityType.ENTITY_ULTRA_GREED, // 406
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_ENTITY_KILL,
  PostEntityKill.MomsHeart, // Hush uses the Mom's Heart callback
  EntityType.ENTITY_HUSH, // 407
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_ENTITY_KILL,
  PostEntityKill.RoomClearDelayNPC,
  EntityType.ENTITY_ROOM_CLEAR_DELAY_NPC,
);

// Define pre NPC update callbacks (69)
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_NPC_UPDATE,
  PreNPCUpdate.Hand,
  EntityType.ENTITY_MOMS_HAND, // 213
);
racingPlus.AddCallback(
  ModCallbacks.MC_PRE_NPC_UPDATE,
  PreNPCUpdate.Hand,
  EntityType.ENTITY_MOMS_DEAD_HAND, // 287
);

// Samael callbacks
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE, // 0
  Samael.scytheUpdate,
  EntityType.ENTITY_SAMAEL_SCYTHE,
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE, // 0
  Samael.specialAnimFunc,
  EntityType.ENTITY_SAMAEL_SPECIAL_ANIMATIONS,
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_UPDATE, // 1
  Samael.roomEntitiesLoop,
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_UPDATE, // 1
  Samael.PostUpdate,
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_UPDATE, // 1
  Samael.PostUpdateFixBugs,
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_ITEM, // 3
  Samael.postReroll,
  CollectibleType.COLLECTIBLE_D4, // 284
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_ITEM, // 3
  Samael.postReroll,
  CollectibleType.COLLECTIBLE_D100, // 283
);
racingPlus.AddCallback(
  ModCallbacks.MC_USE_ITEM, // 3
  Samael.activateWraith, // 3
  CollectibleTypeCustom.COLLECTIBLE_WRAITH_SKULL,
);
racingPlus.AddCallback(
  ModCallbacks.MC_FAMILIAR_UPDATE, // 6
  Samael.hitBoxFunc, // 6
  FamiliarVariant.SACRIFICIAL_DAGGER, // 35
);
racingPlus.AddCallback(
  ModCallbacks.MC_EVALUATE_CACHE, // 8
  Samael.cacheUpdate,
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_PLAYER_INIT, // 9
  Samael.PostPlayerInit,
);
racingPlus.AddCallback(
  ModCallbacks.MC_ENTITY_TAKE_DMG, // 11
  Samael.scytheHits,
);
racingPlus.AddCallback(
  ModCallbacks.MC_ENTITY_TAKE_DMG, // 11
  Samael.playerDamage,
  EntityType.ENTITY_PLAYER, // 1
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_GAME_STARTED, // 15
  Samael.PostGameStartedReset,
);

// Jr. Fetus callbacks
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE, // 0
  JrFetus.UpdateDrFetus,
  Isaac.GetEntityTypeByName("Dr Fetus Jr"),
);
racingPlus.AddCallback(
  ModCallbacks.MC_ENTITY_TAKE_DMG, // 11
  JrFetus.DrFetusTakeDamage,
  Isaac.GetEntityTypeByName("Dr Fetus Jr"),
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_EFFECT_UPDATE, // 55
  JrFetus.UpdateMissileTarget,
  Isaac.GetEntityVariantByName("FetusBossTarget"),
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_ENTITY_KILL, // 68
  JrFetus.DrFetusEmbryoKill,
  Isaac.GetEntityTypeByName("Dr Fetus Boss Embryo"),
);

// Mahalath callbacks
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE, // 0
  Mahalath.check_girl,
  Isaac.GetEntityTypeByName("Mahalath"),
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE, // 0
  Mahalath.check_mouth,
  Isaac.GetEntityTypeByName("Barf Mouth"),
);
RacingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE, // 0
  Mahalath.check_balls,
  Isaac.GetEntityTypeByName("Barf Ball"),
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE,
  Mahalath.check_bomb,
  Isaac.GetEntityTypeByName("Barf Bomb"),
);
racingPlus.AddCallback(
  ModCallbacks.MC_NPC_UPDATE, // 0
  Mahalath.check_del,
  EntityType.ENTITY_DELIRIUM, // 412
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_UPDATE, // 1
  Mahalath.PostUpdate,
);
racingPlus.AddCallback(
  ModCallbacks.MC_ENTITY_TAKE_DMG, // 11
  Mahalath.take_dmg,
);

// Potato Dummy callbacks
racingPlus.AddCallback(
  ModCallbacks.MC_POST_UPDATE, // 1
  PotatoDummy.PostUpdate,
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_RENDER, // 2
  PotatoDummy.PostRender,
);
racingPlus.AddCallback(
  ModCallbacks.MC_ENTITY_TAKE_DMG, // 11
  PotatoDummy.EntityTakeDmg,
  EntityType.ENTITY_NERVE_ENDING, // 231
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_GAME_STARTED, // 15
  PotatoDummy.PostGameStarted,
);
racingPlus.AddCallback(
  ModCallbacks.MC_POST_NEW_ROOM, // 19
  PotatoDummy.PostNewRoom,
);

// MinimapAPI init
if (MinimapAPI !== undefined) {
  const customIcons = Sprite();
  customIcons.Load("gfx/pills/custom_icons.anm2", true);
  // Getting rid of the ugly white pixel
  MinimapAPI.AddIcon(
    "PillOrangeOrange",
    customIcons,
    "CustomIconPillOrangeOrange",
    0,
  ); // 3
  // Red dots / red --> full red
  MinimapAPI.AddIcon(
    "PillReddotsRed",
    customIcons,
    "CustomIconPillReddotsRed",
    0,
  ); // 5
  // Pink red / red --> white / red
  MinimapAPI.AddIcon("PillPinkRed", customIcons, "CustomIconPillPinkRed", 0); // 6
  // Getting rid of the ugly white pixel
  MinimapAPI.AddIcon(
    "PillYellowOrange",
    customIcons,
    "CustomIconPillYellowOrange",
    0,
  ); // 8
  // White dots / white --> full white dots
  MinimapAPI.AddIcon(
    "PillOrangedotsWhite",
    customIcons,
    "CustomIconPillOrangedotsWhite",
    0,
  ); // 9
  // Cleaner sprite for Emergency Contact (5.300.50)
  MinimapAPI.AddIcon("MomsContract", customIcons, "CustomIconMomsContract", 0);
  // New sprite for Blank Rune (5.300.40)
  MinimapAPI.AddIcon("BlankRune", customIcons, "CustomIconBlankRune", 0);
  MinimapAPI.AddPickup(
    "BlankRune",
    "BlankRune",
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TAROTCARD,
    Card.RUNE_BLANK,
    MinimapAPI.PickupNotCollected,
    "runes",
    1200,
  );
  // New sprite for Black Rune (5.300.41)
  MinimapAPI.AddIcon("BlackRune", customIcons, "CustomIconBlackRune", 0);
  MinimapAPI.AddPickup(
    "BlackRune",
    "BlackRune",
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TAROTCARD,
    Card.RUNE_BLACK,
    MinimapAPI.PickupNotCollected,
    "runes",
    1200,
  );
  // New sprite for Rules Card (5.300.44)
  MinimapAPI.AddIcon("Rules", customIcons, "CustomIconRules", 0);
  MinimapAPI.AddPickup(
    "Rules",
    "Rules",
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TAROTCARD,
    Card.CARD_RULES,
    MinimapAPI.PickupNotCollected,
    "cards",
    1200,
  );
  // New sprite for Suicide King (5.300.46)
  MinimapAPI.AddIcon("SuicideKing", customIcons, "CustomIconSuicideKing", 0);
  MinimapAPI.AddPickup(
    "SuicideKing",
    "SuicideKing",
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TAROTCARD,
    Card.CARD_SUICIDE_KING,
    MinimapAPI.PickupNotCollected,
    "cards",
    1200,
  );
  // New sprite for ? Card (5.300.48)
  MinimapAPI.AddIcon("QuestionMark", customIcons, "CustomIconQuestionMark", 0); // 48
  MinimapAPI.AddPickup(
    "QuestionMark",
    "QuestionMark",
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TAROTCARD,
    Card.CARD_QUESTIONMARK,
    MinimapAPI.PickupNotCollected,
    "cards",
    1200,
  );
}

// Bugfix for Mod Config Menu
const MCMExists;
const MCM = pcall(require, "scripts.modconfig");
if (MCMExists) {
  MCM.RoomIsSafe = () => {
    return true;
  };
}
*/

// Welcome banner
const modName = "Racing+";
const welcomeText = `${modName} ${VERSION} initialized.`;
const hyphens = "-".repeat(welcomeText.length);
const welcomeTextBorder = `+-${hyphens}-+`;
Isaac.DebugString(welcomeTextBorder);
Isaac.DebugString(`| ${welcomeText} |`);
Isaac.DebugString(welcomeTextBorder);
