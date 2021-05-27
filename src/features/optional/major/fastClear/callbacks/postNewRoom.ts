import g from "../../../../../globals";

export function main(): void {
  if (!g.fastClear) {
    return;
  }

  resetVariables();
}

// Reset fast-clear variables that track things per room
function resetVariables() {
  g.run.fastClear.buttonsAllPushed = false;
  g.run.fastClear.roomInitializing = false;
  // (this is set to true when the room frame count is -1 and set to false here,
  // where the frame count is 0)
}
