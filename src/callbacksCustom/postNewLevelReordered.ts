import { game, log, ModCallbackCustom } from "isaacscript-common";
import { racePostNewLevel } from "../features/race/callbacks/postNewLevel";
import { mod } from "../mod";

export function postNewLevelReorderedInit(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED, main);
}

function main() {
  const gameFrameCount = game.GetFrameCount();
  const level = game.GetLevel();
  const stage = level.GetStage();
  const stageType = level.GetStageType();
  const renderFrameCount = Isaac.GetFrameCount();

  log(
    `POST_NEW_LEVEL_REORDERED - Stage: ${stage}.${stageType} - Game frame: ${gameFrameCount} - Render frame: ${renderFrameCount}`,
  );

  // Major
  racePostNewLevel();
}
