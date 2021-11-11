import { removeCollectibleFromItemTracker } from "isaacscript-common";
import g from "../../globals";
import { CollectibleTypeCustom } from "../../types/enums";
import { RaceFormat } from "./types/RaceFormat";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";

const REPLACED_ITEM = CollectibleType.COLLECTIBLE_MAGIC_8_BALL;
const REPLACEMENT_ITEM = CollectibleTypeCustom.COLLECTIBLE_MAGIC_8_BALL_SEEDED;

// CollectibleType.COLLECTIBLE_MAGIC_8_BALL (194)
export function postItemPickupMagic8Ball(player: EntityPlayer): void {
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.format === RaceFormat.SEEDED &&
    player.HasCollectible(REPLACED_ITEM)
  ) {
    player.RemoveCollectible(REPLACED_ITEM);
    removeCollectibleFromItemTracker(REPLACED_ITEM);
    player.AddCollectible(REPLACEMENT_ITEM);
  }
}
