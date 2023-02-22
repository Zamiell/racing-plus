import {
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import * as doubleAngelNerf from "../features/mandatory/doubleAngelNerf";
import * as removeArmor from "../features/optional/bosses/removeArmor";
import { fastTravelEntityTakeDmgPlayer } from "../features/optional/major/fastTravel/callbacks/entityTakeDmg";
import * as roll from "../features/optional/other/roll";
import * as bloodyLustChargeBar from "../features/optional/quality/bloodyLustChargeBar/bloodyLustChargeBar";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.ENTITY_TAKE_DMG, main);

  mod.AddCallback(
    ModCallback.ENTITY_TAKE_DMG,
    entityTakeDmgPlayer,
    EntityType.PLAYER, // 1
  );

  mod.AddCallback(
    ModCallback.ENTITY_TAKE_DMG,
    uriel,
    EntityType.URIEL, // 271
  );

  mod.AddCallback(
    ModCallback.ENTITY_TAKE_DMG,
    gabriel,
    EntityType.GABRIEL, // 272
  );
}

function main(
  entity: Entity,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  return removeArmor.entityTakeDmg(
    entity,
    amount,
    damageFlags,
    source,
    countdownFrames,
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

  // QoL
  bloodyLustChargeBar.entityTakeDmgPlayer(player);

  // Other
  roll.entityTakeDmgPlayer(player);

  return undefined;
}

// EntityType.URIEL (271)
function uriel(
  _entity: Entity,
  _amount: float,
  _damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  _countdownFrames: int,
): boolean | undefined {
  return doubleAngelNerf.entityTakeDmgUriel(source);
}

// EntityType.GABRIEL (272)
function gabriel(
  _entity: Entity,
  _amount: float,
  _damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  _countdownFrames: int,
): boolean | undefined {
  return doubleAngelNerf.entityTakeDmgGabriel(source);
}
