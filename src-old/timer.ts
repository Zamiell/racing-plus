import { SEASON_6_ITEM_LOCK_MILLISECONDS } from "./challenges/constants";
import { ChallengeCustom } from "./challenges/enums";
import { inSpeedrun } from "./challenges/misc";
import g from "./globals";
import * as misc from "./misc";
import { CollectibleTypeCustom, SeededDeathState } from "./types/enums";

// Types
enum TimerType {
  RACE_OR_SPEEDRUN,
  RUN,
  SEEDED_DEATH,
}
interface Sprites {
  clock: Sprite;
  colons: Sprite[]; // colon between minutes & seconds, colon between hours & minutes
  digits: Sprite[]; // minute1, minute2, second1, second2, hour
  digitMini: Sprite;
}

// Variables
export const spriteSetMap = new Map<int, Sprites>();

export function checkDisplayRaceSpeedrun(): void {
  // Always show the timer in a speedrun
  // Don't show the timer if the race has not started yet or they quit in the middle of the race
  if (inSpeedrun() || g.raceVars.started || g.raceVars.finished) {
    return;
  }

  // Find out how much time has passed since the race started
  // (or what the race finish time was)
  const challenge = Isaac.GetChallenge();
  let elapsedTime;
  if (challenge !== 0) {
    if (g.speedrun.finished) {
      elapsedTime = g.speedrun.finishedTime;
    } else if (g.speedrun.startedTime === 0) {
      elapsedTime = 0;
    } else {
      elapsedTime = Isaac.GetTime() - g.speedrun.startedTime;
    }
  } else if (g.raceVars.finished) {
    elapsedTime = g.raceVars.finishedTime;
  } else {
    elapsedTime = Isaac.GetTime() - g.raceVars.startedTime;
  }
  const seconds = elapsedTime / 1000; // This will be in milliseconds, so we divide by 1000

  const startingX = 19;
  const startingY = 217;

  display(TimerType.RACE_OR_SPEEDRUN, seconds, startingX, startingY);
}

export function checkDisplayRun(): void {
  // Only show the run timer if the player is pressing tab
  if (!misc.isActionPressed(ButtonAction.ACTION_MAP)) {
    return;
  }

  if (g.seeds.HasSeedEffect(SeedEffect.SEED_NO_HUD)) {
    return;
  }

  // Don't show it if we have identified a lot of pills, since it will overlap with the pill UI
  if (g.run.pills.length >= 11) {
    return;
  }

  // Find out how much time has passed since the run started
  let elapsedTime;
  if (g.run.startedTime === 0) {
    elapsedTime = 0;
  } else {
    elapsedTime = Isaac.GetTime() - g.run.startedTime;
  }
  const seconds = elapsedTime / 1000; // This will be in milliseconds, so we divide by 1000

  let startingX = 52;
  let startingY = 41;
  if (g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM)) {
    startingX = 87;
    startingY = 49;
  }

  display(TimerType.RUN, seconds, startingX, startingY);
}

export function checkDisplaySeededDeath(): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (g.seeds.HasSeedEffect(SeedEffect.SEED_NO_HUD)) {
    return;
  }

  let remainingTimeMilliseconds: int | undefined;
  let adjustTimerRight = false;
  let moveTimerToBottomRight = false;
  if (g.run.seededDeath.state >= SeededDeathState.FETAL_POSITION) {
    remainingTimeMilliseconds =
      g.run.seededDeath.debuffEndTime - Isaac.GetTime();
    if (challenge === ChallengeCustom.R7_SEASON_6) {
      // The timer needs to be moved to the right to account for the "(S6)" icon
      adjustTimerRight = true;
    }
  } else if (
    challenge === ChallengeCustom.R7_SEASON_6 &&
    g.speedrun.characterNum === 1 &&
    g.run.roomsEntered === 1
  ) {
    // If seeded death is not active,
    // display the time until the next starting build will be rotated in
    const timeStartingBuildExpires =
      g.season6.timeItemAssigned + SEASON_6_ITEM_LOCK_MILLISECONDS;
    remainingTimeMilliseconds = timeStartingBuildExpires - Isaac.GetTime();
    moveTimerToBottomRight = true;
  }
  if (
    remainingTimeMilliseconds === undefined ||
    remainingTimeMilliseconds <= 0
  ) {
    return;
  }

  // Convert milliseconds to seconds
  const seconds = remainingTimeMilliseconds / 1000;

  let startingX = 65;
  let startingY = 79;
  if (adjustTimerRight) {
    startingX += 18;
  }
  if (moveTimerToBottomRight) {
    const posGame = misc.gridToPos(11, 5);
    const pos = Isaac.WorldToRenderPosition(posGame);
    startingX = pos.X - 11;
    startingY = pos.Y - 10;
  }

  display(TimerType.SEEDED_DEATH, seconds, startingX, startingY);
}

