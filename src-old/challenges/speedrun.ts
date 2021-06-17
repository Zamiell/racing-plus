/*
// Don't move to the first character of the speedrun if we die
export function postGameEnd(gameOver: boolean): void {
  if (!gameOver) {
    return;
  }

  if (!inSpeedrun()) {
    return;
  }

  g.speedrun.fastReset = true;
  Isaac.DebugString("Game over detected.");
}

export function getAverageTimePerCharacter(): string {
  let totalMilliseconds = 0;
  for (const milliseconds of g.speedrun.characterRunTimes) {
    totalMilliseconds += milliseconds;
  }
  const averageMilliseconds =
    totalMilliseconds / g.speedrun.characterRunTimes.length;
  const averageSeconds = averageMilliseconds / 1000;

  // Ignore the hours
  const [
    hours,
    minute1,
    minute2,
    second1,
    second2,
  ] = timer.convertSecondsToStrings(averageSeconds);

  if (hours > 0) {
    return "too long";
  }

  return `${minute1}${minute2}.${second1}${second2}`;
}
*/
