import { TupleWithMaxLength } from "isaacscript-common";
import { Config } from "./classes/Config";
import { Hotkeys } from "./classes/Hotkeys";

type ConfigDescription = readonly [
  keyof Config | keyof Hotkeys | "",
  readonly [ModConfigMenuOptionType, string, string, string],
];

export type ConfigDescriptions = TupleWithMaxLength<
  ConfigDescription,
  typeof MAX_CONFIG_PAGE_LENGTH
>;

const MAX_CONFIG_PAGE_LENGTH = 10;

// 0001-0010
export const MAJOR_CHANGES = [
  [
    "ClientCommunication",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "001",
      "Enable client support",
      "Allow the mod to talk with the Racing+ client. You can disable this if you are not using the client to very slightly reduce lag.",
    ],
  ],
  [
    "StartWithD6",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "002",
      "Start with the D6",
      "Makes each character start with a D6 or a pocket D6.",
    ],
  ],
  [
    "DisableCurses",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "003",
      "Disable curses",
      "Disables all curses, like Curse of the Maze.",
    ],
  ],
  [
    "BetterDevilAngelRooms",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "004",
      "Better Devil/Angel Rooms",
      "Improves the quality and variety of Devil Rooms & Angel Rooms.",
    ],
  ],
  [
    "FreeDevilItem",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "005",
      "Free devil item",
      "Awards a Your Soul trinket upon entering the Basement 2 Devil Room if you have not taken damage.",
    ],
  ],
  [
    "FastReset",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "006",
      "Fast reset",
      "Instantaneously restart the game as soon as you press the R key.",
    ],
  ],
  [
    "FastClear",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "007",
      "Fast room clear",
      "Makes doors open at the beginning of the death animation instead of at the end.",
    ],
  ],
  [
    "FastTravel",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "008",
      "Fast floor travel",
      "Replace the fade-in and fade-out with a custom animation where you jump out of a hole. Also, replace the crawl space animation.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Room fixes",
      "Fixes various softlocks and bugs. This cannot be disabled because it affects the STB files.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Room flipping",
      "To increase run variety, all rooms have a chance to be flipped on the X axis, Y axis, or both axes.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// n/a
export const CUSTOM_HOTKEYS = [
  [
    "fastDropAll",
    [
      ModConfigMenuOptionType.KEY_BIND_KEYBOARD,
      "",
      "Fast drop",
      "Drop all of your items instantaneously.",
    ],
  ],
  [
    "fastDropTrinkets",
    [
      ModConfigMenuOptionType.KEY_BIND_KEYBOARD,
      "",
      "Fast drop (trinkets)",
      "Drop your trinkets instantaneously.",
    ],
  ],
  [
    "fastDropPocket",
    [
      ModConfigMenuOptionType.KEY_BIND_KEYBOARD,
      "",
      "Fast drop (pocket)",
      "Drop your pocket items instantaneously.",
    ],
  ],
  [
    "schoolbagSwitch",
    [
      ModConfigMenuOptionType.KEY_BIND_KEYBOARD,
      "",
      "Switch Schoolbag items",
      "Switch between Schoolbag items without swapping cards or switching to The Soul.",
    ],
  ],
  [
    "autofire",
    [
      ModConfigMenuOptionType.KEY_BIND_KEYBOARD,
      "",
      "Toggle autofire",
      "Enable autofire, which toggles the fire input on every frame.",
    ],
  ],
  [
    "console",
    [
      ModConfigMenuOptionType.KEY_BIND_KEYBOARD,
      "",
      "Toggle chat",
      "When in a race, this toggles the chat entry console. When not in a race, this will do nothing. If not set, this will default to Enter.",
    ],
  ],
  [
    "storage",
    [
      ModConfigMenuOptionType.KEY_BIND_KEYBOARD,
      "",
      "Storage",
      "Store the current item for later. (This only works in Season 4.)",
    ],
  ],
  [
    "roll",
    [
      ModConfigMenuOptionType.KEY_BIND_KEYBOARD,
      "",
      "Roll",
      "Do a barrel roll.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 0201-0210
export const CHARACTER_CHANGES = [
  [
    "JudasAddBomb", // 3
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0201",
      "Add a bomb to Judas",
      "Makes Judas start with 1 bomb instead of 0 bombs.",
    ],
  ],
  [
    "SamsonDropHeart", // 6
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0202",
      "Make Samson drop his trinket",
      "Makes Samson automatically drop his Child's Heart trinket at the beginning of a run.",
    ],
  ],
  [
    "ShowEdenStartingItems", // 9, 30
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0203",
      "Show Eden's starting items",
      "Draw both of Eden's starting items on the screen while in the first room.",
    ],
  ],
  [
    "LostUseHolyCard", // 31
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0204",
      "Automatically use the Holy Card",
      "Automatically use the Holy Card when starting a run as Tainted Lost.",
    ],
  ],
  [
    "TaintedKeeperMoney", // 33
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0205",
      "Tainted Keeper extra money",
      "Make Tainted Keeper start with 15 cents. This gives him enough money to start a Treasure Room item.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 0301-0310
export const BOSS_CHANGES_1 = [
  [
    "FadeBosses",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0301",
      "Fade dead bosses",
      "Make bosses faded during their death animation so that you can see the dropped item.",
    ],
  ],
  [
    "FastBossRush",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0302",
      "Fast Boss Rush",
      "The mandatory waiting between bosses is removed.",
    ],
  ],
  [
    "RemoveArmor",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0303",
      "Remove armor",
      "Remove damage scaling from all of the bosses that have it.",
    ],
  ],
  [
    "FastMom", // 45, 78
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0304",
      "Kill extra enemies",
      "Extra enemies will properly die after defeating Mom, Mom's Heart, or It Lives!",
    ],
  ],
  [
    "FastPin", // 62
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0305",
      "Fast Pin",
      "Make Pin, Frail, Scolex, and Wormwood spend less time underground.",
    ],
  ],
  [
    "PreventDeathSlow", // 66
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0306",
      "Stop Death's slow attack",
      "Stop Death from performing the attack that reduces your speed by a factor of 2.",
    ],
  ],
  [
    "FastBlastocyst", // 74
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0307",
      "Fast The Haunt",
      "Some animations in The Haunt fight are sped up.",
    ],
  ],
  [
    "FastKrampus", // 81
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0308",
      "Fast Krampus",
      "Make Krampus immediately drop his item once he is killed.",
    ],
  ],
  [
    "FastSatan", // 84
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0309",
      "Fast Satan",
      "All of the waiting during the Satan Fight is removed.",
    ],
  ],
  [
    "FastHaunt", // 260
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0310",
      "Fast The Haunt",
      "Some animations in The Haunt fight are sped up.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 0311-0320
export const BOSS_CHANGES_2 = [
  [
    "FastAngels", // 271, 272
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0311",
      "Fast angels",
      "Make Uriel and Gabriel immediately drop their key piece once they are killed.",
    ],
  ],
  [
    "ConsistentAngels", // 271, 272
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0312",
      "Consistent angels",
      "Prevent two of the same angel boss from spawning in the same room.",
    ],
  ],
  [
    "RemoveLambBody", // 273
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0313",
      "Remove The Lamb body",
      "Remove The Lamb body entirely once it dies.",
    ],
  ],
  [
    "PreventVictoryLapPopup", // 273
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0314",
      "Stop the Victory Lap popup",
      "Prevent the Victory Lap popup from appearing once you defeat The Lamb.",
    ],
  ],
  [
    "FastMegaSatan", // 274, 275
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0315",
      "Fast Mega Satan",
      "Remove some animations in the Mega Satan fight.",
    ],
  ],
  [
    "PreventEndMegaSatan", // 275
    [
      ModConfigMenuOptionType.TEXT,
      "0316",
      "Prevent Mega Satan ending",
      "Defeating Mega Satan no longer has a chance to immediately end the run.",
    ],
  ],
  [
    "OpenHushDoor", // 407
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0317",
      "Open the Hush door",
      "Automatically open the big door to Hush when you arrive on the Blue womb.",
    ],
  ],
  [
    "FastHush", // 407
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0318",
      "Fast Hush",
      'Make Hush no longer play an "Appear" animation.',
    ],
  ],
  [
    "FastBigHorn", // 411
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0319",
      "Fast Big Horn",
      "Make Big Horn spend less time underground.",
    ],
  ],
  [
    "FastHeretic", // 905
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0320",
      "Fast Heretic",
      "Make The Heretic fight start instantly.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 0321-0330
export const BOSS_CHANGES_3 = [
  [
    "FastColostomia", // 917
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0321",
      "Fast Colostomia",
      "Make Colostomia appear instantly.",
    ],
  ],
  [
    "FastDogma", // 950
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0322",
      "Fast Dogma",
      "Speed up Dogma's death animation (and skip the death cutscene).",
    ],
  ],
  [
    "PreventEndBeast", // 951
    [
      ModConfigMenuOptionType.TEXT,
      "0323",
      "Prevent The Beast ending",
      "Defeating The Beast no longer has a chance to immediately end the run.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 0401-0410
export const ENEMY_CHANGES_1 = [
  [
    "ClearerShadowAttacks",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0401",
      "Make shadow attacks clearer",
      "Make a blue target appear on the ground for the specific attacks that come from above.",
    ],
  ],
  [
    "FadeFriendlyEnemies",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0402",
      "Fade friendly enemies",
      "Fade friendly enemies to make it easier to see the real ones.",
    ],
  ],
  [
    "RemoveTreasureRoomEnemies",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0403",
      "Remove Treasure Room enemies",
      "Remove all enemies from Treasure Rooms.",
    ],
  ],
  [
    "GlobinSoftlock", // 24
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0404",
      "Fix Globin softlocks",
      "Make Globins permanently die on the 4th regeneration to prevent Epic Fetus softlocks.",
    ],
  ],
  [
    "AppearHands", // 213, 287
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0405",
      "Reveal hands",
      "Mom's Hands and Mom's Dead Hands will play an \"Appear\" animation.",
    ],
  ],
  [
    "FastHands", // 213, 287
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0406",
      "Fast hands",
      "Mom's Hands and Mom's Dead Hands have faster attack patterns.",
    ],
  ],
  [
    "VulnerableGhosts", // 219, 260, 285
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0407",
      "Disable invulnerability",
      "Wizoobs, Red Ghosts, and Lil' Haunts no longer have invulnerability frames after spawning.",
    ],
  ],
  [
    "FastGhosts", // 219, 285
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0408",
      "Fast ghosts",
      "Wizoobs and Red Ghosts have faster attack patterns.",
    ],
  ],
  [
    "ReplaceCodWorms", // 221
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0409",
      "Replace Cod Worms",
      "Cod Worms are replaced with Para-Bites.",
    ],
  ],
  [
    "RemoveStrayPitfalls", // 291
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0410",
      "Remove stray Pitfalls",
      "Kill all Pitfalls on room clear.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 0411-0420
export const ENEMY_CHANGES_2 = [
  [
    "FastPolties", // 816
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0411",
      "Fast Polties/Kinetis",
      "Make Polties & Kinetis show themselves immediately upon entering the room.",
    ],
  ],
  [
    "FastNeedles", // 881
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0412",
      "Fast Needles/Pasties",
      "Make Needles & Pasties spend less time underground.",
    ],
  ],
  [
    "FastDusts", // 882
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0413",
      "Fast Dusts",
      "Make Dusts never disappear.",
    ],
  ],
  [
    "DummyDPS", // 964
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0414",
      "Dummy DPS",
      "Make Dummies show the damage per second.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 0501-0510
export const QUALITY_OF_LIFE_CHANGES_1 = [
  [
    "AutomaticItemInsertion",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0501",
      "Automatically insert pickups",
      "When taking an item that drops pickups, automatically insert them into your inventory.",
    ],
  ],
  [
    "ChangeCreepColor",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0502",
      "Consistent creep color",
      "Change enemy red creep to green and change friendly green creep to red.",
    ],
  ],
  [
    "ChargePocketItemFirst",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0503",
      "Charge the Pocket item first",
      "Make batteries charge the pocket item first over the active item.",
    ],
  ],
  [
    "DeleteVoidPortals",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0504",
      "Delete Void portals",
      "Automatically delete the Void portals that spawn after bosses.",
    ],
  ],
  [
    "EasyFirstFloorItems",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0505",
      "Easier first floor items",
      "Slightly change first floor Treasure Rooms so that you never have to spend a bomb or walk on spikes.",
    ],
  ],
  [
    "FadeDevilStatue",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0506",
      "Fade Devil statue",
      "Fade the statue in a Devil Room if there are pickups behind it.",
    ],
  ],
  [
    "RunTimer",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0507",
      "Show the run timer",
      "Display a timer for in-game time when holding down the map button.",
    ],
  ],
  [
    "ShowMaxFamiliars",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0508",
      "Show max familiars",
      "Show an icon on the UI when you have the maximum amount of familiars (i.e. 64).",
    ],
  ],
  [
    "ShowNumSacrifices",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0509",
      "Show the number of sacrifices",
      "Show the number of sacrifices in the top-left when in a Sacrifice Room.",
    ],
  ],
  [
    "ShowPills",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0510",
      "Remember pills",
      "Hold the map button to see a list of identified pills for easy reference.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 0511-0520
export const QUALITY_OF_LIFE_CHANGES_2 = [
  [
    "SpeedUpFadeIn",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0511",
      "Speed-up new run fade-ins",
      "Speed-up the fade-in that occurs at the beginning of a new run.",
    ],
  ],
  [
    "SubvertTeleport",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0512",
      "Subvert disruptive teleports",
      "Stop the disruptive teleport that happens when entering a room with Gurdy, Mom, Mom's Heart, or It Lives!",
    ],
  ],
  [
    "TaintedSamsonChargeBar",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0513",
      "Show Tainted Samson charge bar",
      "Show a custom charge bar that lets you know how close you are to Berserk! activation.",
    ],
  ],
  [
    "BloodyLustChargeBar",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0514",
      "Show Bloody Lust charge bar",
      "Show a custom charge bar that lets you know how close you are to getting the maximum amount of damage from Bloody Lust.",
    ],
  ],
  [
    "LeadPencilChargeBar", // 444
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0515",
      "Show Lead Pencil charge bar",
      "It will only show in situations where the Lead Pencil will work normally.",
    ],
  ],
  [
    "AzazelsRageChargeBar", // 669
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0516",
      "Show Azazels' Rage charge bar",
      "Show a custom charge bar that lets you know how close you are to the blast firing.",
    ],
  ],
  [
    "CombinedDualityDoors", // 498
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0517",
      "Duality revamp",
      "Make Duality combine the Devil Room door and the Angel Room door together.",
    ],
  ],
  [
    "RemoveFortuneCookieBanners", // 557
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0518",
      "Remove Fortune Cookie UI",
      "Remove the banners that occur when you use Fortune Cookie.",
    ],
  ],
  [
    "ShowDreamCatcherItem", // 566
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0519",
      "Show the Dream Catcher item",
      "If you have Dream Catcher, draw the Treasure Room item while in the starting room of the floor.",
    ],
  ],
  [
    "FastLuna", // 589
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0520",
      "Fast Luna",
      "Make Moonlights from Luna able to be entered as soon as they spawn.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 0521-0530
export const QUALITY_OF_LIFE_CHANGES_3 = [
  [
    "FadeVasculitisTears", // 657
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0521",
      "Fade Vasculitis tears",
      "Fade the tears that explode out of enemies when you have Vasculitis.",
    ],
  ],
  [
    "FastVanishingTwin", // 697
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0522",
      "Fast Vanishing Twin",
      "Speed up the Vanishing Twin familiar by replacing it with a custom implementation.",
    ],
  ],
  [
    "FlipCustom", // 711
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0523",
      "Custom Flip",
      "Replace Flip with a custom version that more clearly shows what each item will change into.",
    ],
  ],
  [
    "RemovePerfectionVelocity", // 145
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0524",
      "Remove Perfection velocity",
      "Make the Perfection trinket spawn in a stationary spot so that it won't go over a pit.",
    ],
  ],
  [
    "RemovePerfectionOnEndFloors", // 145
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0525",
      "Remove Perfection at the end",
      "Prevent the Perfection trinket from spawning on the final floor of a run.",
    ],
  ],
  [
    "DisplayExpansionPack", // 181
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0526",
      "Remove Perfection at the end",
      "Prevent the Perfection trinket from spawning on the final floor of a run.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Start in the center",
      "On a new run, start in the center of the room (instead of at the bottom).",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 0601-0610
export const GAMEPLAY_CHANGES = [
  [
    "ExtraStartingItems",
    [
      ModConfigMenuOptionType.TEXT,
      "0601",
      "Extra Treasure Room Items",
      "Puts several extra good items in the Treasure Room pool to make finding a starting item easier.",
    ],
  ],
  [
    "ConsistentTrollBombs",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0602",
      "Consistent troll bombs",
      "Make Troll Bombs and Mega Troll Bombs always have a fuse timer of exactly 2 seconds.",
    ],
  ],
  [
    "PillsCancelAnimations",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0603",
      "Pills cancel animations",
      "Make Power Pill and Horf! cancel animations like all the other pills do.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Nerf Card Reading",
      "Make Card Reading no longer spawn portals on Womb 2 and beyond.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// n/a
export const REMOVALS = [
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove Mercurius",
      "It is incredibly powerful and not very skill-based. This cannot be disabled for seeding reasons.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove TMTRAINER",
      "It can trivialize runs and cause softlocks/crashes. This cannot be disabled for seeding reasons.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove glitched items",
      "They can trivialize runs and cause softlocks/crashes. This cannot be disabled for seeding reasons.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove Karma trinket",
      "Since all Donation Machines are removed, it has no effect. This cannot be disabled for seeding reasons.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove Amnesia and ??? pills",
      "Since curses are automatically removed, these pills have no effect. This cannot be disabled for seeding reasons.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove unbalanced Void synergies",
      "Make Mega Blast and Mega Mush removed from pools if the player starts with Void.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove Mom's Knife",
      "Remove Mom's Knife from the Treasure Room pool specifically.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 0801-0810
export const CUTSCENE_CHANGES = [
  [
    "FastTeleport",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0801",
      "Fast teleports",
      "Teleport animations are sped up by a factor of 2.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove intro cutscene",
      "Remove the intro cutscene so that you go straight to the main menu upon launching the game.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove ending cutscenes",
      "Remove the cutscenes that play upon completing a run.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove boss cutscenes",
      "Remove the cutscenes that play upon entering a boss room.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      'Remove "giantbook" animations',
      'Remove all "giantbook" style animations (with the exception of Book of Revelations, Satanic Bible, eternal hearts, and rainbow poop).',
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove pausing/unpausing animations",
      "Pause and unpause the game instantaneously.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 0901-0910
export const BUG_FIXES_1 = [
  [
    "TaintedIsaacCollectibleDelay",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0901",
      "Fix Tainted Isaac chest bugs",
      "Make Tainted Isaac not automatically pick up pedestal items from chests.",
    ],
  ],
  [
    "Battery9VoltSynergy",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0902",
      "Fix The Battery + 9 Volt synergy",
      "Make these items work together properly.",
    ],
  ],
  [
    "ReverseJusticeFix",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0903",
      "Fix Justice? cards",
      "Prevent Justice? cards from needlessly removing items from pools.",
    ],
  ],
  [
    "PreventUltraSecretRoomSoftlock",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0904",
      "Fix Ultra Secret Rooms softlocks",
      "A fool card will be spawned in Ultra Secret Rooms with no doors.",
    ],
  ],
  [
    "BatteryBumFix",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0905",
      "Fix Battery Bums",
      "Make Battery Bums properly charge pocket active items.",
    ],
  ],
  [
    "TeleportInvalidEntrance",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0906",
      "Fix bad teleports",
      "Never teleport to a non-existent entrance.",
    ],
  ],
  [
    "RemoveInvalidPitfalls",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "0907",
      "Remove invalid Pitfalls",
      "Remove buggy Pitfalls that incorrectly respawn after not having time to finish their disappearing animation.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fix crawl space exits",
      "Returning from a crawl space outside of the grid will no longer send you to the wrong room. (This is part of Fast-Travel.)",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fix I AM ERROR exits",
      "Exits in an I AM ERROR room will be blocked if the room is not clear. (This is part of Fast-Travel.)",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 0911-0920
export const BUG_FIXES_2 = [
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Seeded teleports",
      "Make Teleport!, Cursed Eye, Broken Remote, and Telepills teleports seeded properly.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "",
      "Seeded GB Bug",
      "Make morphed GB Bug pickups seeded in order.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 1001-1010
export const GRAPHIC_CHANGES_1 = [
  [
    "HUDOffsetFix",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1001",
      "Fix HUD offset",
      "Fix the default HUD offset to be the same as it was in Afterbirth+.",
    ],
  ],
  [
    "DrawControls",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1002",
      "Draw Controls",
      "Draw the controls on the starting room of the run.",
    ],
  ],
  [
    "PaschalCandle", // 3.221
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1003",
      "Better Paschal Candle",
      'Make Paschal Candle "fill up" so that you can easily tell at a glance if it is maxed out.',
    ],
  ],
  [
    "ScaredHeart", // 5.10.9
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1004",
      "Distinct Scared Hearts",
      "Make Sticky Nickels have a custom animation so that they are easier to identify.",
    ],
  ],
  [
    "StickyNickel", // 5.20.6
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1005",
      "Distinct Sticky Nickels",
      "Make Sticky Nickels have a custom effect so that they are easier to identify.",
    ],
  ],
  [
    "UniqueCardBacks", // 5.300
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1006",
      "Unique card backs",
      "Make some cards have a unique card back or modified graphic so that they are easier to identify.",
    ],
  ],
  [
    "HolidayHats",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1007",
      "Holiday hats",
      "Show a festive hat during a holiday.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Fix Heart UI",
      "Make empty red hearts easier to see.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Consistent pill orientation",
      "Pills now have a consistent orientation on the ground.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better pill colors",
      "The color of some pills are changed to make them easier to identify at a glance.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 1011-1020
export const GRAPHIC_CHANGES_2 = [
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better Purity colors",
      "The colors of some Purity auras have been changed to make them easier to see. Speed is now green and range is now yellow.",
    ],
  ],
  [
    "", // 5.100.57, 5.100.128, 5.100.364
    [
      ModConfigMenuOptionType.BOOLEAN,
      "",
      "Fix fly colors",
      "Make the Distant Admiration, Forever Alone, and Friend Zone sprites match the color of the familiars.",
    ],
  ],
  [
    "", // 5.100.245
    [
      ModConfigMenuOptionType.BOOLEAN,
      "",
      "Better 20/20",
      "Make the 20/20 sprite easier to see.",
    ],
  ],
  [
    "", // 5.100.651
    [
      ModConfigMenuOptionType.BOOLEAN,
      "",
      "Better Star of Bethlehem",
      "Make the Star of Bethlehem sprite more distinct from Eden's Soul.",
    ],
  ],
  [
    "", // 5.350.75
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better Error trinket",
      "Make the Error trinket sprite have an outline.",
    ],
  ],
  [
    "", // 5.350.115
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better Locust of Famine",
      "Make the Locust of Famine sprite match the color of the flies.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Better Dirty Bedroom icon",
      "Make the icon for a dirty bedroom a cobweb so that it is more distinct from a clean bedroom.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Speedrunning controls graphic",
      "The controls graphic in the start room is changed to be speedrunning-themed.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove the in-game timer",
      "Hold Tab to see a custom in-game timer.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Reduce opacity of fortunes",
      "Set the opacity for fortunes and custom seeds to 15%.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 1011-1020
export const GRAPHIC_CHANGES_3 = [
  [
    "",
    [
      ModConfigMenuOptionType.TEXT,
      "",
      "Remove fog",
      "Make elements on the screen easier to see and increase performance.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 1101-1110
export const SOUND_CHANGES = [
  [
    "SilenceMomDad",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1101",
      "Silence mom & dad",
      "The audio clips of mom and dad on the Ascent are silenced.",
    ],
  ],
] as const satisfies ConfigDescriptions;

// 1201-1210
export const OTHER_FEATURES = [
  [
    "Shadows",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1201",
      "Draw opponent's shadows",
      "Enable the drawing of race opponents as faded sprites during seeded races.",
    ],
  ],
  [
    "Chat",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1202",
      "Draw race chat",
      "Enable the drawing of race chat on the screen.",
    ],
  ],
  [
    "CharacterTimer",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "1203",
      "Enable character timer",
      "Enable a second timer that displays the time since the last checkpoint.",
    ],
  ],
  [
    "",
    [
      ModConfigMenuOptionType.BOOLEAN,
      "",
      "Force faded console display",
      'Enabled the "faded console display" feature in the "options.ini" file, which allows you to visually see when an error in the game happens.',
    ],
  ],
] as const satisfies ConfigDescriptions;

export const ALL_CONFIG_DESCRIPTIONS = [
  ...MAJOR_CHANGES,
  ...CHARACTER_CHANGES,
  ...BOSS_CHANGES_1,
  ...BOSS_CHANGES_2,
  ...BOSS_CHANGES_3,
  ...ENEMY_CHANGES_1,
  ...ENEMY_CHANGES_2,
  ...QUALITY_OF_LIFE_CHANGES_1,
  ...QUALITY_OF_LIFE_CHANGES_2,
  ...QUALITY_OF_LIFE_CHANGES_3,
  ...GAMEPLAY_CHANGES,
  ...CUTSCENE_CHANGES,
  ...REMOVALS,
  ...BUG_FIXES_1,
  ...BUG_FIXES_2,
  ...GRAPHIC_CHANGES_1,
  ...GRAPHIC_CHANGES_2,
  ...GRAPHIC_CHANGES_3,
  ...SOUND_CHANGES,
  ...OTHER_FEATURES,
] as const satisfies readonly ConfigDescription[];

export const ALL_HOTKEY_DESCRIPTIONS = [
  ...CUSTOM_HOTKEYS,
] as const satisfies readonly ConfigDescription[];
