import {
  CollectibleType,
  ItemType,
  LevelStage,
  RoomType,
  TrapdoorVariant,
} from "isaac-typescript-definitions";
import {
  isRoomInsideGrid,
  onRepentanceStage,
  PickingUpItem,
  spawnTrapdoorWithVariant,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import g from "../../../../globals";
import { season3HasDogmaGoal } from "../v";

/** One tile away from the bottom door in a 1x1 room. */
export const INVERTED_TRAPDOOR_GRID_INDEX = 97;

export function season3PreItemPickup(
  _player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  spawnTrapdoorOnTakePhoto(pickingUpItem);
}

function spawnTrapdoorOnTakePhoto(pickingUpItem: PickingUpItem) {
  if (pickingUpItem.itemType !== ItemType.PASSIVE) {
    return;
  }

  if (
    pickingUpItem.subType !== CollectibleType.POLAROID &&
    pickingUpItem.subType !== CollectibleType.NEGATIVE
  ) {
    return;
  }

  if (!season3HasDogmaGoal()) {
    return;
  }

  const stage = g.l.GetStage();
  if (stage !== LevelStage.DEPTHS_2 || onRepentanceStage()) {
    return;
  }

  const roomType = g.r.GetType();
  if (roomType !== RoomType.BOSS || !isRoomInsideGrid()) {
    return;
  }

  spawnTrapdoorWithVariant(
    TrapdoorVariant.NORMAL,
    INVERTED_TRAPDOOR_GRID_INDEX,
  );
}
