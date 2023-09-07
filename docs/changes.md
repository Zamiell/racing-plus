# Racing+ Mod Changes

<!-- markdownlint-disable MD033 -->

<br>

## Website

If you want to learn more about Racing+, you can visit [the official website](https://isaacracing.net). If you want to know the changes that are present in the in-game mod, read on.

<br>

## Table of Contents

1. [Introduction](#introduction)
1. [Design Goals](#design-goals)
1. [List of Major Changes](#list-of-major-changes)
1. [List of Minor Changes](#list-of-minor-changes)
1. [Additional Changes for Multi-Character Speedruns (Custom Challenges)](#additional-changes-for-multi-character-speedruns-custom-challenges)

<br>

## Introduction

The main point of the Racing+ mod is to enable multiplayer racing with other people. It contains network code, has sprites to show what place you are in, and so forth.

Additionally, Racing+ makes some gameplay tweaks and fixes some vanilla bugs. You might not be able to recognize some of the smaller changes, so this page documents every change that it performs. With that said, you will find that doing a speedrun using the Racing+ mod will be very similar to doing a speedrun on the vanilla game.

Most changes on this page are prefixed by a code, like: `0001`. This signifies that the change can be toggled on and off using the [Mod Config Menu](https://steamcommunity.com/sharedfiles/filedetails/?id=2681875787). If a change does not have a prefix, you won't be able to toggle that option, since it is probably accomplished by modifying the game's resource files directly.

<br>

## Design Goals

In terms of what to change about the game, the mod has several goals, and attempts to strike a balance between them. However, certain things are prioritized. The goals are listed below in order of importance:

1. to reward skillful play (in the context of speedrunning and racing)
1. to make the game more fun to play
1. to fix bugs and imperfections
1. to keep the game as "vanilla" as possible

Furthermore, the mod attempts to remove all situations where the player is forced to sit and wait without performing any inputs (e.g. waiting for the Hush door to open, waiting for death animations to end, etc.).

<br>

## List of Major Changes

### 1) Racing

- `0001` <!-- ClientCommunication --> Race your friends and compete with others by using the Racing+ client. Depending on the [type of race you are doing](race-formats.md), you may be granted additional starting items or have other gameplay changes.

### 2) The D6 for Everyone

- `0002` <!-- StartWithD6 --> All characters now start with the D6, either as a pocket item or an active item.

> Why? Much of the strategy in the game is centered around having this item. The best players win races more consistently when having the D6 because it mitigates run disparity.

### 3) No Curses

- `0003` <!-- DisableCurses --> All curses are automatically disabled.

> Why? Curses make the game less-skilled based, robbing the player of meaningful decision-making and strategy.

### 4) Devil Room & Angel Room Rebalancing

- `0004` <!-- BetterDevilAngelRooms & itempools.xml--> Devil Rooms and Angel Rooms have been [customized](changes-room.md#devil--angel-room-rebalancing) for the purposes of slightly increasing the average number of items per room. Specifically:
  - The average items per devil room are increased from 1.78 to 2.31.
  - The following items are removed from the Devil Room pool:
    - 127 - Forget Me Now
    - 186 - Blood Rights
    - 241 - Contract from Below
    - 391 - Betrayal
    - 412 - Cambion Conception
    - 433 - My Shadow
    - 468 - Shade
    - 554 - 2Spooky
    - 672 - A Pound of Flesh
    - 692 - Sanguine Bond
  - The average items per angel room are decreased from 1.29 to 1.00.
  - The following items are removed from the Angel Room pool:
    - 413 - Immaculate Conception
    - 685 - Jar of Wisps

> Why? The best players separate themselves from the mid-tier players by not taking any damage and getting every Devil Room / Angel Room. If the rewards from these rooms are not consistent enough, then the best players are not able to consistently win races.

- `0005` <!-- FreeDevilItem --> As long as players have not taken any damage, players will get their first Devil Deal item free.
  - Self-damage (e.g. from a Curse Room door) does not count.
  - On Tainted Magdalene, damage to temporary hearts does not count.

> Why? Some characters do not start with enough health to take the first devil deal, which is an important reward for playing perfectly. Instead of buffing the health of some characters, it is simpler to give every character one free devil deal (provided that they play well for the first two floors).

- <!-- DoubleAngelNerf --> Uriel and Gabriel can no longer damage each other. To balance this, Gabriel's HP is reduced to that of Uriel. (660 --> 400)

> Why? This greatly decreases the RNG having to do with Angel Rooms.

### 5) Fast-Reset

- `0006` <!-- FastReset --> The restart/reset key immediately restarts the game, as long as you have entered 2 or less rooms thus far.

> Why? In vanilla, the game enforces a 2 second limit between resets, but there is no good reason for this. Speeding this up makes resetting for a starting item less tedious.

### 6) Fast-Clear

- `0007` <!-- FastClear --> Rooms are considered cleared at the beginning of an enemy's death animation, rather than the end.

> Why? It is obnoxious to have to sit and wait for a long death animation to finish before being able to proceed with the game. The game was never originally intended to have this behavior, as demonstrated by Wrath of the Lamb.

### 7) Fast-Travel

- `0008` <!-- FastTravel --> The long fade-in and fade-out between floors is replaced with a custom animation where you jump out of a hole.
- `0008` <!-- FastTravel --> The long fade-in and fade-out between crawl spaces is replaced with the normal room transition animation.

### 8) Room Fixes

- Rooms with unavoidable damage or bugs have been fixed or deleted. The technical specifics are listed in a [separate page](changes-room.md).

### 9) Room Flipping

- While there are thousands of rooms in the game, many players have already seen them all. To increase run variety, all rooms have a chance to be flipped on the X axis, Y axis, or both axes.
- Mines, Ashpit, and the Ascent are exempt from this behavior due to bugs with Bomb Grimaces.

<!--

Don't flip:

- Mines (because of issues with Bomb Grimaces; they only spit bombs underneath)
- Ashpit (because of issues with Bomb Grimaces; they only spit bombs underneath)
- Mausoleum (because we don't flip Gehenna and we want the Mausoleum & Gehenna to be consistent)
- Gehenna (because of flipping issues with Ball and Chains leading to unavoidable damage)

Post-flip actions:

1) Fix flipped Utero room 975. (The flipped Wall Huggers should always rotate around the center.)

2) Remove the duplicated start rooms for The Chest / Dark Room.

3) Un-flip Y-flipped Gurdy rooms:
   - The Chest - #20015, #30015

4) Un-flip double Gate rooms (and enable all of the doors)
   - The Chest - #20040, #30040
   - Dark Room - #20012, #30012

5) Un-flip some Mega Maw rooms:
   - The Chest - #20039, #30039, #20059, #30059
   - Dark Room - #20011, #30011

6) Ensure no overlapping variants in:
   - Fool Card Room (Depths/Necropolis/Dank) (10000 to 40000)
   - Mirror Room (Downpour/Dross) (10000 to 40000)
   - Knife Piece Room (Downpour/Dross) (10000 to 50000)
   - Button Room (Mines/Ashpit) (5000 to 40000)
   - Secret Entrance (Mines/Ashpit) (10000 to 50000)
   - Mineshaft Room (Mines/Ashpit) (10000 to 60000)

-->

<br>

## List of Minor Changes

### 1) Custom Hotkeys

- Racing+ allows you to bind some optional hotkeys via Mod Config Menu:
  - a fast-drop button (for everything)
  - a fast-drop button for only trinkets
  - a fast-drop button for only pocket items
  - a Schoolbag switch button
  - an autofire button

### 2) Character Changes

- `0201` <!-- JudasAddBomb 3 --> Judas starts with a bomb.

> Why? Historically, Isaac was the main character used in tournaments. After Balls of Steel 4, tournaments started using Judas as the main character instead, since he had a higher damage multiplier. At this time, it was desirable for Judas to have a bomb so that he would play in a similar way to Isaac. Starting with a bomb makes the game slightly more skill-based, since it gives players the option to bomb a tinted rock, escape a slow 2x2 room, and so forth.

- `0202` <!-- SamsonDropHeart 6 --> Samson's Child's Heart is automatically dropped.

> Why? When playing as Samson, players usually immediately drop the Child's Heart to improve their odds at good room drops.

- `0203` <!-- ShowEdenStartingItems 9, 30 --> Eden's starting items will be shown in the starting room.

> Why? Many speedrunners do not use the in-game item tracker, since it clutters the screen. This feature allows players to quickly see what the Eden items are, allowing them to reset the game if the items are bad.

- `0204` <!-- LostUseHolyCard 31 --> Tainted Lost now automatically uses his Holy Card at the beginning of the run.
- `0205` <!-- TaintedKeeperExtraMoney 33 --> Tainted Keeper starts with 15 cents except in seeded races.

> Why? This gives Tainted Keeper enough money to start a Treasure Room item, which is considered to be important for unseeded speedruns.

### 3) Boss Changes

- `0301` <!-- FadeBosses --> Bosses will be faded during their death animation.

> Why? Bosses with long death animations obscure the identity of the item that drops, forcing players to wait for the death animation to complete before being able to take or roll the item.

- `0302` <!-- FastBossRush --> The Boss Rush is customized to include Womb bosses and Repentance bosses (in order to increase the variety). Additionally, three bosses will spawn at a time instead of two. The unnecessary waiting between waves is removed.

- `0303` <!-- RemoveArmor --> Bosses no longer have armor (i.e. damage scaling).

> Why? Damage scaling makes your build decisions matter less. It also makes individual boss fights take too long when compared to other bosses or the rest of the run in general.

- `0304` <!-- FastMom 45, 78 --> All extra enemies will now properly die after defeating Mom, Mom's Heart, or It Lives!
- `0305` <!-- FastPin 62 --> Pin, Frail, Scolex, and Wormwood will now spend less time underground.
- `0306` <!-- PreventDeathSlow 66 --> Death will no longer perform his "slow" attack.

> Why? It doesn't make sense that Death's slow effect can persist on the player even after Death has been defeated.

- `0307` <!-- FastBlastocyst 74 --> The appear animation and death animation of Blastocyst is sped up.
- `0308` <!-- FastKrampus 81 --> Krampus will immediately drop his item once he is killed.
- `0309` <!-- FastSatan 84 --> The unnecessary waiting during the Satan fight is removed.
- `0310` <!-- FastHaunt 260 --> The unnecessary waiting during the Haunt fight is removed.
- `0311` <!-- FastAngels 271, 272 --> Uriel and Gabriel will immediately drop their key piece once they are killed.
- `0312` <!-- ConsistentAngels 271, 272 --> Angel types are now properly seeded and are no longer duplicated. Uriel is always given first.
- `0313` <!-- RemoveLambBody 273 --> The Lamb body is removed upon death.

> Why? It can interfere with touching a trophy / chest.

- `0314` <!-- PreventVictoryLapPopup 273 --> The "Would you like to do a Victory Lap!?" popup will no longer appear after defeating The Lamb.

> Why? Speedrunners never want to do a Victory Lap; they just want to finish the run.

- `0315` <!-- FastMegaSatan 274, 275 --> Some of the animations in the Mega Satan fight have been removed.
- `0316` <!-- PreventEndMegaSatan 275 --> Defeating Mega Satan no longer has a chance to immediately end the run.

> Why? This gives players a chance to touch a trophy, use a Fool card, etc.

- `0317` <!-- OpenHushDoor 407 --> The Hush door will be automatically opened.
- `0318` <!-- FastHush 407 --> Hush no longer plays an appear animation.
- `0319` <!-- FastBigHorn 411 --> Big Horn will spend less time underground.
- `0320` <!-- FastHeretic 905 --> The Heretic fight will instantly start.
- `0321` <!-- FastColostomia 917 --> Colostomia will instantly appear.
- `0322` <!-- FastDogma 950 --> Dogma's death animation is sped up, and his death cutscene is skipped.
- `0323` <!-- PreventEndBeast 951 --> Defeating The Beast no longer immediately ends the run.

> Why? This gives players a chance to touch a trophy.

- <!-- "00.special rooms.xml" 907 --> Great Gideon will no longer appear as a boss in Mines/Ashpit.

### 4) Enemy Changes

- `0401` <!-- ClearerShadowAttacks --> A blue target is drawn on the ground for the Daddy Long Legs multi-stomp attack and rock projectiles to make it more clear where the attack is landing.
- `0402` <!-- FadeFriendlyEnemies, statuseffects.anm2 --> Friendly enemies will be faded.

> Why? Friendly enemies obfuscate real enemies, making it difficult to see what is happening on the screen.

- `0403` <!-- RemoveTreasureRoomEnemies --> All enemies are removed from Treasure Rooms.

> Why? Bulb enemies are extremely common in Repentance and it is unclear if the high frequency is intended.

- `0404` <!-- GlobinSoftlock 24 --> Globins will permanently die on the 4th regeneration to prevent softlocks.

> Why? Having Epic Fetus and Polyphemus make it impossible to kill Globins fast enough before they regenerate.

- `0405` <!-- AppearHands 213, 287 --> Mom's Hands and Mom's Dead Hands will play an "Appear" animation.
- `0406` <!-- FastHands 213, 287 --> Mom's Hands and Mom's Dead Hands have faster attack patterns.

> Why? This gives deaf players a visual tell that they will need to dodge the hands. (Normally, this is signaled with a loud, obnoxious laugh from Mom.)

- `0407` <!-- VulnerableGhosts 219, 260, 285 --> Wizoobs, Lil' Haunts, and Red Ghosts no longer have invulnerability frames after spawning.

> Why? No other enemies in the game are invulnerable during this time, so this mechanic is not consistent.

- `0408` <!-- FastGhosts 219, 285 --> Wizoobs and Red Ghosts have faster attack patterns.
- `0409` <!-- ReplaceCodWorms 221 --> Cod Worms are replaced with Para-Bites.
- `0410` <!-- PitfallImmobility 291 --> Pitfalls are no longer able to move.

> Why? It is probably a bug in the game that Pitfalls are able to be affected by e.g. Strange Attractor.

- `0411` <!-- RemoveStrayPitfalls 291 --> Pitfalls are now killed upon room clear.
- `0412` <!-- FastPolties 816 --> Polties & Kinetis will now immediately show themselves.
- `0413` <!-- FastNeedles 881 --> Needles & Pasties will now spend less time underground.
- `0414` <!-- FastDusts 882 --> Dusts will now never disappear.
- `0415` <!-- DummyDPS 964 --> Dummies will show the damage per second (in addition to the normal damage numbers).

### 5) Quality of Life Changes

- `0501` <!-- AutomaticItemInsertion --> Pickups that spawn after taking an item will be automatically inserted into your inventory. (Chaos, Marbles, Purple Heart, Mom's Toenail, Match Stick, The Tick, Faded Polaroid, Ouroboros Worm, and 'M are exempt from this behavior.)
- `0502` <!-- ChangeCreepColor --> Enemy red creep is changed to green and friendly green creep is changed to blue.

> Why? So that player creep will never be mistaken for enemy creep and vice versa. Furthermore, it is very difficult to see red enemy creep on the Womb floors.

- `0503` <!-- ChargePocketItemFirst --> Batteries will now charge the pocket item first over the active item. (You can hold the drop/switch button to temporarily disable this feature.)
  - This also fixes the vanilla bug where 48 Hour Energy! and Hairpin will only charge 12-charge items for 3 charges instead of 6.

> Why? Since players will have the D6 in their pocket item slot, it makes more sense for the default behavior to be to charge the D6.

- `0504` <!-- DeleteVoidPortals --> Void portals that spawn after bosses are automatically deleted.

> Why? With very few exceptions, racers and speedrunners will never go to The Void. The random Void portals that spawn can be accidentally jumped into, ruining the current run.

- `0505` <!-- EasyFirstFloorItems --> First floor Treasure Rooms are slightly changed so that you never have to spend a bomb or walk on spikes.

> Why? This slightly decreases the time spent in the resetting phase, which everyone agrees is not very fun.

- `0506` <!-- FadeDevilStatue --> The statue in a Devil Room will now be faded if there are pickups behind it.
- `0507` <!-- ShowRunTimer --> The run timer (for in-game time) will only be shown when the player holds down the map key.
- `0508` <!-- ShowMaxFamiliars --> An icon will be shown on the UI when the player has reached the maximum amount of familiars (i.e. 64).
- `0509` <!-- ShowNumSacrifices --> The number of sacrifices will be shown in the top-left when in a Sacrifice Room.
- `0510` <!-- ShowPills --> Identified pills will be shown when the player presses the map button (tab). (Only up to 7 will be shown.)

> Why? Items that generate familiars (e.g. Compost) will be do nothing if the player is currently at the maximum amount.

- `0511` <!-- SpeedUpFadeIn --> The fade in at the beginning of a run is sped-up.
- `0512` <!-- SubvertTeleport --> The disruptive teleport from entering a room with Gurdy, Mom, Mom's Heart, or It Lives! no longer occurs.
- `0513` <!-- TaintedSamsonChargeBar --> Tainted Samson now has a charge bar for his Berserk! ability.
- `0514` <!-- BloodyLustChargeBar 157 --> Bloody Lust now shows a charge bar.
- `0515` <!-- LeadPencilChargeBar 444 --> Lead Pencil now shows a charge bar.
- `0516` <!-- AzazelsRageChargeBar 699 --> Azazel's Rage now shows a charge bar.
- `0517` <!-- FastForgetMeNow 127 --> Forget Me Now will now have a faster animation.
- `0518` <!-- CombinedDualityDoors 498 --> If the player has Duality and there are not any door slots left for an Angel Room, the Devil Room door and the Angel Room door will be combined.

> Why? In many boss rooms, there are not enough locations for both doors, which causes the Angel Room door to be deleted.

- `0519` <!-- FadeHungryTears 532 --> Lachryphagy tears are faded.
- `0520` <!-- RemoveFortuneCookieBanners 557 --> Fortune Cookie banner text is removed.

> Why? The large banner text blocks gameplay.

- `0521` <!-- ShowDreamCatcher 566 --> If you have Dream Catcher, the Treasure Room item and the boss will be shown in the starting room.

> Why? Since the Fast-Travel feature removes the floor transition cutscene, this is the only way to see what the Dream Catcher items are.

- `0522` <!-- FastLuna 589 --> Moonlights from Luna can now be entered as soon as they spawn.
- `0523` <!-- FadeVasculitisTears 657 --> The tears that explode out of enemies when you have Vasculitis are faded.

> Why? It can be very difficult to distinguish between friendly Vasculitis tears and enemy tears, since they will often be the same color.

- `0524` <!-- FastVanishingTwin 697 --> The Vanishing Twin familiar is replaced by a custom version that activates instantly.
- `0525` <!-- FlipCustom 711 --> Flip will now more clearly show what each item will change into.
- `0526` <!-- RemovePerfectionVelocity 145 --> The Perfection trinket will no longer have velocity.

> Why? This can prevent the trinket from being stuck over a pit.

- `0527` <!-- RemovePerfectionOnEndFloors 145 --> The Perfection trinket will no longer spawn on the final floor of a run.

> Why? This can interfere with finishing the run.

- `0528` <!-- DisplayExpansionPack 181 --> The random active item chosen by Expansion Pack will be drawn on the screen as streak text.

- <!-- CenterStart --> Players will start in the center of the room (instead of at the bottom).

> Why? This is convenient because it makes the player equidistant to all of the doors.

### 6) Gameplay Changes

- `0601` <!-- ConsistentTrollBombs --> Troll Bombs, Mega Troll Bombs, and Golden Troll Bombs always have a fuse timer of exactly 2 seconds.

> Why? Having a random fuse time often results in players having to make a 50/50 movement gamble that is profoundly unfair.

- `0602` <!-- ExtraStartingItems --> The following items are changed to have 1.0 weight for the Treasure Room on the first floor:

  - 12 - Magic Mushroom (from 0.5)
  - 168 - Epic Fetus (from 0.1)
  - 237 - Death's Touch (from 0.2)

- `0602` <!-- ExtraStartingItems --> The following extra starting items will appear in the Treasure Room on the first floor:
  - 182 - Sacred Heart
  - 311 - Judas' Shadow
  - 331 - Godhead
  - 360 - Incubus
  - 399 - Maw of the Void
  - 415 - Crown of Light
  - 698 - Twisted Pair

> Why? This decreases the time spent in the resetting phase, which everyone agrees is not very fun.

- `0603` <!-- PillsCancelAnimations --> Power Pill and Horf! now cancel animations in the same way that all of the other pills do.

> Why? This allows skilled players to gain time by canceling more animations.

- <!-- NerfCardReading --> Card Reading no longer spawns portals on Womb 2 and beyond.

> Why? Similar to Mercurius, this item increases the variance of a run by too much without containing any skill-based component.

### 7) Gameplay Removals

- <!-- RemoveGloballyBannedItems --> Mercurius is removed.

> Why? This item has a nasty combination of being incredibly powerful and not very skill-based. Having Mercurius in the game helps worse players win races more often.

- <!-- RemoveGloballyBannedItems --> TMTRAINER is removed.

> Why? This item has several problems. First, it can completely trivialize a run by taking you to the end. Second, it can cause softlocks or crashes. Third, it greatly increases the RNG in any particular run.

- <!-- RemoveGlitchedItems --> Glitched items are replaced by normal items.

> Why? The same reasoning as for removing TMTRAINER.

- <!-- RemoveGloballyBannedItems --> The Karma trinket is removed.

> Why? Since all Donation Machines are removed, it has no effect.

- <!-- RemoveBannedPillEffects --> The Amnesia and ??? pills are removed.

> Why? Since curses are automatically removed, these pills have no effect.

- <!-- RemoveGloballyBannedItems --> Mega Blast and Mega Mush are removed from all pools if the player starts with Void.

> Why? The combination of Void with these items trivializes the game and is too powerful.

- <!-- "itempools.xml" --> Mom's Knife is removed from the Treasure Room pool.

> Why? The vanilla weight of 0.2 means that powerful runs are more reliant on RNG than skill. Furthermore, it is much more powerful than any other item in the Treasure Room pool, so it can lead to lopsided races.

### 8) Cutscenes & Animations

- `0801` <!-- FastTeleport --> Teleport animations are sped up by a factor of 2.
- <!-- "cutscenes.xml" --> The intro that occurs when you launch the game is removed.
- <!-- "cutscenes.xml" --> The cutscenes that occur when finishing a run are removed.
- <!-- "versusscreen.anm2", "versusscreen_dogma.anm2", "versusscreen_mother.anm2" --> The cutscenes that occur before each boss are removed.
- <!-- "giantbook.xml" --> All "giantbook" animations are removed (with the exception of Book of Revelations, Satanic Bible, eternal hearts, and rainbow poop).
- <!-- "pausescreen.anm2" --> The pause and unpause animations are removed.

### 9) Bug Fixes

- `0901` <!-- Battery9VoltSynergy --> The Battery & 9 Volt will now synergize together properly.
- `0902` <!-- BatteryBumFix --> Battery Bums will now properly charge pocket active items.
- `0903` <!-- GoatHeadInBossRoom --> Goat Head / Eucharist will now properly open the Devil Room / Angel Room door if it is taken inside of a Boss Room.
- `0904` <!-- PreventUltraSecretRoomSoftlock --> You can no longer be softlocked in Ultra Secret Rooms.
- `0905` <!-- RemoveInvalidPitfalls --> Pitfalls that incorrectly respawn after not having time to finish their disappearing animation are removed.
- `0906` <!-- TaintedIsaacCollectibleDelay --> Tainted Isaac will no longer automatically pick up pedestal items from chests if they happen to rotate at the same time the chest is opened.
- `0907` <!-- TeleportInvalidEntrance --> All forms of teleport will no longer send you to an invalid entrance.
- <!-- FastTravel --> Returning from a crawl space in a Boss Rush or Devil Deal will no longer send you to the wrong room. (This is part of Fast-Travel.)
- <!-- FastTravel --> The trapdoor / beam of light in I AM ERROR rooms will no longer be accessible if the room is not cleared. (This is part of Fast-Travel.)
- <!-- SeededTeleports --> Teleport!, Cursed Eye, Broken Remote, and Telepills teleports are now seeded properly.
- <!-- SeededGBBug --> Morphed GB Bug pickups are now seeded in order rather than based on the InitSeed of the morphed pickup.
- <!-- SeededGlitterBombs --> The rewards from Glitter Bombs are now seeded.

### 10) Graphics Fixes

- `1001` <!-- DrawControls --> The controls graphic in the start room is changed to be speedrunning-themed.
- `1002` <!-- HolidayHats --> Show a festive hat during a holiday.
- `1003` <!-- HUDOffsetFix --> The default HUD offset is changed from 1.0 to 0.0.

> Why? This is how it was in Afterbirth+ and is likely the intended default value.

- `1004` <!-- PaschalCandle 3.221 --> Paschal Candle now visually "fills up" so that you can easily tell at a glance if it is maxed out.
- `1005` <!-- ScaredHeart 5.10.9 --> Scared Hearts now have a custom animation so that they are easier to identify.
- `1006` <!-- StickyNickel 5.20.6 --> Sticky Nickels now have a custom effect so that they are easier to identify.
- `1007` <!-- UniqueCardBacks 5.300 --> Blank Runes, Black Runes, and ? Cards now have a unique graphic so that they are easier to identify.
- <!-- "teammeatfont10.fnt", "teammeatfont10_0.png" --> The vanilla in-game timer and score text will no longer appear. (Hold Tab to see a custom in-game timer.)

> Why? The text blocks gameplay.

- <!-- ui_streak.anm2 --> Streak text is revamped so that it will no longer block gameplay.
- <!-- RemoveFortuneCookieBanner --> The banner for fortune cookies graphics for fortunes and custom seeds is removed.

> Why? So that gameplay is not blocked when you use Rules card.

- <!-- "ui_hearts.png" --> The heart UI sprites have been modified so that it is easier to see an empty heart container on a black background.
- <!-- 5.70 --> Pills now have a consistent orientation regardless of whether they are on the ground or in your inventory.
- <!-- 5.70 --> The color of some pills are changed to make them easier to identify at a glance:
  - <!-- PILL_ORANGE_ORANGE (3) --> Orange / Orange --> Full purple
  - <!-- PILL_REDDOTS_RED (5) --> White-dotted / Red --> Full red
  - <!-- PILL_PINK_RED (6) --> Pink / Red --> White / Red
  - <!-- PILL_ORANGEDOTS_WHITE (9) --> White / White-dotted --> Full white-dotted
  - <!-- PILL_WHITE_AZURE (10) --> White / Cyan --> White / Green
- The colors of some Purity auras have been changed to make them easier to see. Speed is now green and range is now yellow.
- The Distant Admiration, Forever Alone, and Friend Zone sprites now match the color of the actual familiars. <!-- 5.100.57, 5.100.128, 5.100.364 -->
- The 20/20 sprite is now easier to see. <!-- 5.100.245, "collectibles_245_2020_custom.png" -->
- The Star of Bethlehem sprite is now more distinct from Eden's Soul. (Credit goes to [Chebupeli](https://steamcommunity.com/profiles/76561198370261026).) <!-- 5.100.651, "collectibles_651_starofbethlehem_custom.png" -->
- The Error trinket sprite now has an outline. (Credit goes to [O_o](http://steamcommunity.com/profiles/76561197993627005).) <!-- 5.350.75, "trinket_075_error.png" -->
- The Locust of Famine sprite now matches the color of the flies. <!-- 5.350.115, "trinket_115_locustoffamine.png" -->
- The icon for a dirty bedroom is now a cobweb so that it is more distinct from a clean bedroom.
- All fog is removed.

> Why? It makes elements on the screen easier to see and it makes the game run better on slower computers.

### 11) Sound Fixes

- `1101` <!-- SilenceMomDad --> The audio clips of mom and dad on the Ascent are silenced.

### 12) Other

- `1201` <!-- CharacterTimer --> In multi-character speedruns, draw a second timer that shows the time since the last checkpoint.
- `1202` <!-- Chat --> Chat from your race opponents will be drawn on the screen.
- `1203` <!-- Shadows --> Your race opponents will appear on your screen as faded sprites during seeded races.
- <!-- DrawVersion --> Pressing the "F1" key on the keyboard will draw the version of Racing+ on the screen.
- <!-- ForceFadedConsoleDisplay --> The "faded console display" feature is automatically enabled in the "options.ini" file, which allows you to visually see when an error in the game happens.

<br>

## Additional Changes for Multi-Character Speedruns (Custom Challenges)

Racing+ has [several custom challenges](challenges.md), each of which introduces additional changes to the game.

<br>
