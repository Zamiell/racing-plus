import g from "../../../globals";
import {
  enteredRoomViaTeleport,
  getOpenTrinketSlot,
  getPlayers,
  hasFlag,
} from "../../../misc";

// ModCallbacks.MC_ENTITY_TAKE_DMG (11)
export function entityTakeDmg(
  tookDamage: Entity,
  _damageAmount: float,
  damageFlags: DamageFlag,
  _damageSource: EntityRef,
  _damageCountdownFrames: int,
): void {
  if (!g.config.freeDevilItem) {
    return;
  }

  const player = tookDamage.ToPlayer();
  if (
    player !== null &&
    // Exclude self-damage from e.g. Curse Room spikes
    !hasFlag(damageFlags, DamageFlag.DAMAGE_NO_PENALTIES) &&
    // Exclude self-damage from e.g. Razor
    !hasFlag(damageFlags, DamageFlag.DAMAGE_RED_HEARTS)
  ) {
    g.run.freeDevilItem.takenDamage.set(player.ControllerIndex, true);
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (18)
export function postNewRoom(): void {
  if (!g.config.freeDevilItem) {
    return;
  }

  const stage = g.l.GetStage();
  const roomType = g.r.GetType();

  // If we have made it to our first Devil Room without taking any damage,
  // reward the player with the trinket prize
  if (
    !g.run.freeDevilItem.granted &&
    stage === 2 &&
    roomType === RoomType.ROOM_DEVIL &&
    !enteredRoomViaTeleport()
  ) {
    g.run.freeDevilItem.granted = true;

    for (const player of getPlayers()) {
      const takenDamage = g.run.freeDevilItem.takenDamage.get(
        player.ControllerIndex,
      );
      if (takenDamage === undefined) {
        giveTrinket(player);
      }
    }
  }
}

function giveTrinket(player: EntityPlayer) {
  const character = g.p.GetPlayerType();

  g.p.AnimateHappy();

  const trinketType =
    character === PlayerType.PLAYER_KEEPER ||
    character === PlayerType.PLAYER_KEEPER_B
      ? TrinketType.TRINKET_STORE_CREDIT
      : TrinketType.TRINKET_YOUR_SOUL;

  if (getOpenTrinketSlot(player) !== null) {
    // By default, put it directly in our inventory
    g.p.AddTrinket(trinketType);
  } else {
    // If we do not have an available trinket slot, then spawn the trinket on the ground
    Isaac.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TRINKET,
      trinketType,
      g.p.Position,
      Vector.Zero,
      null,
    );
  }
}