export function display(
  timerType: TimerType,
  seconds: int,
  startingX: int,
  startingY: int,
): void {
  // Local variables
  const digitLength = 7.25;
  const hourAdjustment = 2;
  let hourAdjustment2 = 0;

  let sprites = spriteSetMap.get(timerType);
  if (sprites === undefined) {
    sprites = getNewTimerSprites();
    spriteSetMap.set(timerType, sprites);
  }

  const [
    hours,
    minute1,
    minute2,
    second1,
    second2,
    tenths,
  ] = convertSecondsToStrings(seconds);

  const posClock = Vector(startingX + 34, startingY + 45);
  sprites.clock.RenderLayer(0, posClock);

  if (hours > 0) {
    // The format is "#.##.##" (instead of "##.##", which is the default)
    hourAdjustment2 = 2;
    startingX += digitLength + hourAdjustment;
    const posHours = Vector(
      startingX - digitLength - hourAdjustment,
      startingY,
    );
    const hoursDigitSprite = sprites.digits[4];
    hoursDigitSprite.SetFrame("Default", hours);
    hoursDigitSprite.RenderLayer(0, posHours);

    const posColon = Vector(startingX - digitLength + 7, startingY + 19);
    const colonHoursSprite = sprites.colons[1];
    colonHoursSprite.RenderLayer(0, posColon);
  }

  const posMinute1 = Vector(startingX, startingY);
  const minute1Sprite = sprites.digits[0];
  minute1Sprite.SetFrame("Default", minute1);
  minute1Sprite.RenderLayer(0, posMinute1);

  const posMinute2 = Vector(startingX + digitLength, startingY);
  const minute2Sprite = sprites.digits[1];
  minute2Sprite.SetFrame("Default", minute2);
  minute2Sprite.RenderLayer(0, posMinute2);

  const posColon1 = Vector(startingX + digitLength + 10, startingY + 19);
  const colonMinutesSprite = sprites.colons[0];
  colonMinutesSprite.RenderLayer(0, posColon1);

  const posSecond1 = Vector(startingX + digitLength + 11, startingY);
  const second1Sprite = sprites.digits[2];
  second1Sprite.SetFrame("Default", second1);
  second1Sprite.RenderLayer(0, posSecond1);

  const posSecond2 = Vector(
    startingX + digitLength + 11 + digitLength + 1 - hourAdjustment2,
    startingY,
  );
  const second2Sprite = sprites.digits[3];
  second2Sprite.SetFrame("Default", second2);
  second2Sprite.RenderLayer(0, posSecond2);

  const posTenths = Vector(
    startingX +
      digitLength +
      11 +
      digitLength +
      1 -
      hourAdjustment2 +
      digitLength,
    startingY + 1,
  );
  sprites.digitMini.SetFrame("Default", tenths);
  sprites.digitMini.RenderLayer(0, posTenths);
}

function getNewTimerSprites() {
  const sprites: Sprites = {
    clock: Sprite(),
    colons: [],
    digits: [],
    digitMini: Sprite(),
  };

  // The sprites have not been loaded yet, so load them
  sprites.clock.Load("gfx/timer/clock.anm2", true);
  sprites.clock.SetFrame("Default", 0);

  for (let i = 0; i < 2; i++) {
    const colonSprite = Sprite();
    colonSprite.Load("gfx/timer/colon.anm2", true);
    colonSprite.SetFrame("Default", 0);
    sprites.colons.push(colonSprite);
  }

  for (let i = 0; i < 5; i++) {
    const digitSprite = Sprite();
    digitSprite.Load("gfx/timer/timer.anm2", true);
    digitSprite.SetFrame("Default", 0);
    sprites.digits.push(digitSprite);
  }

  sprites.digitMini.Load("gfx/timer/timerMini.anm2", true);
  sprites.digitMini.SetFrame("Default", 0);

  return sprites;
}

export function convertSecondsToStrings(
  totalSeconds: int,
): [int, int, int, int, int, int] {
  // Calculate the hours digit
  const hours = math.floor(totalSeconds / 3600);

  // Calculate the minutes digits
  let minutes = math.floor(totalSeconds / 60);
  if (hours > 0) {
    minutes -= hours * 60;
  }
  let minutesString: string;
  if (minutes < 10) {
    minutesString = `0${minutes}`;
  } else {
    minutesString = minutes.toString();
  }

  // The first character
  const minute1String = string.sub(minutesString, 1, 1);
  const minute1 = parseInt(minute1String, 10);

  // The second character
  const minute2String = string.sub(minutesString, 2, 2);
  const minute2 = parseInt(minute2String, 10);

  // Calculate the seconds digits
  const seconds = math.floor(totalSeconds % 60);
  let secondsString: string;
  if (seconds < 10) {
    secondsString = `0${seconds}`;
  } else {
    secondsString = seconds.toString();
  }

  // The first character
  const second1String = string.sub(secondsString, 1, 1);
  const second1 = parseInt(second1String, 10);

  // The second character
  const second2String = string.sub(secondsString, 2, 2);
  const second2 = parseInt(second2String, 10);

  // Calculate the tenths digit
  const rawSeconds = totalSeconds % 60; // 0.000 to 59.999
  const decimals = rawSeconds - math.floor(rawSeconds);
  const tenths = math.floor(decimals * 10);

  return [hours, minute1, minute2, second1, second2, tenths];
}
