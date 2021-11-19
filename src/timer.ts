import {
  getHUDOffsetVector,
  isBethany,
  isJacobOrEsau,
} from "isaacscript-common";
import g from "./globals";
import { initSprite } from "./sprite";
import { TimerType } from "./types/TimerType";

interface Sprites {
  clock: Sprite;
  colons: Sprite[]; // colon between minutes & seconds, colon between hours & minutes
  digits: Sprite[]; // minute1, minute2, second1, second2, hour
  digitMini: Sprite;
}

const DIGIT_LENGTH = 7.25;
const RACE_TIMER_POSITION = Vector(19, 198); // Directly below the stat HUD

const spriteCollectionMap = new Map<int, Sprites>();

export function display(
  timerType: TimerType,
  seconds: int,
  startingX?: int,
  startingY?: int,
): void {
  if (seconds < 0) {
    return;
  }

  if (g.seeds.HasSeedEffect(SeedEffect.SEED_NO_HUD)) {
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

  if (player.HasCollectible(CollectibleType.COLLECTIBLE_DUALITY)) {
    startingY -= 10;
  }

  const hourAdjustment = 2;
  let hourAdjustment2 = 0;

  let sprites = spriteCollectionMap.get(timerType);
  if (sprites === undefined) {
    sprites = getNewTimerSprites();
    spriteCollectionMap.set(timerType, sprites);
  }

  const [hours, minute1, minute2, second1, second2, tenths] =
    convertSecondsToTimerValues(seconds);

  const positionClock = Vector(startingX + 34, startingY + 45);
  sprites.clock.RenderLayer(0, positionClock);

  if (hours > 0) {
    // The format is "#.##.##" (instead of "##.##", which is the default)
    hourAdjustment2 = 2;
    startingX += DIGIT_LENGTH + hourAdjustment;

    const positionHours = Vector(
      startingX - DIGIT_LENGTH - hourAdjustment,
      startingY,
    );
    const hoursDigitSprite = sprites.digits[4];
    hoursDigitSprite.SetFrame("Default", hours);
    hoursDigitSprite.RenderLayer(0, positionHours);

    const positionColon = Vector(startingX - DIGIT_LENGTH + 7, startingY + 19);
    const colonHoursSprite = sprites.colons[1];
    colonHoursSprite.RenderLayer(0, positionColon);
  }

  const positionMinute1 = Vector(startingX, startingY);
  const minute1Sprite = sprites.digits[0];
  minute1Sprite.SetFrame("Default", minute1);
  minute1Sprite.RenderLayer(0, positionMinute1);

  const positionMinute2 = Vector(startingX + DIGIT_LENGTH, startingY);
  const minute2Sprite = sprites.digits[1];
  minute2Sprite.SetFrame("Default", minute2);
  minute2Sprite.RenderLayer(0, positionMinute2);

  const positionColon1 = Vector(startingX + DIGIT_LENGTH + 10, startingY + 19);
  const colonMinutesSprite = sprites.colons[0];
  colonMinutesSprite.RenderLayer(0, positionColon1);

  const positionSecond1 = Vector(startingX + DIGIT_LENGTH + 11, startingY);
  const second1Sprite = sprites.digits[2];
  second1Sprite.SetFrame("Default", second1);
  second1Sprite.RenderLayer(0, positionSecond1);

  const positionSecond2 = Vector(
    startingX + DIGIT_LENGTH + 11 + DIGIT_LENGTH + 1 - hourAdjustment2,
    startingY,
  );
  const second2Sprite = sprites.digits[3];
  second2Sprite.SetFrame("Default", second2);
  second2Sprite.RenderLayer(0, positionSecond2);

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
  sprites.digitMini.RenderLayer(0, positionTenths);
}

function getNewTimerSprites() {
  const sprites: Sprites = {
    clock: initSprite("gfx/timer/clock.anm2"),
    colons: [],
    digits: [],
    digitMini: initSprite("gfx/timer/timer_mini.anm2"),
  };

  for (let i = 0; i < 2; i++) {
    const colonSprite = initSprite("gfx/timer/colon.anm2");
    sprites.colons.push(colonSprite);
  }

  for (let i = 0; i < 5; i++) {
    const digitSprite = initSprite("gfx/timer/timer.anm2");
    sprites.digits.push(digitSprite);
  }

  return sprites;
}

export function convertSecondsToTimerValues(
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
  const minute1 = tonumber(minute1String);
  if (minute1 === undefined) {
    error("Failed to parse the first minute of the timer.");
  }

  // The second character
  const minute2String = string.sub(minutesString, 2, 2);
  const minute2 = tonumber(minute2String);
  if (minute2 === undefined) {
    error("Failed to parse the second minute of the timer.");
  }

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
  const second1 = tonumber(second1String);
  if (second1 === undefined) {
    error("Failed to parse the first second of the timer.");
  }

  // The second character
  const second2String = string.sub(secondsString, 2, 2);
  const second2 = tonumber(second2String);
  if (second2 === undefined) {
    error("Failed to parse the second second of the timer.");
  }

  // Calculate the tenths digit
  const rawSeconds = totalSeconds % 60; // 0.000 to 59.999
  const decimals = rawSeconds - math.floor(rawSeconds);
  const tenths = math.floor(decimals * 10);

  return [hours, minute1, minute2, second1, second2, tenths];
}
