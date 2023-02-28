import {
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import * as roll from "../features/optional/hotkeys/roll";
import { fastTravelEntityTakeDmgPlayer } from "../features/optional/major/fastTravel/callbacks/entityTakeDmg";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.ENTITY_TAKE_DMG,
    entityTakeDmgPlayer,
    EntityType.PLAYER, // 1
  );
}

// EntityType.PLAYER (1)
function entityTakeDmgPlayer(
  entity: Entity,
  _amount: float,
  damageFlags: BitFlags<DamageFlag>,
  _source: EntityRef,
  _countdownFrames: int,
): boolean | undefined {
  const player = entity.ToPlayer();
  if (player === undefined) {
    return undefined;
  }

  // Major
  fastTravelEntityTakeDmgPlayer(damageFlags);

  // Other
  roll.entityTakeDmgPlayer(player);

  return undefined;
}
