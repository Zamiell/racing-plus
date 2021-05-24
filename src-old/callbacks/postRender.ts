/*
export function main(): void {
  // Draw graphics
  sprites.display();
  drawStreakText();
  schoolbag.spriteDisplay();
  soulJar.spriteDisplay();
  theLostHealth();
  holyMantle();
  leadPencilChargeBar();
  schoolbag.glowingHourGlass();
  timer.checkDisplayRaceSpeedrun();
  timer.checkDisplayRun();
  timer.checkDisplaySeededDeath();
  displayFloorName();
  pills.postRender();
  changeCharOrder.postRender();
  changeKeybindings.postRender();
  drawNumSacRoom();
  displayTopLeftText();
  drawVersion();

  // Check for inputs
  checkDirection();

  // Make Cursed Eye seeded
  checkCursedEye();

  // Speed up teleport animations
  speedUpTeleport();

  // Check for trapdoor related things
  fastTravel.trapdoor.checkState();

  // Check to see if ( we are subverting a teleport from Gurdy, Mom, Mom's Heart, || It Lives
  checkSubvertTeleport();

  // Check for the seeded death mechanic
  // (this is not in the "PostRender.Race()" function because it also applies to speedruns)
  seededDeath.postRender();

  // Do race specific stuff
  race();
  shadow.Draw();

  // Handle things for multi-character speedruns
  speedrunPostRender.main();
}

// We replace the vanilla streak text because it blocks the map occasionally
function drawStreakText() {
  if (g.run.streakFrame === 0) {
    // Only draw the secondary streak text if ( there is no normal streak text showing
    if (g.run.streakText2 !== "") {
      // Draw the string
      const posGame = misc.gridToPos(6, 0); // Below the top door
      const pos = Isaac.WorldToRenderPosition(posGame);
      const color = KColor(1, 1, 1, 1);
      const scale = 1;
      const length = g.font.GetStringWidthUTF8(g.run.streakText2) * scale;
      g.font.DrawStringScaled(
        g.run.streakText2,
        pos.X - length / 2,
        pos.Y,
        scale,
        scale,
        color,
        0,
        true,
      );
    }
    return;
  }

  // Players who prefer the vanilla streak text will have a separate mod enabled
  if (VanillaStreakText === true && !g.run.streakForce) {
    return;
  }

  // The streak text will slowly fade out
  const elapsedFrames = Isaac.GetFrameCount() - g.run.streakFrame;
  const framesBeforeFade = 50;
  let fade;
  if (elapsedFrames <= framesBeforeFade) {
    fade = 1;
  } else {
    const fadeFrames = elapsedFrames - framesBeforeFade;
    fade = 1 - 0.02 * fadeFrames;
  }
  if (fade <= 0) {
    g.run.streakFrame = 0;
    g.run.streakForce = false;
    return;
  }

  // Draw the string
  const posGame = misc.gridToPos(6, 0); // Below the top door
  const pos = Isaac.WorldToRenderPosition(posGame);
  const color = KColor(1, 1, 1, fade);
  const scale = 1;
  const length = g.font.GetStringWidthUTF8(g.run.streakText) * scale;
  g.font.DrawStringScaled(
    g.run.streakText,
    pos.X - length / 2,
    pos.Y,
    scale,
    scale,
    color,
    0,
    true,
  );
}

function theLostHealth() {
  const character = g.p.GetPlayerType();
  if (character !== PlayerType.PLAYER_THELOST) {
    return;
  }

  if (g.run.lostHealthSprite === null) {
    g.run.lostHealthSprite = Sprite();
    g.run.lostHealthSprite.Load("gfx/ui/p20_lost_health.anm2", true);
  }

  const hudOffsetX = 0;
  const hudOffsetY = 0;

  let offsetX = hudOffsetX + 41;
  if (g.p.GetExtraLives() > 0) {
    offsetX += 24;
  }

  const offsetY = hudOffsetY + 2;

  let animationToPlay = "Empty_Heart";
  if (g.p.GetSoulHearts() >= 1) {
    animationToPlay = "Lost_Heart_Half";
  }
  g.run.lostHealthSprite.Play(animationToPlay, true);
  g.run.lostHealthSprite.Render(
    Vector(offsetX, offsetY),
    Vector.Zero,
    Vector.Zero,
  );
}

function holyMantle() {
  const effects = g.p.GetEffects();
  const numMantles = effects.GetCollectibleEffectNum(
    CollectibleType.COLLECTIBLE_HOLY_MANTLE,
  );
  if (numMantles < 1) {
    return;
  }

  if (g.run.holyMantleSprite === null) {
    g.run.holyMantleSprite = Sprite();
    g.run.holyMantleSprite.Load("gfx/ui/p20_holy_mantle.anm2", true);
  }

  const hudOffset1Heart = 41;
  const hudOffset2Heart = hudOffset1Heart + 12;
  const hudOffset3Heart = hudOffset2Heart + 12;
  const hudOffset4Heart = hudOffset3Heart + 12;
  const hudOffset5Heart = hudOffset4Heart + 12;
  const hudOffset6Heart = hudOffset5Heart + 12;

  const hudOffset1Row = 2;
  const hudOffset2Row = hudOffset1Row + 10;

  let yOffset: int;
  let xOffset = hudOffset6Heart;

  const visibleHearts = misc.getPlayerVisibleHearts();
  if (visibleHearts > 6) {
    yOffset = hudOffset2Row;
  } else {
    yOffset = hudOffset1Row;
  }

  let xHeart = visibleHearts % 6;
  if (xHeart === 0) {
    xHeart = 6;
  }

  if (xHeart <= 1) {
    xOffset = hudOffset1Heart;
  } else if (xHeart === 2) {
    xOffset = hudOffset2Heart;
  } else if (xHeart === 3) {
    xOffset = hudOffset3Heart;
  } else if (xHeart === 4) {
    xOffset = hudOffset4Heart;
  } else if (xHeart === 5) {
    xOffset = hudOffset5Heart;
  } else if (xHeart >= 6) {
    xOffset = hudOffset6Heart;
  }

  if (g.l.GetCurses() === LevelCurse.CURSE_OF_THE_UNKNOWN) {
    xOffset = hudOffset1Heart;
  }

  const character = g.p.GetPlayerType();
  if (character === PlayerType.PLAYER_THELOST) {
    if (g.p.GetExtraLives() > 0) {
      xOffset += 24;
    }
  }

  let animationToPlay;
  if (character === PlayerType.PLAYER_KEEPER) {
    animationToPlay = "Keeper_Mantle";
  } else {
    animationToPlay = "Mantle";
  }

  g.run.holyMantleSprite.Play(animationToPlay, true);
  g.run.holyMantleSprite.Render(
    Vector(xOffset, yOffset),
    Vector.Zero,
    Vector.Zero,
  );
}

// Make an additional charge bar for the Lead Pencil
function leadPencilChargeBar() {
  const character = g.p.GetPlayerType();
  const flyingOffset = g.p.GetFlyingOffset();

  if (
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_LEAD_PENCIL) ||
    character === PlayerType.PLAYER_AZAZEL || // 7
    character === PlayerType.PLAYER_LILITH || // 13
    character === PlayerType.PLAYER_THEFORGOTTEN || // 16
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) || // 52
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY) || // 68
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) || // 114
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) || // 118
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) || // 168
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) // 395
  ) {
    return;
  }

  // Initialize the sprite
  if (g.run.pencilSprite === null) {
    g.run.pencilSprite = Sprite();
    g.run.pencilSprite.Load("gfx/chargebar_pencil.anm2", true);
  }

  // Adjust the position slightly so that it appears properly centered on the player,
  // taking into account the size of the player sprite and if there are any existing charge bars
  const adjustX = 18.5 * g.p.SpriteScale.X;
  let adjustY = 15 + 54 * g.p.SpriteScale.Y - flyingOffset.Y;
  const chargeBarHeight = 4.5;
  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) || // 69
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) || // 229
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) // 316
  ) {
    adjustY += chargeBarHeight;
    if (flyingOffset.Y !== 0) {
      // When the character has flying, the charge bar will overlap, so manually adjust for this
      adjustY -= 6; // 5 is too small and 6 is just right
    }
  }
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_VOID)) {
    adjustY += chargeBarHeight;
  }
  const adjustedPosition = Vector(
    g.p.Position.X + adjustX,
    g.p.Position.Y - adjustY,
  );

  // Render it
  // (there are 101 frames in the "Charging animation" and it takes 15 shots to fire a pencil
  // barrage)
  let barFrame = g.run.pencilCounter * (101 / 15);
  barFrame = Math.round(barFrame);
  g.run.pencilSprite.SetFrame("Charging", barFrame);
  g.run.pencilSprite.Render(
    g.r.WorldToScreenPosition(adjustedPosition),
    Vector.Zero,
    Vector.Zero,
  );
}

// Fix the bug where diagonal knife throws have a 1-frame window when playing on keyboard (1/2)
function checkDirection() {
  const directions: boolean[] = [];
  for (let i = 0; i < 4; i++) {
    // This corresponds to the "ButtonAction.ACTION_SHOOT" enum

    const directionPushed = Input.IsActionPressed(i + 3, 0);
    // (e.g. ButtonAction.ACTION_SHOOTLEFT is 4)
    directions.push(directionPushed);
  }
  g.run.directions.push(directions);
  if (g.run.directions.length > 2) {
    // We want there to be a 3-frame window instead of a 1-frame window
    g.run.directions.splice(0, 1);
  }
}

// Make Cursed Eye seeded
// (this has to be in the PostRender callback because game frames do not tick when the teleport
// animation is happening)
function checkCursedEye() {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const playerSprite = g.p.GetSprite();
  const hearts = g.p.GetHearts();
  const soulHearts = g.p.GetSoulHearts();

  if (
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) ||
    !playerSprite.IsPlaying("TeleportUp") ||
    g.run.lastDamageFrame === 0 ||
    // If we were not damaged on this frame, we can assume it is not a Cursed Eye teleport
    gameFrameCount !== g.run.lastDamageFrame ||
    g.run.usedTeleport
  ) {
    return;
  }

  // Account for the Cursed Skull trinket
  if (
    g.p.HasTrinket(TrinketType.TRINKET_CURSED_SKULL) &&
    // 1/2 of a heart remaining
    ((hearts === 1 && soulHearts === 0) || (hearts === 0 && soulHearts === 1))
  ) {
    Isaac.DebugString("Cursed Skull teleport detected.");
    return;
  }

  Isaac.DebugString("Cursed Eye teleport detected.");
  useItem.teleport();
}

function speedUpTeleport() {
  // Local variables
  const playerSprite = g.p.GetSprite();

  // Replace the "item raising" animation after using Telepills with a "TeleportUp" animation
  // (this has to be in the PostRender callback because game frames do not tick when the use
  // animation is happening)
  if (g.run.usedTelepills) {
    g.run.usedTelepills = false;
    playerSprite.Play("TeleportUp", true);
    Isaac.DebugString(
      'Replaced the "use" animation for Telepills with a "TeleportUp" animation.',
    );
  }

  // Replace the "item raising" animation after using Blank Card with a "TeleportUp" animation
  // (this has to be in the PostRender callback because game frames do not tick when the use
  // animation is happening)
  if (g.run.usedBlankCard) {
    g.run.usedBlankCard = false;
    // Using "playerSprite.Play("TeleportUp", true)" does not work here for some reason
    g.p.AnimateTeleport(true);
    Isaac.DebugString(
      'Replaced the "use" animation for Blank Card with a "TeleportUp" animation.',
    );
  }

  // The vanilla teleport animations are annoyingly slow, so speed them up by a factor of 2
  if (
    (playerSprite.IsPlaying("TeleportUp") ||
      playerSprite.IsPlaying("TeleportDown")) &&
    playerSprite.PlaybackSpeed === 1
  ) {
    playerSprite.PlaybackSpeed = 2;
    Isaac.DebugString("Increased the playback speed of a teleport animation.");

    // Furthermore, cancel any ongoing Challenge Rooms
    challengeRooms.teleport();
  }
}

// Check to see if we are subverting a teleport from Gurdy, Mom, Mom's Heart, or It Lives
function checkSubvertTeleport() {
  // Local variables
  const stage = g.l.GetStage();

  if (!g.run.room.teleportSubverted) {
    return;
  }
  g.run.room.teleportSubverted = false;

  // Find the correct position to teleport to, depending on which door we entered from
  let pos: Vector;
  if (stage === 6) {
    pos = getEnterPosForMom();
  } else {
    pos = getEnterPosForGurdyOrItLives();
  }

  // Teleport them and make them visible again
  g.p.Position = pos;
  g.p.SpriteScale = g.run.room.teleportSubvertScale;

  // Also, teleport all of the familiars (and make them visible again)
  const familiars = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    -1,
    -1,
    false,
    false,
  );
  for (const familiar of familiars) {
    familiar.Position = pos;
    familiar.Visible = true;
  }

  Isaac.DebugString("Subverted a position teleport (2/2).");
}

function drawNumSacRoom() {
  const roomType = g.r.GetType();
  if (roomType !== RoomType.ROOM_SACRIFICE) {
    return;
  }

  const roomFrameCount = g.r.GetFrameCount();
  if (roomFrameCount === 0) {
    return;
  }

  // We want to place informational text for the player to the right of the heart containers
  // (which will depend on how many heart containers we have)
  // (this code is copied from the "DisplayTopLeftText()" function)
  const x = 55 + misc.getHeartXOffset();
  const y = 10;
  const text = `Sacrifices: ${g.run.level.numSacrifices}`;
  Isaac.RenderText(text, x, y, 2, 2, 2, 2);
}

function displayTopLeftText() {
  // Local variables
  const seedString = g.seeds.GetStartSeedString();

  // We want to place informational text for the player to the right of the heart containers
  // (which will depend on how many heart containers we have)
  const x = 55 + misc.getHeartXOffset();
  let y = 10;
  const lineLength = 15;

  if (g.raceVars.victoryLaps > 0) {
    // Display the number of victory laps
    // (this should have priority over showing the seed)
    Isaac.RenderText(
      `Victory Lap #${g.raceVars.victoryLaps}`,
      x,
      y,
      2,
      2,
      2,
      2,
    );
  } else if (g.run.endOfRunText) {
    // Show some run summary information
    // (it will be removed if they exit the room)
    const firstLine = `R+ ${VERSION} - ${seedString}`;
    Isaac.RenderText(firstLine, x, y, 2, 2, 2, 2);
    y += lineLength;
    let secondLine: string;
    if (inSpeedrun()) {
      // We can't put average time on a 3rd line because it will be blocked by the Checkpoint item
      // text
      secondLine = `Avg. time per char: ${speedrun.getAverageTimePerCharacter()}`;
    } else {
      secondLine = `Rooms entered: ${g.run.roomsEntered}`;
    }
    Isaac.RenderText(secondLine, x, y, 2, 2, 2, 2);

    // Draw a 3rd line to show the total frames
    if (!inSpeedrun() || speedrun.isOnFinalCharacter()) {
      let frames: int;
      if (inSpeedrun()) {
        frames = g.speedrun.finishedFrames;
      } else {
        frames = g.raceVars.finishedFrames;
      }
      const seconds = misc.round(frames / 60, 1);
      y += lineLength;
      const thirdLine = `${frames} frames (${seconds}s)`;
      Isaac.RenderText(thirdLine, x, y, 2, 2, 2, 2);
    }
  } else if (
    g.race.raceID !== null &&
    g.race.status === "in progress" &&
    g.run.roomsEntered <= 1 &&
    Isaac.GetTime() - g.raceVars.startedTime <= 2000
  ) {
    // Only show it in the first two seconds of the race
    Isaac.RenderText(`Race ID: ${g.race.raceID}`, x, y, 2, 2, 2, 2);
  }
}

// Do race specific stuff
function race() {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();
  const challenge = Isaac.GetChallenge();
  const topSprite = sprites.sprites.get("top");

  // If we are not in a race, do nothing
  if (g.race.status === "none" && challenge !== ChallengeCustom.R7_SEASON_7) {
    sprites.clearPostRaceStartGraphics();
  }
  if (g.race.status === "none") {
    // Remove graphics as soon as the race is over
    sprites.init("top", "");
    sprites.clearStartingRoomGraphicsTop();
    sprites.clearStartingRoomGraphicsBottom();
    if (!g.raceVars.finished) {
      sprites.init("place", ""); // Keep the place there at the end of a race
    }
    return;
  }

  //
  // Race validation / show warning messages
  //

  if (
    g.race.difficulty === "hard" &&
    g.g.Difficulty !== Difficulty.DIFFICULTY_HARD &&
    g.race.rFormat !== "custom"
  ) {
    sprites.init("top", "error-not-hard-mode"); // Error: You are not on hard mode.
    return;
  }

  if (
    topSprite !== undefined &&
    topSprite.spriteName === "error-not-hard-mode"
  ) {
    sprites.init("top", "");
  }

  if (
    g.race.difficulty === "normal" &&
    g.g.Difficulty !== Difficulty.DIFFICULTY_NORMAL &&
    g.race.rFormat !== "custom"
  ) {
    sprites.init("top", "error-hard-mode"); // Error: You are on hard mode.
    return;
  }

  if (topSprite !== undefined && topSprite.spriteName === "error-hard-mode") {
    sprites.init("top", "");
  }

  //
  // Graphics for the "Race Start" room
  //

  // Show the graphics for the "Race Start" room (the top half)
  if (g.race.status === "open" && roomIndex === GridRooms.ROOM_DEBUG_IDX) {
    sprites.init("top", "wait"); // "Wait for the race to begin!"
    sprites.init("myStatus", g.race.myStatus);
    sprites.init("ready", g.race.placeMid.toString());
    // We use "placeMid" to hold this variable, since it isn't used before a race starts
    sprites.init("slash", "slash");
    sprites.init("readyTotal", g.race.numEntrants.toString());
  } else {
    if (topSprite !== undefined && topSprite.spriteName === "wait") {
      // There can be other things on the "top" sprite location and we don't want to have to reload
      // it on every frame
      sprites.init("top", "");
    }
    sprites.clearStartingRoomGraphicsTop();
  }

  // Show the graphics for the "Race Start" room (the bottom half)
  if (
    (g.race.status === "open" || g.race.status === "starting") &&
    roomIndex === GridRooms.ROOM_DEBUG_IDX
  ) {
    if (g.race.ranked || !g.race.solo) {
      sprites.init("raceRanked", "ranked");
      sprites.init("raceRankedIcon", "ranked-icon");
    } else {
      sprites.init("raceRanked", "unranked");
      sprites.init("raceRankedIcon", "unranked-icon");
    }
    sprites.init("raceFormat", g.race.rFormat);
    sprites.init("raceFormatIcon", `${g.race.rFormat}-icon`);
    sprites.init("goal", "goal");
    sprites.init("raceGoal", g.race.goal);
  } else {
    sprites.clearStartingRoomGraphicsBottom();
  }

  //
  // Countdown graphics
  //

  // Show the appropriate countdown graphic/text
  if (g.race.status === "starting") {
    if (g.race.countdown === 10) {
      sprites.init("top", "10");
    } else if (g.race.countdown === 5) {
      sprites.init("top", "5");
    } else if (g.race.countdown === 4) {
      sprites.init("top", "4");
    } else if (g.race.countdown === 3) {
      sprites.init("top", "3");
    } else if (g.race.countdown === 2) {
      sprites.init("top", "2");
    } else if (g.race.countdown === 1) {
      sprites.init("top", "1");
    }
  }

  //
  // Race active
  //

  if (g.race.status === "in progress") {
    // The client will set countdown equal to 0 and the status equal to "in progress" at the same
    // time
    if (!g.raceVars.started) {
      // Reset some race-related variables
      g.raceVars.started = true;
      // We don't want to show the place graphic until we get to the 2nd floor
      g.raceVars.startedTime = Isaac.GetTime(); // Mark when the race started
      g.raceVars.startedFrame = Isaac.GetFrameCount(); // Also mark the frame the race started
      Isaac.DebugString(`Starting the race! (${g.race.rFormat})`);
    }

    // Find out how much time has passed since the race started
    // "Isaac.GetTime()" is analogous to Lua's "os.clock()"
    const elapsedMilliseconds = Isaac.GetTime() - g.raceVars.startedTime;
    const elapsedSeconds = elapsedMilliseconds / 1000;

    // Draw the "Go!" graphic
    if (elapsedSeconds < 3) {
      sprites.init("top", "go");
    } else {
      sprites.init("top", "");
    }

    // Draw the graphic that shows what place we are in
    if (
      stage >= 2 && // Our place is irrelevant on the first floor, so don't bother showing it
      // It is irrelevant to show "1st" when there is only one person in the race
      !g.race.solo
    ) {
      sprites.init("place", g.race.placeMid.toString());
    } else {
      sprites.init("place", "");
    }
  }

  // Remove graphics as soon as we enter another room
  // (this is done separately from the above if block in case the client and mod become
  // desynchronized)
  if (g.raceVars.started === true && g.run.roomsEntered > 1) {
    sprites.clearPostRaceStartGraphics();
  }

  // Hold the player in place when in the Race Room (to emulate the Gaping Maws effect)
  // (this looks glitchy and jittery if it is done in the PostUpdate callback, so do it here
  // instead)
  if (roomIndex === GridRooms.ROOM_DEBUG_IDX && !g.raceVars.started) {
    // The starting position is (320, 380)
    g.p.Position = Vector(320, 380);
  }
}

function drawVersion() {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  // Make the version persist for at least 2 seconds after the player presses "v"
  if (Input.IsButtonPressed(Keyboard.KEY_V, 0)) {
    g.run.showVersionFrame = gameFrameCount + 60;
  }

  if (g.run.showVersionFrame === 0 || gameFrameCount > g.run.showVersionFrame) {
    return;
  }

  const center = misc.getScreenCenterPosition();
  let text: string;
  let x: int;
  let y: int;

  // Render the version of the mod
  text = "Racing+";
  x = center.X - 3 * text.length;
  y = center.Y + 40;
  Isaac.RenderText(text, x, y, 2, 2, 2, 2);

  text = VERSION;
  x = center.X - 3 * text.length;
  y += 15;
  Isaac.RenderText(text, x, y, 2, 2, 2, 2);

  if (RacingPlusRebalancedVersion !== undefined) {
    text = "Racing+ Rebalanced";
    x = center.X - 3 * text.length;
    y += 15;
    Isaac.RenderText(text, x, y, 2, 2, 2, 2);

    text = RacingPlusRebalancedVersion.toString();
    x = center.X - 3 * text.length;
    y += 15;
    Isaac.RenderText(text, x, y, 2, 2, 2, 2);
  }
}

function displayFloorName() {
  // Players who prefer the vanilla streak text will have a separate mod enabled
  if (VanillaStreakText !== null) {
    return;
  }

  // Only show the floor name if the user is pressing tab
  if (!misc.isActionPressed(ButtonAction.ACTION_MAP)) {
    g.run.streakText2 = "";
    return;
  }

  // Local variables
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  g.run.streakText2 = g.l.GetName(stage, stageType, 0, 0, false);
}
*/
