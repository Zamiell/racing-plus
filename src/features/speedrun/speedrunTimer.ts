import { ISAAC_FRAMES_PER_SECOND } from "../../constants";
import g from "../../globals";
import * as timer from "../../timer";
import TimerType from "../../types/TimerType";
import v from "./v";

const MAX_ELAPSED_FRAME_DIGITS = 6;
const LIVESPLIT_VARIABLE_PREFIX = "Krakenos";
const LIVESPLIT_VARIABLE_SUFFIX = "Polish";

// We write the elapsed frames to a global variable so that LiveSplit can reach into the game's
// memory and find out what it is
declare let SpeedrunTimerString: string;
const zeros = "".padStart(MAX_ELAPSED_FRAME_DIGITS, "0");
SpeedrunTimerString =
  LIVESPLIT_VARIABLE_PREFIX + zeros + LIVESPLIT_VARIABLE_SUFFIX;
declare let SpeedrunTimerNumber: int;
SpeedrunTimerNumber = 0;

export function postRender(): void {
  checkDisplay();
}

function checkDisplay() {
  const isaacFrameCount = Isaac.GetFrameCount();

  if (g.seeds.HasSeedEffect(SeedEffect.SEED_NO_HUD)) {
    return;
  }

  // Find out how much time has passed since the speedrun started
  let elapsedFrames: int;
  if (v.run.finished && v.run.finishedFrames !== null) {
    elapsedFrames = v.run.finishedFrames;
  } else if (v.persistent.startedFrame === null) {
    elapsedFrames = 0;
  } else {
    elapsedFrames = isaacFrameCount - v.persistent.startedFrame;
  }
  const seconds = elapsedFrames / ISAAC_FRAMES_PER_SECOND;

  timer.display(TimerType.RaceOrSpeedrun, seconds);

  const paddedFrames = elapsedFrames.toString().padStart(6, "0");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  SpeedrunTimerString =
    LIVESPLIT_VARIABLE_PREFIX + paddedFrames + LIVESPLIT_VARIABLE_SUFFIX;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  SpeedrunTimerNumber = elapsedFrames;
}
