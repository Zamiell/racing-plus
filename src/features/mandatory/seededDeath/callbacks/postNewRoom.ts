import {
  disableAllInputs,
  getPlayerFromIndex,
  GRID_INDEX_CENTER_OF_1X1_ROOM,
  isJacobOrEsau,
  removeGridEntity,
} from "isaacscript-common";
import g from "../../../../globals";
import { SeededDeathState } from "../../../../types/SeededDeathState";
import { SEEDED_DEATH_DEBUFF_FRAMES } from "../constants";
import {
  applySeededGhostFade,
  logSeededDeathStateChange,
  shouldSeededDeathApply,
} from "../seededDeath";
import { debuffOn, setCheckpointCollision } from "../seededDeathDebuff";
import v from "../v";

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function seededDeathPostNewRoom(): void {
  if (!shouldSeededDeathApply()) {
    return;
  }

  // Handle seeded death states
  postNewRoomWaitingForNewRoom();
  postNewRoomGhostForm();
}

function postNewRoomWaitingForNewRoom() {
  if (v.run.state !== SeededDeathState.WAITING_FOR_NEW_ROOM) {
    return;
  }

  if (v.run.dyingPlayerIndex === null) {
    return;
  }

  const player = getPlayerFromIndex(v.run.dyingPlayerIndex);
  if (player === undefined) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();

  v.run.state = SeededDeathState.FETAL_POSITION;
  v.run.debuffEndFrame = isaacFrameCount + SEEDED_DEATH_DEBUFF_FRAMES;
  logSeededDeathStateChange();

  disableAllInputs();
  applySeededGhostFade(player, true);

  // Play the animation where Isaac lies in the fetal position
  player.PlayExtraAnimation("AppearVanilla");
  debuffOn(player);
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== undefined) {
      twin.PlayExtraAnimation("AppearVanilla");
      debuffOn(twin);
    }
  }
}

function postNewRoomGhostForm() {
  if (v.run.state !== SeededDeathState.GHOST_FORM) {
    return;
  }

  removeSpikesInSacrificeRoom();
  setCheckpointCollision(false);
}

function removeSpikesInSacrificeRoom() {
  // Prevent people from abusing the death mechanic to use a Sacrifice Room
  const roomType = g.r.GetType();
  const player = Isaac.GetPlayer();

  if (roomType !== RoomType.ROOM_SACRIFICE) {
    return;
  }

  const spikes = g.r.GetGridEntity(GRID_INDEX_CENTER_OF_1X1_ROOM);
  if (spikes !== undefined) {
    removeGridEntity(spikes);
  }

  player.AnimateSad();
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== undefined) {
      twin.AnimateSad();
    }
  }
}
