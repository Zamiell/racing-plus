import {
  getOpenTrinketSlot,
  getPlayerIndex,
  getPlayers,
  isRepentanceStage,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { isSelfDamage } from "../../../util";
import { enteredRoomViaTeleport } from "../../../utilGlobals";

const EXCLUDED_CHARACTERS = [
  // The Lost and Tainted Lost get free devil deals, so they do not need the trinket
  PlayerType.PLAYER_THELOST, // 10
  PlayerType.PLAYER_THELOST_B, // 31
  // If Tainted Soul is given a trinket, it will just be applied to Tainted Forgotten
  // (even if we ignore Tainted Soul, the feature will still apply to Tainted Forgotten normally)
  PlayerType.PLAYER_THESOUL_B, // 40
];

// ModCallbacks.MC_ENTITY_TAKE_DMG (11)
export function entityTakeDmgPlayer(
  tookDamage: Entity,
  damageFlags: int,
): void {
  if (!config.freeDevilItem) {
    return;
  }

  checkForSelfDamage(tookDamage, damageFlags);
}

function checkForSelfDamage(tookDamage: Entity, damageFlags: int) {
  const player = tookDamage.ToPlayer();
  if (player !== null && !isSelfDamage(damageFlags)) {
    const index = getPlayerIndex(player);
    g.run.freeDevilItem.tookDamage.set(index, true);
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (18)
export function postNewRoom(): void {
  if (!config.freeDevilItem) {
    return;
  }

  checkGiveTrinket();
}

function checkGiveTrinket() {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();

  // If we have made it to our first Devil Room without taking any damage,
  // reward the player with the trinket prize
  if (
    !g.run.freeDevilItem.granted &&
    (stage === 2 || (stage === 1 && isRepentanceStage())) &&
    roomType === RoomType.ROOM_DEVIL &&
    !enteredRoomViaTeleport()
  ) {
    g.run.freeDevilItem.granted = true;

    for (const player of getPlayers()) {
      const index = getPlayerIndex(player);
      const takenDamage = g.run.freeDevilItem.tookDamage.get(index);
      const playerType = player.GetPlayerType();

      if (!takenDamage && !EXCLUDED_CHARACTERS.includes(playerType)) {
        giveTrinket(player);
      }
    }
  }
}

function giveTrinket(player: EntityPlayer) {
  const roomSeed = g.r.GetSpawnSeed();
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
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TRINKET,
      player.Position,
      Vector.Zero,
      null,
      trinketType,
      roomSeed,
    );
  }
}
