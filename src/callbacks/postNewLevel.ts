import { log } from "isaacscript-common";
import * as seededTeleports from "../features/mandatory/seededTeleports";
import * as streakText from "../features/mandatory/streakText";
import * as tempMoreOptions from "../features/mandatory/tempMoreOptions";
import * as openHushDoor from "../features/optional/bosses/openHushDoor";
import showDreamCatcherItemPostNewLevel from "../features/optional/quality/showDreamCatcherItem/callbacks/postNewLevel";
import * as silenceMomDad from "../features/optional/sound/silenceMomDad";
import racePostNewLevel from "../features/race/callbacks/postNewLevel";
import g from "../globals";

export function main(): void {
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  log(
    `MC_POST_NEW_LEVEL - ${stage}.${stageType} (game frame ${gameFrameCount})`,
  );

  // Mandatory features
  streakText.postNewLevel();
  tempMoreOptions.postNewLevel();
  seededTeleports.postNewLevel();

  // Major features
  racePostNewLevel();

  // Quality of life
  openHushDoor.postNewLevel();
  showDreamCatcherItemPostNewLevel();

  // Sounds
  silenceMomDad.postNewLevel();
}
