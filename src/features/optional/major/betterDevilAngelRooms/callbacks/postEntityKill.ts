import { FallenVariant } from "isaac-typescript-definitions";
import { asNumber } from "isaacscript-common";
import v from "../v";

export function betterDevilAngelRoomsPostEntityKillFallen(
  entity: Entity,
): void {
  if (entity.Variant === asNumber(FallenVariant.KRAMPUS)) {
    v.level.killedKrampusOnThisFloor = true;
  }
}
