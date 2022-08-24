import { game, log, ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import * as solCustom from "../features/items/solCustom";
import * as seededTeleports from "../features/mandatory/seededTeleports";
import * as streakText from "../features/mandatory/streakText";
import * as tempMoreOptions from "../features/mandatory/tempMoreOptions";
import * as fastKrampus from "../features/optional/bosses/fastKrampus";
import * as openHushDoor from "../features/optional/bosses/openHushDoor";
import { extraStartingItemsPostNewLevel } from "../features/optional/gameplay/extraStartingItems/callbacks/postNewLevel";
import * as fastVanishingTwin from "../features/optional/quality/fastVanishingTwin";
import { showDreamCatcherItemPostNewLevel } from "../features/optional/quality/showDreamCatcherItem/callbacks/postNewLevel";
import * as silenceMomDad from "../features/optional/sound/silenceMomDad";
import { racePostNewLevel } from "../features/race/callbacks/postNewLevel";
import g from "../globals";

export function init(mod: ModUpgraded): void {
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

  // Boss
  fastKrampus.postNewLevel();

  // Gameplay
  extraStartingItemsPostNewLevel();

  // QoL
  openHushDoor.postNewLevel();
  showDreamCatcherItemPostNewLevel(); // 566
  fastVanishingTwin.postNewLevel(); // 697

  // Sounds
  silenceMomDad.postNewLevel();

  // Items
  solCustom.postNewLevel();
}
