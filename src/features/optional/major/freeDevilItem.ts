import g from "../../../globals";
import {
  enteredRoomViaTeleport,
  getOpenTrinketSlot,
  getPlayers,
  isSelfDamage,
} from "../../../misc";
import { getPlayerLuaTableIndex } from "../../../types/GlobalsRun";

// ModCallbacks.MC_ENTITY_TAKE_DMG (11)
export function entityTakeDmg(
  tookDamage: Entity,
  damageFlags: DamageFlag,
): void {
  if (!g.config.freeDevilItem) {
    return;
  }

  const player = tookDamage.ToPlayer();
  if (player !== null && !isSelfDamage(damageFlags)) {
    const index = getPlayerLuaTableIndex(player);
    g.run.freeDevilItem.tookDamage.set(index, true);
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
      const index = getPlayerLuaTableIndex(player);
      const takenDamage = g.run.freeDevilItem.tookDamage.get(index);
      if (!takenDamage) {
        giveTrinket(player);
      }
    }
  }
}

function giveTrinket(player: EntityPlayer) {
  const character = player.GetPlayerType();

  player.AnimateHappy();

  if (
    character === PlayerType.PLAYER_KEEPER ||
    character === PlayerType.PLAYER_KEEPER_B
  ) {
    // In the special case of Keeper or Tainted Keeper, we award 15 cents instead of a trinket
    player.AddCoins(15);
    return;
  }

  const trinketType = TrinketType.TRINKET_YOUR_SOUL;
  if (getOpenTrinketSlot(player) !== null) {
    // By default, put it directly in our inventory
    player.AddTrinket(trinketType);
  } else {
    // If we do not have an available trinket slot, then spawn the trinket on the ground
    Isaac.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TRINKET,
      trinketType,
      player.Position,
      Vector.Zero,
      null,
    );
  }
}
