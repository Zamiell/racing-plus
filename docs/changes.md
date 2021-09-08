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

The main point of the Racing+ mod is to enable multiplayer racing with other people. It contains network code, has sprites to show what place you are in, and so forth.

Additionally, Racing+ makes some gameplay tweaks and fixes some vanilla bugs. You might not be able to recognize some of the smaller changes, so this page documents every change that it performs. With that said, you will find that doing a speedrun using the Racing+ mod will be very similar to doing a speedrun on the vanilla game.

Most changes on this page are prefixed by a code, like: `001`. This signifies that the change can be toggled on and off using the [Mod Config Menu](https://steamcommunity.com/sharedfiles/filedetails/?id=2487535818&searchtext=modconfigmenu). If a change does not have a prefix, you won't be able to toggle that option, since it is probably accomplished by modifying the game's resource files directly.

<br />

## Design Goals

In terms of what to change about the game, the mod has several goals, and attempts to strike a balance between them. However, certain things are prioritized. The goals are listed below in order of importance:

1. to reward skillful play (in the context of speedrunning and racing)
1. to make the game more fun to play
1. to fix bugs and imperfections
1. to keep the game as "vanilla" as possible

Furthermore, the mod attempts to remove all situations where the placer is forced to sit and wait without performing any inputs (e.g. waiting for the Hush door to open, waiting for Wizoobs to appear, etc.).

<br />

## List of Major Changes

### 1) Racing

- `0001` <!-- clientCommunication --> Race your friends and compete with others by using the Racing+ client. Depending on the [type of race you are doing](race-formats.md), you may be granted additional starting items or have other gameplay changes.

### 2) The D6 for Everyone

- `0002` <!-- startWithD6 --> All characters now start with the D6, either as a pocket item or an active item.

> Why? Much of the strategy in the game is centered around having this item. The best players win races more consistently when having the D6 because it mitigates run disparity.

### 3) No Curses

- `0003` <!-- disableCurses --> All curses are automatically disabled.

> Why? Curses make the game less-skilled based, robbing the player of meaningful decision-making and strategy.

### 4) Devil Room & Angel Room Rebalancing

- `0004` <!-- betterDevilAngelRooms --> Devil Rooms and Angel Rooms have been [customized](changes-room.md#devil--angel-room-rebalancing) for the purposes of slightly increasing the average number of items per room. Specifically:
  - Average items per devil room are increased from 1.64 to 1.96.
  - Average items per angel room are increased from 1.34 to 1.51.

> Why? The best players separate themselves from the mid-tier players by not taking any damage and getting every Devil Room / Angel Room. If the rewards from these rooms are not consistent enough, then the best players are not able to consistently win races.

- `0005` <!-- freeDevilItem --> Players receive a Your Soul trinket upon entering the first Devil Room of the run if they have not yet taken damage.
  - Self-damage (e.g. from a Curse Room door) does not count.
  - This only applies for Devil Rooms on Basement 1 or Basement 2.
  - Keeper and Tainted Keeper will be awarded 15 cents instead of a Your Soul trinket.

> Why? Some characters do not start with enough health to take the first devil deal, which is an important reward for playing perfectly. Instead of buffing the health of some characters, it is simpler to give every character one free devil deal (provided that they play flawlessly for the first two floors).

### 5) Fast-Reset

- `0006` <!-- fastReset --> The restart/reset key immediately restarts the game, as long as you have not entered more than 3 rooms.

> Why? In vanilla, the game enforces a 2 second limit between resets, but there is no good reason for this. Speeding this up makes resetting for a starting item less tedious.

### 6) Fast-Clear

- `0007` <!-- fastClear --> Rooms are considered cleared at the beginning of an enemy's death animation, rather than the end.

> Why? It is obnoxious to have to sit and wait for a long death animation to finish before being able to proceed with the game. The game was never originally intended to have this behavior, as demonstrated by Wrath of the Lamb.

### 7) Fast-Travel

- `0008` <!-- fastTravel --> The long fade-in and fade-out between floors is replaced with a custom animation where you jump out of a hole.
- `0008` <!-- fastTravel --> The long fade-in and fade-out between crawlspaces is replaced with the normal room transition animation.

### 8) Room Fixes

- Rooms with unavoidable damage or bugs have been fixed or deleted. The technical specifics are listed in a [separate page](changes-room.md).

### 9) Room Flipping

- While there are thousands of rooms in the game, many players have already seen them all. To increase run variety, all rooms have a chance to be flipped on the X axis, Y axis, or both axes.

<!--

Post-flip actions:

1) Remove the duplicated start rooms for The Chest / Dark Room

2) Un-flip Y-flipped Gurdy rooms:
   The Chest - #20015, #30015

