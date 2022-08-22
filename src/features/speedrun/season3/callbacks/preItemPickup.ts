import {
  CollectibleType,
  ItemType,
  TeleporterState,
} from "isaac-typescript-definitions";
import { getTeleporters, PickingUpItem } from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import v from "../v";

export function season3PreItemPickup(
  _player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  if (v.room.depths2TeleporterSpawned) {
    return;
  }

  if (pickingUpItem.itemType !== ItemType.PASSIVE) {
    return;
  }

  if (
    pickingUpItem.subType !== CollectibleType.POLAROID &&
    pickingUpItem.subType !== CollectibleType.NEGATIVE
  ) {
    return;
  }

  const teleporters = getTeleporters();
  const teleporter = teleporters[0];
  if (teleporter === undefined) {
    return;
  }

  teleporter.State = TeleporterState.NORMAL;
}
