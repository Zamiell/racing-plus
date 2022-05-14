import { getRepentanceDoor } from "isaacscript-common";
import { RepentanceDoorState } from "../../../enums/RepentanceDoorState";
import { inSpeedrun } from "../speedrun";
import v from "../v";

export function speedrunPostUpdate(): void {
  if (!inSpeedrun()) {
    return;
  }

  checkStartTimer();
  checkRepentanceDoorState();
}

function checkStartTimer() {
  if (v.persistent.startedSpeedrunFrame !== null) {
    return;
  }

  const renderFrameCount = Isaac.GetFrameCount();

  // We want to start the timer on the first game frame, as opposed to when the screen is fading in.
  // Thus, we must check for this on every frame. This is to keep the timing consistent with
  // historical timing of speedruns.
  v.persistent.startedSpeedrunFrame = renderFrameCount;
  v.persistent.startedCharacterFrame = renderFrameCount;
}

function checkRepentanceDoorState() {
  const repentanceDoorState = getRepentanceDoorState();
  if (repentanceDoorState !== undefined) {
    v.level.repentanceDoorState = repentanceDoorState;
  }
}

function getRepentanceDoorState() {
  const repentanceDoor = getRepentanceDoor();
  if (repentanceDoor === undefined) {
    return undefined;
  }

  if (repentanceDoor.IsLocked()) {
    return RepentanceDoorState.INITIAL;
  }

  return RepentanceDoorState.UNLOCKED;
}