3) Un-flip double Gate rooms (and enable all of the doors)
   The Chest - #20040, #30040
   Dark Room - #20012, #30012

4) Un-flip some Mega Maw rooms:
   The Chest - #20039, #30039, #20059, #30059, #20121, #30121
   Dark Room - #20011, #30011

-->

<br />

## List of Minor Changes

### 1) Custom Hotkeys

- Racing+ allows you to bind some optional hotkeys via Mod Config Menu:
  - a fast-drop button (for everything)
  - a fast-drop button for only trinkets
  - a fast-drop button for only pocket items
  - a Schoolbag switch button
  - an autofire button

### 2) Character Changes

- `0201` <!-- judasAddBomb 3 --> Judas starts with a bomb.

> Why? Historically, Isaac was the main character used in tournaments. After Balls of Steel 4, tournaments started using Judas as the main character instead, since he had a higher damage multiplier. At this time, it was desirable for Judas to have a bomb so that he would play in a similar way to Isaac. Starting with a bomb makes the game slightly more skill-based, since it gives players the option to bomb a tinted rock, escape a slow 2x2 room, and so forth.

- `0202` <!-- samsonDropHeart 6 --> Samson's Child's Heart is automatically dropped.

>  Why? When playing as Samson, players usually immediately drop the Child's Heart to improve their odds at good room drops.

- `0203` <!-- showEdenStartingItems 9, 30 --> Eden's starting items will be shown in the starting room.

> Why? Many speedrunners do not use the in-game item tracker, since it clutters the screen. This feature allows players to quickly see what the Eden items are, allowing them to reset the game if the items are bad.

- `0204` <!-- lostShowHealth 10 --> Hearts will now display on the UI when playing as The Lost.

> Why? So that you can more easily see when the Holy Mantle effect is active.

- `0205` <!-- lostUseHolyCard 31 --> Tainted Lost now automatically uses his Holy Card at the beginning of the run.
- `0206` <!-- taintedKeeperMoney 33 --> Tainted Keeper starts with 15 cents.

> Why? This gives Tainted Keeper enough money to start a Treasure Room item, which is considered to be important for unseeded speedruns.

### 3) Boss Changes

- `0301` <!-- fadeBosses --> Bosses will be faded during their death animation.

> Why? Bosses with long death animations obscure the identity of the item that drops, forcing players to wait for the death animation to complete before being able to take or roll the item.

- `0302` <!-- killExtraEnemies 45, 78 --> All extra enemies will now properly die after defeating Mom, Mom's Heart, or It Lives!
- `0303` <!-- stopDeathSlow 66 --> Stop Death from performing his slow attack.

> Why? It doesn't make sense that Death's slow effect can persist on the player even after Death has been defeated.

- `0304` <!-- fastSatan 84 --> The unnecessary waiting during the Satan fight is removed.
- `0305` <!-- fastHaunt 260 --> The unnecessary waiting during the Haunt fight is removed.
- `0306` <!-- removeLambBody 273 --> The Lamb body is removed upon death.

> Why? It can interfere with touching a trophy / chest.

- `0307` <!-- stopVictoryLapPopup 273 --> The "Would you like to do a Victory Lap!?" popup will no longer appear after defeating The Lamb.

> Why? Speedrunners never want to do a Victory Lap; they just want to finish the run.

- `0308` <!-- openHushDoor 407 --> The Hush door will be automatically opened.
- `0309` <!-- fastBigHorn 411 --> Big Horn will spend less time underground.
- `0310` <!-- fastColostomia 917 --> Colostomia will instantly appear.
- `0311` <!-- fastDogma 950 --> Dogma's death cutscene is skipped.
- <!-- 274 --> Some of the animations in the Mega Satan fight have been removed.
- <!-- 274 --> Defeating Mega Satan no longer has a chance to immediately end the run.

> Why? This gives players a chance to touch a trophy, use a Fool card, etc.

- <!-- 407 --> Hush no longer plays an appear animation.
- <!-- 951 --> Defeating The Beast no longer immediately ends the run.

> Why? This gives players a chance to touch a trophy.

### 4) Enemy Changes

