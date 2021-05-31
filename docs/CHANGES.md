# Racing+ Mod Changes

<br />

## Website

If you want to learn more about Racing+, you can visit [the official website](https://isaacracing.net). If you want to know the changes that are present in the in-game mod, read on.

<br />

## Table of Contents

1. [Introduction](#introduction)
1. [Design Goals](#design-goals)
1. [List of Major Changes](#list-of-major-changes)
1. [List of Minor Changes](#list-of-minor-changes)
1. [Additional Changes for Races](#additional-changes-for-races)
1. [Additional Changes for Multi-Character Speedruns (Custom Challenges)](#additional-changes-for-multi-character-speedruns-custom-challenges)
1. [Individual Room Changes](#individual-room-changes)

<br />

## Introduction

Overall, the main point of the Racing+ mod is to enable multiplayer racing with out people. You will find that doing a speedrun using the Racing+ mod will be very similar to doing a speedrun on the vanilla game.

With that said, Racing+ does make a lot of smaller changes that you might not be able to pick-up on right away. This page documents every change that it performs.

Most changes are prefixed by a code, like: `001`. This signifies that the change can be toggled on and off using the [Mod Config Menu](https://steamcommunity.com/sharedfiles/filedetails/?id=2487535818&searchtext=modconfigmenu). If a change does not have a prefix, you won't be able to toggle that option, since it is accomplished by modifying the game's resource files directly.

<br />

## Design Goals

In terms of what to change about the game, the mod has several goals, and attempts to strike a balance between them. However, certain things are prioritized. The goals are listed below in order of importance:

1. to reward skillful play (in the context of speedrunning and racing)
1. to make the game more fun to play
1. to fix bugs and imperfections
1. to keep the game as "vanilla" as possible

<br />

## List of Major Changes

### 1) The D6 for Everyone

`001` All characters now start with the D6, either as a pocket item or an active item.

> Why? Much of the strategy in the game is centered around having this item. The best players win races more consistently when having the D6 because it mitigates run disparity.

### 2) No Curses

`002` All curses are automatically disabled.

> Why? Curses make the game less-skilled based, robbing the player of meaningful decision-making and strategy.

### 3) Devil Room & Angel Room Rebalancing

- Devil Rooms and Angel Rooms have been [customized](https://github.com/Zamiell/isaac-racing-client/blob/master/mod/CHANGES-ROOM.md#devil-room-rebalancing) for the purposes of slightly increasing the average number of items per room. Specifically:
  - Average items per devil room are increased from [TODO] to [TODO].
  - Average items per angel room are increased from [TODO] to [TODO].

> Why? The best players separate themselves from the mid-tier players by not taking any damage and getting every Devil Room / Angel Room. If the rewards from these rooms are not consistent enough, then the best players are not able to consistently win races.

- `003` On Basement 2, players receive a Your Soul trinket upon entering a Devil Room if they have not yet taken damage during the run.
  - Keeper and Tainted Keeper will be awarded 15 cents instead of a Your Soul trinket.

> Why? Some characters do not start with enough health to take the first devil deal, which is an important reward for playing perfectly. Instead of buffing the health of some characters, it is simpler to give every character one free devil deal (provided that they play flawlessly for the first two floors).

### 4) Fast-Reset

`004` The restart/reset key immediately restarts the game, as long as you have not entered more than 3 rooms.

> Why? In vanilla, the game enforces a 2 second limit between resets, but there is no good reason for imposing this limitation on players.Speeding this up makes resetting for a starting item less tedious.

### 5) Fast-Clear (Wrath of the Lamb Style Room Clear)

- `005` Rooms are considered cleared at the beginning of an enemy's death animation, rather than the end.

> Why? It is obnoxious to have to sit and wait for a boss' long death animation to finish before being able to proceed with the game. The game was never originally intended to have this behavior, as demonstrated by Wrath of the Lamb.

### 6) Fast-Travel Between Floors and Crawlspaces

- `006` The long fade-in and fade-out between floors is replaced with a custom animation where you jump out of a hole.
- `006` The long fade-in and fade-out between crawlspaces is replaced with the normal room transition animation.

### 7) Room Fixes

Rooms with unavoidable damage or bugs have been fixed or deleted.

### 8) Room Flipping

While there are thousands of rooms in the game, many players have already seen them all. To increase run variety, all rooms have a chance to be flipped on the X axis, Y axis, or both axes.

<!--

Post-flip actions:

1) Remove the duplicated start rooms for The Chest / Dark Room

2) Un-flip Y-flipped Gurdy rooms:
   The Chest - #20015, #30015

3) Un-flip double Gate rooms (and enable all of the doors)
   The Chest - #20040, #30040
   Dark Room - #20012, #30012

4) Un-flip some Mega Maw rooms:
   The Chest - #20039, #30039, #20259, #30259
   Dark Room - #20011, #30011

-->

<br />

## List of Minor Changes

### 1) Custom Hotkeys

- Racing+ allows you to bind some optional hotkeys via Mod Config Menu:
  - a fast-drop button (for everything)
  - a fast-drop button for only trinkets
  - a fast-drop button for only pocket items

### 2) Gameplay & Quality of Life Changes

- `021` Judas starts with a bomb.

> Why? Historically, Isaac was the main character used in tournaments. After Balls of Steel 4, tournaments started using Judas as the main character instead, since he had a higher damage multiplier. At this time, it was desirable for Judas to have a bomb so that he would play in a similar way to Isaac. Starting with a bomb makes the game slightly more skill-based, since it gives players the option to bomb a tinted rock, escape a slow 2x2 room, and so forth.

- `022` Samson's Child's Heart is automatically dropped.

>  Why? When playing as Samson, players immediately drop the Child's Heart to improve their odds at good room drops.

- `023` Tainted Keeper starts with 15 cents.

> Why? This gives Tainted Keeper enough money to start a Treasure Room item, which is considered to be essential for unseeded speedruns.

- `024` Eden's starting items will be shown in the starting room.

> Why? Many speedrunners do not use the in-game item tracker, since it clutters the screen. This feature allows players to quickly see what the Eden items are, allowing them to reset the game if the items are bad.

- `031` If you have Dream Catcher, the Treasure Room item will be shown in the starting room.

> Why? Since the Fast-Travel feature removes the floor transition cutscene, this is the only way to see what the Dream Catcher items are.

- `032` The fade in at the beginning of a run is sped-up.
- `033` The disruptive teleport from entering a room with Gurdy, Mom, Mom's Heart, or It Lives! no longer occurs.
- `034` Void portals that spawn after bosses are automatically deleted.

> Why? With very few exceptions, racers and speedrunners will never go to The Void. The random Void portals that spawn can be accidentally jumped into, ruining the current run.

- `035` Bosses will be faded during their death animation.

> Why? Bosses with long death animations obscure the identity of the item that drops, forcing players to wait for the death animation to complete before being able to take or roll the item. Furthermore, the death animation obscures other enemies that happen to be behind the dying boss.

- `036` The tears that explode out of enemies when you have Vasculitis are faded.

> Why? It can be very difficult to distinguish between friendly Vasculitis tears and enemy tears, since they will often be the same color.

- `037` The Hush door will be automatically opened.
- `038` Identified pills will be shown when the player presses the map button (tab). (Only up to 7 will be shown.)
- `041` A custom console is provided that is better than the vanilla console.

> Why? The vanilla console has an annoying animation and is inconvenient to use.

- The Karma trinket is removed.

> Why? Since all Donation Machines are removed, it has no effect.

- The Amnesia and ??? pills are removed.

> Why? Since curses are automatically removed, these pills have no effect.

<!--
- The Polaroid or The Negative will be automatically removed depending on your run goal.
- The trapdoor or the beam of light on Womb 2 will be automatically removed depending on your run goal or which photo you have.
- Some things that are unseeded are now seeded:
  - Teleport!, Undefined, Cursed Eye, Broken Remote, and Telepills teleports
  - Dead Sea Scrolls item selection
  - cards from Sloth, Super Sloth, Pride, and Super Pride
  - Guppy's Head fly count
- Void Portals are automatically deleted.
- Items that drop pickups on the ground will now automatically insert them into your inventory instead, if there is room. (However, Purple Heart, Mom's Toenail, The Tick, Faded Polaroid, and Ouroboros Worm are never inserted automatically.) This effect also applies to the Spun! transformation. Players can disable automatic insertion by holding down the drop button (or one of the fast-drop buttons).
- You will always be able to take an item in the Basement 1 Treasure Room without spending a bomb or being forced to walk on spikes.
- Troll Bombs and Mega Troll Bombs always have a fuse timer of exactly 2 seconds.
- Diagonal knife throws have a 3-frame window instead of a 1-frame window.
- Pin's first attack happens on the 15th frame (instead of the 73rd frame).
- Cod Worms are replaced with Para-Bites.
- Wizoobs, Red Ghosts, and Lil' Haunts no longer have invulnerability frames after spawning.
- Mom's Hands, Mom's Dead Hands, Wizoobs, and Red Ghosts have faster attack patterns.
- Death will no longer perform his slow attack.
- The pickup delay on reloaded pedestal items is decreased from 18 frames to 15 frames.
- The "Would you like to do a Victory Lap!?" popup no longer appears after defeating The Lamb.
- All pills can now be used to cancel pedestal pickup animations.
- The door to Hush is now automatically opened.
- The devil statue will be faded if there is an item pedestal hiding behind it.
- There is now a sound effect when a Walnut or a Wishbone breaks.
-->

### 3) Cutscene & Animation Removal

- The intro that occurs when you launch the game is removed.
- The cutscenes that occur when finishing a run are removed.
- The cutscenes that occur before each boss are removed.
- Some animations are removed for the purposes of eliminating needless downtime:
<!--
  - the fade when entering or exiting crawlspaces (replaced with a normal room transition animation)
-->
  - all "giantbook" animations (with the exception of Book of Revelations, Satanic Bible, eternal hearts, and rainbow poop)
  - the pause and unpause animations
<!--
  - traveling upwards in a beam of light (replaced with a faster version)
  - the use animation for Telepills
  - the use animation for Blank Card when you have a teleport card
  - various animations during the Satan fight
  - various animations during the Mega Satan fight
  - various animations during The Haunt fight
  - various animations during the Big Horn fight
  - Hush's appear animation
  - Ultra Greed's appear and death animation
- Teleporting animations are sped up by a factor of 2.
- The disappearing animation for Pitfalls are sped up by a factor of 2.
-->

### 4) Bug Fixes

- `051` All forms of teleport will no longer send you to an invalid entrance.
- Having Duality will now always give you both the Devil Room and the Angel Room.

> Why? This does not happen consistently on vanilla like you would expect. Many boss rooms that only have 2 possible doors have been adjusted to have 3 doors.

- Entering a Black Market will no longer send you to the I AM ERROR room. (This is a bug introduced in v820.)
- Returning from a crawlspace in a Boss Rush or Devil Deal will no longer send you to the wrong room. (This is part of Fast-Travel.)

<!--
- Angels will drop key pieces even if another angel is still alive in the room.
- Globins will permanently die upon the 5th regeneration to prevent Epic Fetus softlocks.
- Flaming Hoppers will now automatically die after 5 seconds of being immobile to prevent softlocks.
- Globins, Sacks, Fistula, and Teratoma will now properly die after defeating Mom, Mom's Heart, or It Lives!
- The Book of Sin and Mystery Sack generate actual random pickups.
- 9 Volt now properly synergizes with The Battery.
- Double coins and nickels heal Keeper for their proper amount.
- Defeating Mega Satan no longer has a chance to immediately end the run.
- Monstro's Lung will now properly synergize with multi-shot items such as 20/20.
- The trapdoor / beam of light in I AM ERROR rooms will no longer be accessible if the room is not cleared.
-->

<br />

### 5) Graphics

- Paschal Candle now visually "fills up" so that you can easily tell at a glance if it is maxed out.
- The Distant Admiration, Forever Alone, and Friend Zone sprites now match the color of the actual familiars.
- The 20/20 sprite is now easier to see.
- The Star of Bethlehem sprite is now more distinct from Eden's Soul. (Credit goes to [Chebupeli](https://steamcommunity.com/profiles/76561198370261026) for creating it.)
- Pills now have a consistent orientation regardless of whether they are on the ground or in your inventory.
- The color of some pills are changed to make them easier to identify at a glance:
  - White-dotted / Red --> Full red
  - Pink / Red --> White / Red
  - White / White-dotted --> Full white-dotted

<!--
- The annoying vanilla in-game timer and score text will no longer appear. (Hold Tab to see a custom in-game timer.)
- Scared Hearts and Sticky Nickels now have unique sprites.
- The colors of some Purity auras have been changed to make them easier to see. Speed is now green and range is now yellow.
- The red spotted pill sprite has been changed to an all-red sprite so that it is easier to see.
- The white spotted pill sprite has been changed to an all-spotted sprite so that it is easier to distinguish from the white pill.
- The white has been changed on the red-white pill sprite so that it is easier to see.
- The Locust of Famine graphic now matches the color of the flies.
- Daemon's Tail and Error now have outlines. (Thanks goes to [O_o](http://steamcommunity.com/profiles/76561197993627005) for creating the sprites in the [Trinket Outlines](http://steamcommunity.com/sharedfiles/filedetails/?id=1138554495) mod.)
- There are now unique card backs for Rules, Suicide King, ?, Blank Rune, and Black Rune. (Thanks goes to [piber20](https://steamcommunity.com/id/piber20) for creating the sprites in the [Unique Card Backs](https://steamcommunity.com/sharedfiles/filedetails/?id=1120999933) mod.)
- Enemy red creep is changed to green (so that it is easier to see).
- Friendly green creep is changed to red (so that it is easier to distinguish from enemy creep).
-->

### 5) Sound Fixes

- The audio clips of mom and dad on the Ascent are silenced.

<br />

## Additional Changes for Races

Racing against other players with the Racing+ client is not supported yet. [TODO]

<!--
Racing+ allows players to perform [several different types of races](https://github.com/Zamiell/isaac-racing-client/blob/master/mod/CHANGES-RACES.md) against each other. Some race formats may introduce additional changes.
-->

<br />

## Additional Changes for Multi-Character Speedruns (Custom Challenges)

7-character speedruns are not supported yet. [TODO]

<!--
Racing+ has [several custom challenges](https://github.com/Zamiell/isaac-racing-client/blob/master/mod/CHANGES-CHALLENGES.md), each of which introduces additional changes to the game.
-->

<br />

## Individual Room Changes

The technical specifics of all of the individual room changes are listed in a [separate page](https://github.com/Zamiell/isaac-racing-client/blob/master/mod/CHANGES-ROOM.md).

<br />
