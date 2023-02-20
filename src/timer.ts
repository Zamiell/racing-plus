import { CollectibleType } from "isaac-typescript-definitions";
import {
  DefaultMap,
  game,
  getHUDOffsetVector,
  isBethany,
  isJacobOrEsau,
} from "isaacscript-common";
import { TimerType } from "./enums/TimerType";
import { newSprite } from "./sprite";

class TimerSprites {
  clock = newSprite("gfx/timer/clock.anm2");

  colons = {
    afterMinutes: newSprite("gfx/timer/colon.anm2"),
    afterHours: newSprite("gfx/timer/colon.anm2"),
  };

  digits = {
    minute1: newSprite("gfx/timer/timer.anm2"),
    minute2: newSprite("gfx/timer/timer.anm2"),
    second1: newSprite("gfx/timer/timer.anm2"),
    second2: newSprite("gfx/timer/timer.anm2"),
    hour: newSprite("gfx/timer/timer.anm2"),
  };

  digitMini = newSprite("gfx/timer/timer_mini.anm2");
}

const DIGIT_LENGTH = 7.25;
const RACE_TIMER_POSITION = Vector(19, 198); // Directly below the stat HUD

const spriteCollectionMap = new DefaultMap<int, TimerSprites>(
  () => new TimerSprites(),
);

export function draw(
  timerType: TimerType,
  seconds: int,
  startingX?: int,
  startingY?: int,
): void {
  const hud = game.GetHUD();
  if (!hud.IsVisible()) {
    return;
  }

  // We want the timers to be drawn when the game is paused so that players can continue to see the
  // seeded death countdown if they tab out of the game.

  if (seconds < 0) {
    return;
  }

  if (startingX === undefined) {
    startingX = RACE_TIMER_POSITION.X;
  }
  if (startingY === undefined) {
    startingY = RACE_TIMER_POSITION.Y;
  }

  const player = Isaac.GetPlayer();
  const HUDOffsetVector = getHUDOffsetVector();
  startingX += HUDOffsetVector.X;
  startingY += HUDOffsetVector.Y;

  if (isBethany(player)) {
    startingY += 8;
  } else if (isJacobOrEsau(player)) {
    startingY += 25;
  }

  if (player.HasCollectible(CollectibleType.DUALITY)) {
    startingY -= 10;
  }

  const hourAdjustment = 2;
  let hourAdjustment2 = 0;

  const sprites = spriteCollectionMap.getAndSetDefault(timerType);

  const { hours, minute1, minute2, second1, second2, tenths } =
    convertSecondsToTimerValues(seconds);

  const positionClock = Vector(startingX + 34, startingY + 45);
  sprites.clock.Render(positionClock);

  if (hours > 0) {
    // The format is "#.##.##" (instead of "##.##", which is the default).
    hourAdjustment2 = 2;
    startingX += DIGIT_LENGTH + hourAdjustment;

    const positionHours = Vector(
      startingX - DIGIT_LENGTH - hourAdjustment,
      startingY,
    );
    sprites.digits.hour.SetFrame("Default", hours);
    sprites.digits.hour.Render(positionHours);

    const positionColon = Vector(startingX - DIGIT_LENGTH + 7, startingY + 19);
    sprites.colons.afterHours.Render(positionColon);
  }

  const positionMinute1 = Vector(startingX, startingY);
  sprites.digits.minute1.SetFrame("Default", minute1);
  sprites.digits.minute1.Render(positionMinute1);

  const positionMinute2 = Vector(startingX + DIGIT_LENGTH, startingY);
  sprites.digits.minute2.SetFrame("Default", minute2);
  sprites.digits.minute2.Render(positionMinute2);

  const positionColon1 = Vector(startingX + DIGIT_LENGTH + 10, startingY + 19);
  sprites.colons.afterMinutes.Render(positionColon1);

  const positionSecond1 = Vector(startingX + DIGIT_LENGTH + 11, startingY);
  sprites.digits.second1.SetFrame("Default", second1);
  sprites.digits.second1.Render(positionSecond1);

  const positionSecond2 = Vector(
    startingX + DIGIT_LENGTH + 11 + DIGIT_LENGTH + 1 - hourAdjustment2,
    startingY,
  );
  sprites.digits.second2.SetFrame("Default", second2);
  sprites.digits.second2.Render(positionSecond2);

  const positionTenths = Vector(
    startingX +
      DIGIT_LENGTH +
      11 +
      DIGIT_LENGTH +
      1 -
      hourAdjustment2 +
      DIGIT_LENGTH,
    startingY + 1,
  );
  sprites.digitMini.SetFrame("Default", tenths);
  sprites.digitMini.Render(positionTenths);
}

export function convertSecondsToTimerValues(totalSeconds: int): {
  hours: int;
  minute1: int;
  minute2: int;
  second1: int;
  second2: int;
  tenths: int;
} {
  // Calculate the hours digit.
  const hours = math.floor(totalSeconds / 3600);

  // Calculate the minutes digits.
  let minutes = math.floor(totalSeconds / 60);
  if (hours > 0) {
    minutes -= hours * 60;
  }
  const minutesStringUnpadded = minutes.toString();
  const minutesString = minutesStringUnpadded.padStart(2, "0");

  // The first character.
  const minute1String = minutesString[0] ?? "0";
  const minute1 = tonumber(minute1String);
  if (minute1 === undefined) {
    error("Failed to parse the first minute of the timer.");
  }

  // The second character.
  const minute2String = minutesString[1] ?? "0";
  const minute2 = tonumber(minute2String);
  if (minute2 === undefined) {
    error("Failed to parse the second minute of the timer.");
  }

  // Calculate the seconds digits.
  const seconds = math.floor(totalSeconds % 60);
  const secondsStringUnpadded = seconds.toString();
  const secondsString = secondsStringUnpadded.padStart(2, "0");

  // The first character.
  const second1String = secondsString[0] ?? "0";
  const second1 = tonumber(second1String);
  if (second1 === undefined) {
    error("Failed to parse the first second of the timer.");
  }

  // The second character.
  const second2String = secondsString[1] ?? "0";
  const second2 = tonumber(second2String);
  if (second2 === undefined) {
    error("Failed to parse the second second of the timer.");
  }

  // Calculate the tenths digit.
  const rawSeconds = totalSeconds % 60; // 0.000 to 59.999
  const decimals = rawSeconds - math.floor(rawSeconds);
  const tenths = math.floor(decimals * 10);

  return { hours, minute1, minute2, second1, second2, tenths };
}
