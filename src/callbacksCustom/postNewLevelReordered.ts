import { game, log, ModCallbackCustom } from "isaacscript-common";
import * as solCustom from "../features/items/solCustom";
import * as seededTeleports from "../features/mandatory/seededTeleports";
import * as streakText from "../features/mandatory/streakText";
import * as tempMoreOptions from "../features/mandatory/tempMoreOptions";
import * as openHushDoor from "../features/optional/bosses/openHushDoor";
import { extraStartingItemsPostNewLevel } from "../features/optional/gameplay/extraStartingItems/callbacks/postNewLevel";
import * as fastVanishingTwin from "../features/optional/quality/fastVanishingTwin";
import { showDreamCatcherItemPostNewLevel } from "../features/optional/quality/showDreamCatcherItem/callbacks/postNewLevel";
import { racePostNewLevel } from "../features/race/callbacks/postNewLevel";
import { g } from "../globals";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED, main);
}

function main() {
  const gameFrameCount = game.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
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

  // Gameplay
  extraStartingItemsPostNewLevel();

  // QoL
  openHushDoor.postNewLevel();
  showDreamCatcherItemPostNewLevel(); // 566
  fastVanishingTwin.postNewLevel(); // 697

  // Items
  solCustom.postNewLevel();
}
