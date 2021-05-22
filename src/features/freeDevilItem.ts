import g from "../globals";
import {
  enteredRoomViaTeleport,
  getOpenTrinketSlot,
  getPlayers,
} from "../misc";

// ModCallbacks.MC_ENTITY_TAKE_DMG (11)
export function entityTakeDmg(
  tookDamage: Entity,
  _damageAmount: float,
  _damageFlags: DamageFlag,
  _damageSource: EntityRef,
  _damageCountdownFrames: int,
): void {
  if (!g.config.freeDevilItem) {
    return;
  }

  const player = tookDamage.ToPlayer();
  if (player !== null) {
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
  g.p.AnimateHappy();

  if (getOpenTrinketSlot(player) !== null) {
    // By default, put it directly in our inventory
    g.p.AddTrinket(TrinketType.TRINKET_YOUR_SOUL);
  } else {
    // If we do not have an available trinket slot, then spawn the trinket on the ground
    Isaac.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TRINKET,
      TrinketType.TRINKET_YOUR_SOUL,
      g.p.Position,
      Vector.Zero,
      null,
    );
  }
}
