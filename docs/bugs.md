# Racing+ Mod Known Bugs

<!-- markdownlint-disable MD033 -->

Some gameplay-related bugs are not fixable due to the limitations of the game's Lua API.

<br>

## Miscellaneous Bugs

- When returning to a big room from a crawl space, the camera will jerk from the door to the location of the crawl space.
- The Great Gideon crawl space is not be handled by the fast-travel feature.
- Bob's Bladder produces green creep instead of blue. (Reported by PassionDrama)
- The charges from killing enemies with 4.5 Volt will not prioritize the pocket active item. (Reported by Gamonymous)
- Guppy's Eye will not work correctly when it needs to show a Red Chest that gives a Devil Room item. (Reported by Moucheron Quipet)
- The effects of an Empress? card will be cut short if you enter a trapdoor.
- If you touch the edge of a crawl space, you can sometimes trigger the vanilla animation. If this happens, you might return to the starting room of the floor. This has to do with the vanilla game not reading the state of the crawl space correctly. (Reported by KiraKeepKool)
- Custom fortunes and custom Rules Card text no longer works as of vanilla patch 1.7.5 (due to localization).
- In seeded races, it is possible to get The Fallen as a boss without having taken a Devil Deal. (Reported by Gamonymous)
- In seeded races, the stats HUD will always show Devil Rooms, regardless of whether Devil Rooms or Angel Rooms are locked in to the seed.

<br>

## Bugs with Seeded Death

- Being a ghost will prevent Brimstone-style lasers from firing. (Reported by Xelnas)
- Specific items do not work properly:
  - Small Rock (#90) - After revival, you can get a 2nd Small Rock from a tinted rock. (Reported by Moucheron Quipet)
  - Experimental Treatment (#240) - Dying will not remove the stat modification that it granted. (Reported by Gamonymous)
  - Mega Blast (#441) - Being a ghost while the blast is active will show the animation playing and have knockback, but the blast itself will be removed. (Reported by Gamonymous)
  - Red Stew (#621) - The temporary damage buff will not be affected by dying. (Reported by Hispa)
  - Esau Jr. (#703) - Using it while being a ghost will give the items back to the wrong character. (Reported by Gamonymous)
- Death will be permanent if:
  - You have one red heart container left and remove Mother's Kiss. (Reported by Gamonymous)
  - The Bible is used in the Satan fight. (Reported by Adrayon)

<br>