- `0401` <!-- removeTreasureRoomEnemies --> All enemies are removed from Treasure Rooms.

> Why? Bulb enemies are extremely common in Repentance and it is unclear if the high frequency is intended.

- `0402` <!-- clearerShadowAttacks --> A blue target is drawn on the ground for the Daddy Long Legs multi-stomp attack and rock projectiles to make it more clear where the attack is landing.
- `0403` <!-- globinSoftlock 24 --> Globins will permanently die on the 4th regeneration to prevent softlocks.

> Why? Having Epic Fetus and Polyphemus make it impossible to kill Globins fast enough before they regenerate.

- `0404` <!-- fastHands 213, 287 --> Mom's Hands and Mom's Dead Hands have faster attack patterns.
- `0405` <!-- appearHands 213, 287 --> Mom's Hands and Mom's Dead Hands will play an "Appear" animation.

> Why? This gives deaf players a visual tell that they will need to dodge the hands. (Normally, this is signaled with a loud, obnoxious laugh from Mom.)

- `0406` <!-- disableInvulnerability 219, 260, 285 --> Wizoobs, Lil' Haunts, and Red Ghosts no longer have invulnerability frames after spawning.

> Why? No other enemies in the game are invulnerable during this time, so this mechanic is not consistent.

- `0407` <!-- fastGhosts 219, 285 --> Wizoobs and Red Ghosts have faster attack patterns.
- `0408` <!-- replaceCodWorms 221 --> Cod Worms are replaced with Para-Bites.

### 5) Quality of Life Changes

- `0501` <!-- speedUpFadeIn --> The fade in at the beginning of a run is sped-up.
- `0502` <!-- easyFirstFloorItems --> First floor Treasure Rooms are slightly changed so that you never have to spend a bomb or walk on spikes.

> Why? This slightly decreases the time spent in the resetting phase, which everyone agrees is not very fun.

- `0503` <!-- changeCreepColor --> Enemy red creep is changed to green and friendly green creep is changed to red.

> Why? So that player creep will never be mistaken for enemy creep and vice versa. Furthermore, it is very difficult to see red enemy creep on the Womb floors.

- `0504` <!-- subvertTeleport --> The disruptive teleport from entering a room with Gurdy, Mom, Mom's Heart, or It Lives! no longer occurs.
- `0505` <!-- deleteVoidPortals --> Void portals that spawn after bosses are automatically deleted.

> Why? With very few exceptions, racers and speedrunners will never go to The Void. The random Void portals that spawn can be accidentally jumped into, ruining the current run.

- `0506` <!-- showNumSacrifices --> The number of sacrifices will be shown in the top-left when in a Sacrifice Room.
- `0507` <!-- holyMantleUI 313 --> The presence of a Holy Mantle shield is now shown on the hearts UI.
- `0508` <!-- leadPencilChargeBar 444 --> Lead Pencil now shows a charge bar.
- `0509` <!-- combinedDualityDoors 498 --> If the player has Duality and there are not any door slots left for an Angel Room, the Devil Room door and the Angel Room door will be combined.

> Why? In many boss rooms, there are not enough locations for both doors, which causes the Angel Room door to be deleted.

- `0510` <!-- removeFortuneCookieBanners 557 --> Fortune Cookie banner text is removed.

> Why? The large banner text blocks gameplay.

- `0511` <!-- showDreamCatcherItem 566 --> If you have Dream Catcher, the Treasure Room item and the boss will be shown in the starting room.

> Why? Since the Fast-Travel feature removes the floor transition cutscene, this is the only way to see what the Dream Catcher items are.

- `0512` <!-- fastLuna 589 --> Moonlights from Luna can now be entered as soon as they spawn.
- `0513` <!-- fadeVasculitisTears 657 --> The tears that explode out of enemies when you have Vasculitis are faded.

> Why? It can be very difficult to distinguish between friendly Vasculitis tears and enemy tears, since they will often be the same color.

- `0514` <!-- removePerfectionVelocity 145 --> The Perfection trinket will no longer have velocity.

> Why? This can prevent the trinket from being stuck over a pit.

- `0515` <!-- removePerfectionOnEndFloors 145 --> The Perfection trinket will no longer spawn on the final floor of a run.

> Why? This can interfere with finishing the run.

