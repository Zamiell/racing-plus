# Racing+ Mod Room Changes

<!-- markdownlint-disable MD033 -->

## Table of Contents

1. [Balance Changes](#balance-changes)
1. [Softlock Fixes](#softlock-fixes)
1. [Unavoidable Damage Fixes](#unavoidable-damage-fixes)
1. [Bug Fixes](#bug-fixes)
1. [Miscellaneous Changes](#miscellaneous-changes)
1. [Rooms That Were Deliberately Not Changed](#rooms-that-were-deliberately-not-changed)

<br>

## Balance Changes

Firstly, some rooms were purely changed for balance (racing) reasons. Rooms that were changed for other reasons are listed in different sections.

<br>

### Devil & Angel Room Rebalancing

#### Both

- Items per room have been redistributed for consistency.
- All fires are removed.
- All doors are enabled.
- New room designs have been added and others have been removed.
- Some rooms have custom weight.

#### Devil Rooms

- The average item per room is increased from 1.64 to 1.96.
- All rooms with 1 item have an additional reward.
- All rooms with 2 or more item pedestals have no extra rewards.
- All enemies are removed.
- In "Number Magnet" rooms, there are enemies in every room, but there are always 3 item pedestals.

#### Angel Rooms

- The average item per room is increased from 1.34 to 1.51.
- All rooms with 1 item pedestal have 2 Angel Statues. In some rooms, there is an additional reward.
- All rooms with 2 item pedestals have 1 Angel Statue and have no extra rewards.

<!-- In vanilla, all of the room shapes are normal and all of the doors are enabled. -->

<br>

### Trapdoor Room

On Sheol, there exists a room with a trapdoor that takes you directly to the Dark Room without having to fight Satan. This puts too much of an extreme lower bound on the clear time of the floor.

(There are also other rooms with trapdoors, but they are earlier on in the game and are not as impactful.)

- Sheol: #290

<br>

## Softlock Fixes

A softlock is a condition where:

- it is impossible to beat the run
- the player is forced to save and quit to beat the run
- the player is forced to stand still for an unreasonable amount of time to beat the run

There are several softlocks in the vanilla game.

<br>

### Low Range Fix

Low range builds softlock in certain rooms. The rooms are fixed by moving the enemies closer.

- Caves: #226, #305
- Catacombs: #305
- Flooded: #226, #305
- Depths: #226, #416
- Necropolis: #226, #416
- Dank: #226, #416
- Womb: #458, #459
- Utero: #458, #459
- Scarred: #458, #459

<br>

### Pooter Fix

On certain rooms in the Basement/Cellar, some Pooters can fly over rocks, causing a pseudo-softlock.

- Basement: #132, #391 (moved the Pooters)
- Basement: #811 (replaced with Gapers)
- Burning: #132, #405 (moved the Pooters)
- Burning: #825 (replaced with Flaming Gapers)

<br>

### Stone Grimace Fix

In certain rooms, having very large tears causes a softlock in rooms with Stone Grimaces next to poops and/or fires. This is because the Stone Grimace hitbox takes priority.

- Necropolis: #885 (deleted the fire)
- Womb: #692 (moved the Red Poops to the side)
- Utero: #680 (moved the Red Poops to the side)
- Scarred: #705 (moved the Red Poops to the side)
- Womb: #809 (removed the Red Poop)

<br>

### Round Worm Fix

In some rooms, Round Worms can cause a pseudo-softlock if they continue to appear behind rocks. Some rocks were replaced with poops to mitigate this.

- Basement: #301
- Burning: #301

<br>

### Lump Fix

In L rooms and 2x2 rooms, Tar Boys and Lumps can pseudo-softlock the player by constantly appearing outside of vision. This results in the clear time of the room being highly reliant on RNG. In these rooms, Tar Boys are replaced with Black Bonies, Dank Globins, Dank Chargers, or Sticky Leapers. Lumps are replaced with Mr. Red Maws, Tumors, or Swingers.

- Dank Depths: #893, #894, #896, #905, #906, #907, #908, #962, #1091
- Womb: #398, #419, #430, #514, #667, #731, #745
- Utero: #398, #419, #430, #655, #729, #743
- Scarred: #398, #419, #430, #514, #680, #753

<br>

### Bishop & Flies Fix

In some rooms, it is impossible to kill a Bishop if it is surrounded by enemies.

- Cathedral: #430

<br>

### Swarm Spider Fix

In some rooms, Swarm Spiders can get stuck in inaccessible parts of the room.

- Cellar: #1023
- Burning: #1192

<br>

### Trite Fix

In one room, Trites can get stuck in the top part of the room.

- Cellar: #1021

<br>

## Unavoidable Damage Fixes

Racing+ is somewhat conservative with what it classifies as unavoidable damage. Difficult rooms are not considered unavoidable damage. Many hours have been spent testing the viability of rooms with various builds.

<br>

### Unfair Narrow Room Adjustment

While not technically unavoidable, many narrow rooms have near-impossible attack patterns, especially on Dr. Fetus builds.

- Depths: #638 (Mom's Dead Hand) (deleted)
- Necropolis: #616 (Mom's Dead Hand) (deleted)
- Womb: #598 (Mom's Dead Hand) (deleted)
- Utero: #586 (Mom's Dead Hand) (deleted)
- Scarred: #611 (Mom's Dead Hand) (deleted)
- Cathedral: #255 (Uriel) (changed to 1x1)
- Cathedral: #260 (Gabriel) (changed to 1x1)
- Sheol: #257, #275, #308 (Mom's Dead Hand) (deleted)
- Chest: #114 (Headless Horseman Head x2) (changed to 1x1)
- Chest: #121 (Mega Maw) (changed to 1x1)
- Chest: #127 (The Fallen) (changed to 1x1)
- Chest: #135 (Gurdy Jr.) (deleted)
- Dark Room: #123, #142 (Teratoma) (deleted)
- Dark Room: #124, #143 (The Fallen) (deleted)
- Dark Room: #138 (4 Nulls) (deleted)
- Dark Room: #180 (5 Nulls) (deleted)
- Boss: #2305 (Krampus) (deleted)
- Boss: #2306 (Krampus) (deleted)

<br>

### Maneuverability Fix

Some rooms are so packed with entities that they are unavoidable damage on Dr. Fetus and Ipecac. In such rooms, space has been cleared near the doors.

- Womb: #787 (narrow room with Nerve Endings)
- Utero: #776 (narrow room with Nerve Endings)
- Scarred: #787 (narrow room with Nerve Endings)

<br>

### Red Fire Puzzle Room Removal

The puzzle rooms with the red fires along the sides of the room have no consistent strategy with which to avoid the random shots.

- Basement: #771
- Cellar: #771
- Burning: #785

<br>

### Close Fires Fix

In some rooms, fires spawn close to the entrance. If the fire becomes a champion red fire, then the player can take unavoidable damage. This bug has been fixed by replacing the Fire with Fire Places, which are guaranteed to not spawn as red fires.

- Depths: #826
- Necropolis: #812
- Dank: #826

<br>

### Hive Fix

In some rooms, the Drowned Chargers that spawn from a Hive can be unavoidable damage. The Hives have been slightly moved to accommodate for this.

- Caves: #519
- Flooded: #527

<br>

### Spikes Fix

In some rooms, a Slide causes unavoidable damage.

- Depths: #708
- Necropolis: #684
- Dank: #706

<br>

## Bug Fixes

The Racing+ mod tries to fix as many bugs as possible.

<br>

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

<br>

### Boss Item Fixes

In some boss rooms, it is not possible to enter a Devil Room / Angel Room on the bottom without taking the boss item.

- #2031 (Loki)
- #3311 (Lokii)
- #4041 (Death)

<br>

### Door Fixes

On certain rooms, doors are disabled for no good reason.

- Chest: #39 (double Mega Maw)

<br>

### Entity Stacking Fixes

On some rooms with a black heart, [Edmund forgot to implement entity stacking](http://bindingofisaac.com/post/90431619124/insert-size-matters-joke-here).

- Caves: #267
- Flooded: #267

<br>

### Out of Bounds Fixes

In some rooms, entities are placed out of bounds, which causes glitchy behavior.

- Necropolis: #1092

## Miscellaneous Changes

<br>

### Close Enemies Fix

Due to bug fixes in May 2018, most enemies that spawn near an entrance are no longer completely unavoidable damage. However, enemies that spawn very close to doors are unfair in certain circumstances, and it is more reasonable to have enemies spawn at least 2 tiles away from the player.

- Basement: #126 (Mulligan/Mulligoon)
- Basement: #359 (Mulligan)
- Basement: #393 (Mulligan)
- Burning: #373, #407 (Mulligan)
- Cellar: #126 (Mulligan/Mulligoon)
- Cellar: #359 (Mulligan)
- Burning: #126 (Mulligan/Mulligoon)
- Caves: #48 (Red Boom Fly)
- Caves: #165 (Attack Fly)
- Caves: #440 (Boom Fly)
- Caves: #890 (Maggot)
- Catacombs: #44 (Red Boom Fly)
- Catacombs: #440 (Boom Fly)
- Catacombs: #884 (Maggot)
- Flooded: #48 (Red Boom Fly)
- Flooded: #165 (Attack Fly)
- Flooded: #448 (Boom Fly)
- Flooded: #898 (Maggot)
- Flooded: #953 (Drowned Boom Fly)
- Womb: #203 (Lump)
- Womb: #333 (Fistula)
- Womb: #410 (Sucker)
- Utero: #3 (Guts)
- Utero: #333 (Fistula)
- Utero: #410 (Sucker)
- Scarred: #333 (Fistula)
- Scarred: #410 (Sucker)
- Cathedral: #28 (Holy Leech)
- Sheol: #28 (Kamikaze Leech)
- Sheol: #212 (Cage)
- Chest: #53, #72, #84 (Fistula)
- Chest: #54 (Blastocyst)
- Dark Room: #104 (Sisters Vis)
- Dark Room: #106, #140 (Kamikaze Leech)
- Dark Room: #132 (Bone Knight)
- Chub: #1033 (Charger)
- I AM ERROR: #26 (moved pickups)

<br>

### Empty Room Removal

Some rooms in the game do not have anything in them. These types of rooms rob the player of interesting gameplay.

- Basement: #36, #315
- Cellar: #36
- Burning: #36, #315
- Caves: #170
- Flooded: #170
- Depths: #427
- Dank: #427
- Cathedral: #54, #87
- Sheol: #87
- Chest: #42

<br>

### Mostly Empty Room Removal

Some rooms in the game only have a few rocks, pits, etc. These types of rooms rob the player of interesting gameplay.

- Basement: #13, #15, #26, #27, #29, #89, #141, #144, #217, #218, #223, #226, #229, #230, #281, #282, #286, #287, #288, #291, #292, #338, #384, #520, #600, #601, #617, #619, #621, #622, #623, #636, #749, #753, #760, #761, #768, #900, #951, #952, #954, #976, #979, #1072, #1084
- Cellar: #21, #26, #27, #29, #52, #89, #141, #144, #210, #211, #212, #213, #214, #254, #255, #256, #257, #258, #299, #304, #305, #306, #308, #338, #520, #600, #601, #617, #621, #622, #636, #749, #753, #760, #761, #768, #900, #951, #952, #954, #1044
- Burning: #13, #15, #26, #27, #29, #89, #141, #144, #217, #218, #223, #226, #229, #230, #281, #282, #286, #287, #288, #291, #292, #338, #398, #534, #614, #615, #631, #633, #635, #636, #637, #650, #763, #767, #774, #775, #782, #914, #965, #966, #968, #988, #991, #1225
- Downpour: #27, #90, #122, #139, #140, #144, #161, #162, #164, #210, #212, #213, #219, #220, #258, #259, #314, #317, #513, #5000, #5011
- Dross: #22, #52, #79, #92, #93, #97, #114, #139, #141, #142, #146, #147, #153, #154, #198, #201, #267, #307, #362, #485, #512, #550, #5000, #5010
- Caves: #213, #215, #216, #263, #264, #310, #311, #312, #686, #688, #689, #713, #846, #857, #897, #902, #986
- Catacombs: #139, #207, #208, #209, #210, #247, #248, #249, #250, #251, #294, #295, #296, #297, #310, #311, #312, #680, #682, #686, #707, #840, #851
- Flooded: #213, #215, #216, #263, #264, #310, #311, #312, #694, #696, #697, #721, #854, #865, #1047, #1104
- Mines: #0, #5, #7, #15, #20, #22, #23, #45, #50, #62, #408, #5000, #5030
- Ashpit: #1, #6, #7, #15, #19, #21, #22, #40, #245, #247, #288, #366, #507, #508, #512, #723, #5000, #5029
- Depths: #196, #199, #287, #288, #289, #290, #291, #693, #825, #883, #1013, #10000, #10009
- Catacombs: #196, #199, #287, #288, #289, #290, #291, #670, #811, #856, #898, #906, #920, #10000, #10009
- Depths: #196, #199, #287, #288, #289, #290, #291, #691, #825, #990, #998, #1136, #10000, #10009
- Necropolis: #196, #199, #287, #288, #289, #290, #291, #10000, #10009
- Dank: #196, #199, #287, #288, #289, #290, #291, #990, #10000, #10009
- Mausoleum: #18, #19, #53, #86, #101, #102, #362, #437, #475
- Gehenna: #23, #35, #52, #66, #67, #260, #374, #401, #442, #494, #495, #539, #540
- Womb: #177, #178, #179, #180, #181, #214, #215, #216, #217, #218, #266, #267, #268, #269, #270, #676, #687, #827
- Utero: #177, #178, #179, #180, #181, #214, #215, #216, #217, #218, #266, #267, #268, #269, #270, #664, #675, #803, #804, #1071
- Scarred: #177, #178, #179, #180, #181, #214, #215, #216, #217, #218, #266, #267, #268, #269, #270, #689, #700, #821
- Corpse: #5, #33, #52, #115, #116, #190
- Cathedral: #26, #71, #221, #256, #257, #259, #261, #262, #473
- Sheol: #71, #286, #291, #513, #516, #519
- Chest: #26, #142, #143, #199

<br>

### Stacked Entity Fix

Some rooms have the chance to be empty because of stacked entities.

- Basement: #875 (Portal)
- Cellar: #875 (Portal)
- Burning: #889 (Portal)

<br>

### Donation Machine Room Removal

One room in the Necropolis has a donation machine in it. Since removing curses also removes donation machines from the game, this room is largely useless.

- Necropolis: #467

<br>

### Beggars in Angel Shops

Beggars are moved out of the way in all angel shops. This is a quality-of-life change.

- #40
- #41
- #42
- #43
- #44
- #45

<br>

### Hush Fly Fix

The Hush Flies that are placed in some rooms are given the same armor scaling that Hush is, so they have been replaced with Attack Flies.

- Depths: #829, #857
- Necropolis: #815, #843
- Dank: #829, #857

<br>

### Bumbino Fix

There are some Bumbino Rooms where players have to sit and wait for him to break out of his rock cage. This is a waste of time.

- Cathedral: #360
- Bumbino: #5273, #5274

<br>

### Trivial Puzzle Room Removal

There are some puzzle rooms that are completely trivial and just waste the player's time.

- Depths: #944
- Necropolis: #950
- Dank Depths: #1039

### Symmetry Fix

Certain rooms in the game were probably meant to be symmetrical, but one entity was incorrectly placed. This is fixed.

- Treasure: #30, #32
- Basement: #581
- Burning: #405, #595
- Caves: #26, #53, #118, #416, #541
- Flooded: #26, #53, #118, #416, #549, #918, #987
- Sheol: #58
- Cathedral: #9, #10, #21, #39, #57, #454
- Chest: #193
- Curse Room: #24
- Monstro II: #1051
- Headless Horseman: #4050
- The Gate: #5042

<br>

### Miscellaneous

- Wormwood room #5182 was modified to remove the pits next to the doors, which gives the player slightly more time to react to the faster Wormwood mechanic.
- Double Trouble room #3762 was changed to move the skulls away from the trapdoor (so that spawned Hosts do not interact with the trapdoor).

<br>
