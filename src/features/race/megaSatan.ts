// Automatically open the Mega Satan door on races with a Mega Satan goal.

import {
  DoorSlot,
  LevelStage,
  SoundEffect,
} from "isaac-typescript-definitions";
import { game, onStage, sfxManager } from "isaacscript-common";
import { RaceGoal } from "../../enums/RaceGoal";
import { RaceStatus } from "../../enums/RaceStatus";
import { RacerStatus } from "../../enums/RacerStatus";
import { g } from "../../globals";

// ModCallback.POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  const room = game.GetRoom();
  const player = Isaac.GetPlayer();

  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING ||
    g.race.goal !== RaceGoal.MEGA_SATAN ||
    !onStage(LevelStage.DARK_ROOM_CHEST)
  ) {
    return;
  }

  const topDoor = room.GetDoor(DoorSlot.UP_0);
  if (topDoor !== undefined) {
    topDoor.TryUnlock(player, true);
    sfxManager.Stop(SoundEffect.UNLOCK);
  }
}