- `0516` <!-- automaticItemInsertion --> Pickups that spawn after taking an item will be automatically inserted into your inventory. (Chaos, Marbles, Purple Heart, Mom's Toenail, Match Stick, The Tick, Faded Polaroid, Ouroboros Worm, and 'M are exempt from this behavior.)
- `0517` <!-- chargePocketItemFirst --> Batteries will now charge the pocket item first over the active item. (You can hold the drop/switch button to temporarily disable this feature.)
  - This also fixes the vanilla bug where 48 Hour Energy! and Hairpin will only charge 12-charge items for 3 charges instead of 6.

> Why? Since players will have the D6 in their pocket item slot, it makes more sense for the default behavior to be to charge the D6.

- `0518` <!-- showMaxFamiliars --> An icon will be shown on the UI when the player has reached the maximum amount of familiars (i.e. 64).
- `0519` <!-- showPills --> Identified pills will be shown when the player presses the map button (tab). (Only up to 7 will be shown.)

> Why? Items that generate familiars (e.g. Compost) will be do nothing if the player is currently at the maximum amount.

- `0520` <!-- fadeDevilStatue --> The statue in a Devil Room will now be faded if there are pickups behind it.
- Players will start in the center of the room (instead of at the bottom).

> Why? This is convenient because it makes the player equidistant to all of the doors.

### 6) Gameplay Changes

- `0601` <!-- extraStartingItems --> Extra starting items (such as Incubus and Maw of the Void) will appear in the Treasure Room on the first floor.

> Why? This decreases the time spent in the resetting phase, which everyone agrees is not very fun.

- `0602` <!-- consistentTrollBombs --> Troll Bombs, Mega Troll Bombs, and Golden Troll Bombs always have a fuse timer of exactly 2 seconds.

> Why? Having a random fuse time often results in players having to make a 50/50 movement gamble that is profoundly unfair.

- `0603` <!-- pillsCancelAnimations --> Power Pill and Horf! now cancel animations in the same way that all of the other pills do.

> Why? This allows skilled players to gain time by canceling more animations.

- Sawblade is added to the Treasure Room pool. Sawblade is a custom orbital that has the same rotation speed, hitbox, and tick rate of the Sacrificial Dagger from Afterbirth+. It does 10 contact damage.

> Why? Historically, orbitals have been a big part of speedrunning at the highest level. In Repentance, orbitals were nerfed in damage, rotation, and hitbox, making their usage much more infrequent. Sawblade is an attempt to restore historical orbital play by providing a relatively-strong orbital as a possible starting item.

- Card Reading no longer spawns portals on Womb 2 and beyond.

> Why? Similar to Mercurius, this item increases the variance of a run by too much without containing any skill-based component.

### 7) Gameplay Removals

- Mercurius is removed.

> Why? This item has a nasty combination of being incredibly powerful and not very skill-based. Having Mercurius in the game helps worse players win races more often.

- TMTRAINER is removed.

> Why? This item has several problems. First, it can completely trivialize a run by taking you to the end. Second, it can cause softlocks or crashes. Third, it greatly increases the RNG in any particular run.

- Glitched items are replaced by normal items.

> Why? The same reasoning as for removing TMTRAINER.

- The Karma trinket is removed.

> Why? Since all Donation Machines are removed, it has no effect.

- The Amnesia and ??? pills are removed.

> Why? Since curses are automatically removed, these pills have no effect.

- Mega Blast and Mega Mush are removed from all pools if the player starts with Void.

> Why? The combination of Void with these items trivializes the game and is too powerful.

- Mom's Knife is removed from the Treasure Room pool.

> Why? The vanilla weight of 0.2 means that powerful runs are more reliant on RNG than skill. Furthermore, it is much more powerful than any other item in the Treasure Room pool, so it can lead to lopsided races.

### 8) Cutscenes & Animations

- `0801` <!-- fastTeleports --> Teleport animations are sped up by a factor of 2.
- The intro that occurs when you launch the game is removed.
- The cutscenes that occur when finishing a run are removed.
- The cutscenes that occur before each boss are removed.
- All "giantbook" animations are removed (with the exception of Book of Revelations, Satanic Bible, eternal hearts, and rainbow poop).
- The pause and unpause animations are removed.

### 9) Bug Fixes

- `0901` <!-- battery9VoltSynergy --> The Battery & 9 Volt will now synergize together properly.
- `0902` <!-- teleportInvalidEntrance --> All forms of teleport will no longer send you to an invalid entrance.
- `0903` <!-- removeInvalidPitfalls --> Pitfalls that incorrectly respawn after not having time to finish their disappearing animation are removed.
- Restock Machines will now appear in shops 25% of the time.

