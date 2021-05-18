import g from "../globals";
import GlobalsRunLevel from "../types/GlobalsRunLevel";

export function main(): void {
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  Isaac.DebugString(`MC_POST_NEW_LEVEL - ${stage}.${stageType}`);

  // Make sure the callbacks run in the right order
  // (naturally, PostNewLevel gets called before the PostGameStarted callbacks)
  if (gameFrameCount === 0) {
    return;
  }

  newLevel();
}

export function newLevel(): void {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  Isaac.DebugString(`MC_POST_NEW_LEVEL2 - ${stage}.${stageType}`);

  // Set the new floor
  g.run.level.stage = stage;
  g.run.level.stageType = stageType;

  // Clear variables that track things per level
  g.run.level = new GlobalsRunLevel(stage, stageType);
}
