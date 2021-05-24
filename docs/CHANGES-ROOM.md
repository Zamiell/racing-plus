# Racing+ Mod Room Changes

## Table of Contents

1. [Balance Changes](#balance-changes)
1. [Softlock Fixes](#softlock-fixes)
1. [Unavoidable Damage Fixes](#unavoidable-damage-fixes)
1. [Bug Fixes](#bug-fixes)
1. [Miscellaneous Changes](#miscellaneous-changes)
1. [Rooms That Were Deliberately Not Changed](#rooms-that-were-deliberately-not-changed)

<br />





## Balance Changes

Firstly, some rooms were purely changed for balance (racing) reasons. Rooms that were changed for other reasons are listed in different sections.

<br />

### Devil & Angel Room Rebalancing

#### Both

- Items per room have been redistributed for consistency.
- All fires are removed.
- All doors are enabled.
- New room designs have been added and others have been removed.
- Some rooms have custom weight.

#### Devil Rooms

- The average item per room is increased from [TODO] to [TODO].
- All rooms with 1 item have an additional reward.
- All rooms with 2 or more item pedestals have no extra rewards.
- All enemies are removed.

#### Angel Rooms

- The average item per room is increased from [TODO] to [TODO].
- All rooms with 1 item pedestal have 2 Angel Statues. In some rooms, there is an additional reward.
- All rooms with 2 item pedestals have 1 Angel Statue and have no extra rewards.

<br />

### Trapdoor Room

On Sheol, there exists a room with a trapdoor that takes you directly to the Dark Room without having to fight Satan. This puts too much of an extreme lower bound on the clear time of the floor.

(There are also other rooms with trapdoors, but they are earlier on in the game and are not as impactful to the balance.)

The deleted room is as follows:
- Sheol: #290

<br />





## Softlock Fixes

A softlock is a condition where:
- it is impossible to beat the run
- the player is forced to save and quit to beat the run
- the player is forced to stand still for an unreasonable amount of time to beat the run

There are several softlocks in the vanilla game.

<br />

### Low Range Fix

Low range builds softlock in certain rooms. The rooms are fixed by moving the enemies closer.

The changed rooms are as follows:
- Caves/Flooded: #226
- Caves/Catacombs/Flooded: #305
- Depths/Necropolis/Dank: #226, #416
- Womb/Utero/Scarred: #458, #459

<br />

### Pooter Fix

On certain rooms in the Basement/Cellar, some Pooters can fly over rocks, causing a pseudo-softlock.

The changed rooms are as follows:
- Basement/Burning: #132, #391 (moved the Pooters)
- Basement: #811 (replaced with Gapers)
- Burning: #825 (replaced with Gapers)

<br />

### Stone Grimace Fix

In certain rooms, having very large tears causes a softlock in rooms with Stone Grimaces next to poops and/or fires. This is because the Stone Grimace hitbox takes priority.

The changed rooms are as follows:
- Necropolis: #885 (deleted the fire)
- Womb: #692 (moved the Red Poops to the side)
- Utero: #680 (moved the Red Poops to the side)
- Scarred: #705 (moved the Red Poops to the side)
- Womb: #809 (removed the Red Poop)

<br />

### Round Worm Fix

In one room, Round Worms can cause a pseudo-softlock if they continue to appear behind rocks. Some rocks were replaced with poops to mitigate this.

The changed room is as follows:
- Basement/Burning: #301

<br />

### Lump Fix

In L rooms and 2x2 rooms, Tar Boys and Lumps can pseudo-softlock the player by constantly appearing outside of vision. This results in the clear time of the room being highly reliant on RNG. In these rooms, Tar Boys are replaced with Black Bonies or Dank Chargers, and Lumps are replaced with Mr. Red Maws, Tumors, or Guts.

The changed rooms are as follows:
- Dank Depths: #893, #894, #896, #905, #906, #907, #908, #962, #1091
- Womb/Utero/Scarred: #398, #419, #430,
- Womb/Scarred: #514
- Womb: #514, #667, #731, #745
- Utero: #655, #729, #743
- Scarred: #514, #680, #753

<br />

### Bishop & Flies Fix

In some rooms, it is impossible to kill a Bishop if it is surrounded by enemies.

The changed room is as follows:
- Cathedral: #430

<br />

### Swarm Spider Fix

In some rooms, Swarm Spiders can get stuck in inaccessible parts of the room.

The change room is as follows:

- Cellar: #1023
- Burning: #1192





## Unavoidable Damage Fixes

Racing+ is somewhat conservative with what it classifies as unavoidable damage. Difficult rooms are not considered unavoidable damage. Many hours have been spent testing the viability of rooms with various builds.

<br />

### Unfair Narrow Room Adjustment

While not technically unavoidable, many narrow rooms have near-impossible attack patterns, especially on Dr. Fetus builds.

The changed rooms are as follows:
- Depths: #638 (Mom's Dead Hand) (deleted)
- Necropolis: #616 (Mom's Dead Hand) (deleted)
- Dank: #637 (Mom's Dead Hand) (deleted)
- Womb: #598 (Mom's Dead Hand) (deleted)
- Utero: #586  (Mom's Dead Hand) (deleted)
- Scarred: #611 (Mom's Dead Hand) (deleted)
- Cathedral: #255 (Uriel) (changed to 1x1)
- Cathedral: #260 (Gabriel) (changed to 1x1)
- Sheol: #257, #275, #308 (Mom's Dead Hand) (deleted)
- Chest: #114 (Headless Horseman Head x2) (changed to 1x1)
- Chest: #116 (Monstro x2) (deleted)
- Chest: #121 (Mega Maw) (changed to 1x1)
- Chest: #125 (Monstro x2) (changed to 1x1)
- Chest: #127 (The Fallen) (changed to 1x1)
- Chest: #135 (Gurdy Jr.) (deleted)
- Chest: #161 (Monstro x4) (deleted)
- Dark Room: #123, #142 (Teratoma) (deleted)
- Dark Room: #124, #143 (The Fallen) (deleted)
- Dark Room: #138 (4 Nulls) (deleted)
- Dark Room: #180 (5 Nulls) (deleted)
- Boss: #2305 (Krampus) (deleted)
- Boss: #2306 (Krampus) (deleted)

<br />

### Maneuverability Fix

Some rooms are so packed with entities that they are unavoidable damage on Dr. Fetus and Ipecac. In such rooms, space has been cleared near the doors.

The changed room is as follows:
- Womb: #787 (narrow room with Nerve Endings)
- Utero: #776 (narrow room with Nerve Endings)
- Scarred: #787 (narrow room with Nerve Endings)

<br />

### Red Fire Puzzle Room Removal

The puzzle rooms with the red fires along the sides of the room have no consistent strategy with which to avoid the random shots.

The deleted room is as follows:
- Basement/Cellar: #771

<br />

### Close Fires Fix

In one room, fires spawn close to the entrance. If the fire becomes a champion red fire, then the player can take unavoidable damage. This bug has been fixed by replacing the Fire with Fire Places, which are guaranteed to not spawn as red fires.

The changed rooms are as follows:
- Depths/Dank: #826
- Necropolis: #812

<br />

### Hive Fix

In one room, the Drowned Chargers that spawn from a Hive can be unavoidable damage. The Hives have been slightly moved to accommodate for this.

The changed room is as follows:
- Caves: #519
- Flooded: #527

<br />

### Spikes Fix

In one room, a Slide causes unavoidable damage.

The deleted room is as follows:
- Depths: #708
- Necropolis: #684
- Dank: #706

<br />





## Bug Fixes

The Racing+ mod tries to fix as many bugs as possible.

<br />

### Boss Room Door Fix

If you have Duality and there is only 2 entrances to a boss room, the Angel Room will not spawn. For this reason, all non-narrow rooms were adjusted to allow for a third door where possible.

- #1025, #1027, #1028, #1048, #1049 (Larry Jr.)
- #1045 (Monstro)
- #1057 (Chub)
- #1089, #1095 (Little Horn)
- #1099 (Brownie)
- #2064 (Fistula)
- #3264, #3266 (The Hollow)
- #3701, #3713, #3714, #3716, #3756, #3760, #3762, #3765, #3766, #3767, #3769, #3807, #3811 (Double Trouble)
- #4012 (Famine)
- #4033 (Conquest)
- #5033 (Mega Maw)
- #5083 (Dark One)

<br />

### Door Fixes

On certain rooms, doors are disabled for no good reason.

The changed rooms are as follows:
- Chest: #39 (double Mega Maw)

<br />

### Entity Stacking Fixes

On one room with a black heart, [Edmund forgot to implement entity stacking](http://bindingofisaac.com/post/90431619124/insert-size-matters-joke-here).

The changed rooms are as follows:
- Caves/Flooded: #267

<br />





## Miscellaneous Changes

<br />

### Donation Machine Room Removal

One room in the Necropolis has a donation machine in it. Since removing curses also removes donation machines from the game, this room is largely useless.

The deleted room is as follows:
- Necropolis: #467

<br />

### Empty Room Removal

Some rooms in the game do not have anything in them (or just have a few rocks, pits, etc.). These types of rooms rob the player of interesting gameplay.

The removed rooms are as follows:
- [TODO USE A SCRIPT]
- Basement/Cellar/Burning: #26, #27, #29, #30, #39, #92, #144, #147, #338, #520, #600, #617, #621, #622, #749, #900, #951, #952
- Basement/Burning: #32, #217, #223, #229, #230, #281, #282, #286, #287, #288, #290, #291, #292, #315, #1039
- Cellar: #24, #32, #55, #210, #211, #212, #213, #254, #255, #256, #257, #258, #304, #305, #306, #307, #308
- Caves/Catacombs/Flooded: #310, #311, #312
- Caves/Flooded: #170, #213, #215, #216, #263, #264
- Caves: #926
- Catacombs: #141, #207, #209, #210, #247, #248, #249, #250, #294, #295, #296, #297
- Flooded: #1068
- Depths/Necropolis/Dank: #196, #287, #289, #290, #291
- Depths/Dank: #428
- Dank: #1027
- Womb/Utero/Scarred: #177, #178, #179, #180, #181, #214, #215, #217, #218, #267, #268, #269
- Cathedral: #28, #57, #287
- Sheol: #291
- Cathedral/Sheol: #73, #89
- Chest: #29, #42

Some rooms have the chance to be empty because of stacked entities.

The changed rooms are as follows:
- Basement/Cellar/Burning: #875 (Portal)

<br />

### Close Enemies Fix

Due to bug fixes in May 2018, most enemies that spawn near an entrance are no longer completely unavoidable damage. However, enemies that spawn very close to doors are unfair in certain circumstances, and it is more reasonable to have enemies spawn at least 2 squares away from the player.

The changed rooms are as follows:
- Basement: #393 (Mulligan)
- Burning: #373, #407 (Mulligan)
- Basement/Cellar: #359 (Mulligan)
- Basement/Cellar/Burning: #126 (Mulligan/Mulligoon)
- Caves/Catacombs: 440 (Boom Fly)
- Caves/Flooded: #48 (Red Boom Fly)
- Caves/Flooded: #165 (Attack Fly)
- Caves/Catacombs/Flooded: #44 (Boom Fly)
- Caves: #890 (Maggot)
- Catacombs: #267 (Night Crawler)
- Catacombs: #884 (Maggot)
- Flooded: #448 (Boom Fly)
- Flooded: #898 (Maggot)
- Flooded: #953 (Drowned Boom Fly)
- Depths: #14 (Brain)
- Womb/Utero/Scarred: #182 (Gurglings)
- Womb/Utero/Scarred: #333 (Fistula)
- Womb/Utero/Scarred: #410 (Sucker)
- Womb: #542 (Gurglings)
- Womb: #203 (Lump)
- Womb: #471 (Gurglings)
- Utero: #3 (Guts)
- Utero: #131 (Gurdy Jr.)
- Scarred: #555 (Gurglings)
- Cathedral: #28 (Holy Leech)
- Sheol: #28 (Kamikaze Leech)
- Sheol: #212 (Cage)
- Chest: #35, #87 (Gurglings)
- Chest: #53, #72, #84 (Fistula)
- Chest: #54 (Blastocyst)
- Dark Room: #104 (Sisters Vis)
- Dark Room: #106, #140 (Kamikaze Leech)
- Dark Room: #132 (Bone Knight)
- Chub: #1033 (Charger)
- I AM ERROR: #26 (moved pickups)

<br />

### Hush Fly Fix

The Hush Flies that are placed in some rooms are given the same armor scaling that Hush is, so they have been replaced with Attack Flies.

The changed rooms are as follows:
- Depths/Dank: #829, #857
- Necropolis: #815, #843

<br />

### Symmetry Fix

Certain rooms in the game were probably meant to be symmetrical, but one entity or tile was incorrectly placed. This is fixed.

The changed rooms are as follows:
- Basement: #581
- Burning: #595
- Caves/Flooded: #26, #53, #118, #416
- Caves: #541
- Flooded: #549, #918, #987
- Cathedral: #9, #10, #21, #39, #57
- Curse Room: #24
- Monstro II: #1051
- Headless Horseman: #4050
- The Gate: #5042

<br />

### Beggars in Angel Shops

Beggars are moved out of the way in all angel shops. This is a quality-of-life change.

The changed rooms are as follows:
- #40
- #41
- #42
- #43
- #44
- #45

<br />

### Bishop & Polty Fix

In some rooms, the developers forgot to mark rocks as non-replaceable.

The changed rooms are as follows:
- Cathedral: #435

<br />

### Miscellaneous

- Double Trouble room #3762 was changed to move the skulls away from the trapdoor (so that spawned Hosts would not interact with the trapdoor).

<br />
