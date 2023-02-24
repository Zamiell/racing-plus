import { game, log, ModCallbackCustom } from "isaacscript-common";
import * as seededTeleports from "../features/mandatory/seededTeleports";
import * as streakText from "../features/mandatory/streakText";
import * as tempMoreOptions from "../features/mandatory/tempMoreOptions";
import * as fastVanishingTwin from "../features/optional/quality/fastVanishingTwin";
import { showDreamCatcherItemPostNewLevel } from "../features/optional/quality/showDreamCatcherItem/callbacks/postNewLevel";
import { racePostNewLevel } from "../features/race/callbacks/postNewLevel";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED, main);
}

function main() {
  const gameFrameCount = game.GetFrameCount();
  const level = game.GetLevel();
  const stage = level.GetStage();
  const stageType = level.GetStageType();
  const renderFrameCount = Isaac.GetFrameCount();

  log(
    `MC_POST_NEW_LEVEL_REORDERED - Stage: ${stage}.${stageType} - Game frame: ${gameFrameCount} - Render frame: ${renderFrameCount}`,
  );

  // Mandatory
  streakText.postNewLevel();
  tempMoreOptions.postNewLevel();
  seededTeleports.postNewLevel();

  // Major
  racePostNewLevel();

  // QoL
  showDreamCatcherItemPostNewLevel(); // 566
  fastVanishingTwin.postNewLevel(); // 697
}
