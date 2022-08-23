import {
  EffectVariant,
  GameStateFlag,
  LevelStage,
  PickupVariant,
  RoomType,
} from "isaac-typescript-definitions";
import {
  game,
  isRoomInsideGrid,
  onRepentanceStage,
  removeAllEffects,
  removeAllTrapdoors,
  spawnPickup,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import g from "../../../../globals";
import { inClearedMomBossRoom } from "../../../../utilsGlobals";
import { season3HasHushGoal } from "../v";

export function season3PostRoomClearChanged(roomClear: boolean): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  if (!roomClear) {
    return;
  }

  checkHushCleared();
  checkRepentanceMomCleared();
}

/**
 * Fast clear will be triggered after clearing Hush, so to avoid conflicting with that feature, we
 * spawn the Checkpoint in the `POST_ROOM_CLEAR_CHANGED` callback, which only triggers on the
 * subsequent frame.
 */
function checkHushCleared() {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();

  if (
    stage === LevelStage.BLUE_WOMB &&
    roomType === RoomType.BOSS &&
    isRoomInsideGrid() &&
    season3HasHushGoal()
  ) {
    removeAllTrapdoors();
    removeAllEffects(EffectVariant.HEAVEN_LIGHT_DOOR);

    // The Big Chest will be replaced by a Checkpoint or Trophy on the subsequent frame.
    const centerPos = g.r.GetCenterPos();
    spawnPickup(PickupVariant.BIG_CHEST, 0, centerPos);
  }
}

/**
 * By setting the Mausoleum Heart killed flag after clearing Mom, the lights will fade and the
 * trapdoor will automatically take us to Corpse without having to specify any explicit logic.
 */
function checkRepentanceMomCleared() {
  if (inClearedMomBossRoom() && onRepentanceStage()) {
    game.SetStateFlag(GameStateFlag.MAUSOLEUM_HEART_KILLED, true);
  }
}
