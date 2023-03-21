import { GameStateFlag, RoomType } from "isaac-typescript-definitions";
import { findFreePosition, game, inRoomType } from "isaacscript-common";
import {
  doesTrophyExist,
  spawnTrophy,
} from "../../../classes/features/mandatory/misc/Trophy";
import { g } from "../../../globals";
import { config } from "../../../modConfigMenu";
import { inRaceToBossRush } from "../v";

export function racePostUpdate(): void {
  if (!config.ClientCommunication) {
    return;
  }

  spawnBossRushTrophy();
}

function spawnBossRushTrophy() {
  const room = game.GetRoom();
  const bossRushDone = game.GetStateFlag(GameStateFlag.BOSS_RUSH_DONE);

  if (
    !doesTrophyExist() &&
    inRaceToBossRush() &&
    !g.raceVars.finished &&
    inRoomType(RoomType.BOSS_RUSH) &&
    bossRushDone
  ) {
    const centerPos = room.GetCenterPos();
    const position = findFreePosition(centerPos); // Some Boss Rush layouts have pits.
    spawnTrophy(position);
  }
}
