import {
  CollectibleType,
  GridEntityType,
  ItemType,
  TeleporterState,
} from "isaac-typescript-definitions";
import { getGridEntities, PickingUpItem } from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";

export function season3PreItemPickup(
  _player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
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

  const teleporters = getGridEntities(GridEntityType.TELEPORTER);
  const teleporter = teleporters[0];
  if (teleporter === undefined) {
    return;
  }

  teleporter.State = TeleporterState.ACTIVATED;
}