> Why? According to the patch notes, this is the way that vanilla is supposed to be, but they messed up and no Restock Machines will ever appear.

- Entering a Black Market will no longer send you to the I AM ERROR room.

> Why? In v820, all Black Markets became broken in this way.

- Returning from a crawlspace in a Boss Rush or Devil Deal will no longer send you to the wrong room. (This is part of Fast-Travel.)
- The trapdoor / beam of light in I AM ERROR rooms will no longer be accessible if the room is not cleared. (This is part of Fast-Travel.)
- Teleport!, Cursed Eye, Broken Remote, and Telepills teleports are now seeded properly.
- Tainted Lilith can no longer duplicate the Gello familiar with save & quit.
- Saving & quitting in a Genesis room will now delete all collectibles in the room to prevent players from exploiting the bug where the options property is deleted.
- Damocles is now correctly removed after using Genesis.
- Morphed GB Bug pickups are now seeded in order rather than based on the InitSeed of the morphed pickup.

### 10) Graphics Fixes

- `1001` <!-- flyItemSprites --> The Distant Admiration, Forever Alone, and Friend Zone sprites now match the color of the actual familiars.
- `1002` <!-- twentyTwenty --> The 20/20 sprite is now easier to see.
- `1003` <!-- starOfBethlehem --> The Star of Bethlehem sprite is now more distinct from Eden's Soul. (Credit goes to [Chebupeli](https://steamcommunity.com/profiles/76561198370261026).) <!-- cspell:disable-line -->
- `1004` <!-- paschalCandle --> Paschal Candle now visually "fills up" so that you can easily tell at a glance if it is maxed out.
- `1005` <!-- scaredHeart --> Scared Hearts now have a custom animation so that they are easier to identify.
- `1006` <!-- stickyNickel --> Sticky Nickels now have a custom effect so that they are easier to identify.
- `1007` <!-- uniqueCardBacks --> Blank Runes, Black Runes, and ? Cards now have a unique graphic so that they are easier to identify.
- The heart UI sprites have been modified so that it is easier to see an empty heart container on a black background.
- The Locust of Famine sprite now matches the color of the flies.
- The Error trinket sprite now has an outline. (Credit goes to [O_o](http://steamcommunity.com/profiles/76561197993627005).)
- Pills now have a consistent orientation regardless of whether they are on the ground or in your inventory.
- The color of some pills are changed to make them easier to identify at a glance:
  - <!-- PILL_ORANGE_ORANGE (3) --> Orange / Orange --> Full purple
  - <!-- PILL_REDDOTS_RED (5) --> White-dotted / Red --> Full red
  - <!-- PILL_PINK_RED (6) --> Pink / Red --> White / Red
  - <!-- PILL_ORANGEDOTS_WHITE (9) --> White / White-dotted --> Full white-dotted
  - <!-- PILL_WHITE_AZURE (10) --> White / Cyan --> White / Green
- The colors of some Purity auras have been changed to make them easier to see. Speed is now green and range is now yellow.
- The icon for a dirty bedroom is now a cobweb so that it is more distinct from a clean bedroom.
- The controls graphic in the start room is changed to be speedrunning-themed.
- The vanilla in-game timer and score text will no longer appear. (Hold Tab to see a custom in-game timer.)

> Why? The text blocks gameplay.

- The graphics for fortunes and custom seeds are set to 15% opacity.

> Why? So that gameplay is not blocked when you use Rules card.

- All fog is removed.

> Why? It makes elements on the screen easier to see and it makes the game run better on poor computers.

### 11) Sound Fixes

- `1101` <!-- silenceMomDad --> The audio clips of mom and dad on the Ascent are silenced.

### 12) Other

- `1201` <!-- customConsole --> A custom console is provided that is better than the vanilla console.

> Why? The vanilla console has an annoying animation and is inconvenient to use.

<br />

## Additional Changes for Multi-Character Speedruns (Custom Challenges)

Racing+ has [several custom challenges](challenges.md), each of which introduces additional changes to the game.

<br />

<!--
- Some things that are unseeded are now seeded:
  - cards from Sloth, Super Sloth, Pride, and Super Pride
- Pin's first attack happens on the 15th frame (instead of the 73rd frame).
- Double coins and nickels heal Keeper for their proper amount.
-->
