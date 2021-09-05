import {
  getEffectiveStage,
  getOpenTrinketSlot,
  getPlayers,
  isKeeper,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { isSelfDamage } from "../../../util";

const FREE_TRINKET_TYPE = TrinketType.TRINKET_YOUR_SOUL;

const EXCLUDED_CHARACTERS = new Set<PlayerType>([
  // The Lost and Tainted Lost get free devil deals, so they do not need the trinket
  PlayerType.PLAYER_THELOST, // 10
  PlayerType.PLAYER_THELOST_B, // 31
  // If Tainted Soul is given a trinket, it will just be applied to Tainted Forgotten
  // (even if we ignore Tainted Soul, the feature will still apply to Tainted Forgotten normally)
  PlayerType.PLAYER_THESOUL_B, // 40
]);

const v = {
  run: {
    tookDamage: false,
    granted: false,
  },
};

export function init(): void {
  saveDataManager("freeDevilItem", v, featureEnabled);
}

function featureEnabled() {
  return config.freeDevilItem;
}

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
  if (player !== undefined && !isSelfDamage(damageFlags)) {
    v.run.tookDamage = true;
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
  const gameFrameCount = g.g.GetFrameCount();
  const roomType = g.r.GetType();
  const effectiveStage = getEffectiveStage();

  if (
    v.run.granted ||
    v.run.tookDamage ||
    roomType !== RoomType.ROOM_DEVIL ||
    effectiveStage > 2 ||
    // We might be travelling to a Devil Room for run-initialization-related tasks
    gameFrameCount === 0
  ) {
    return;
  }

  // We have arrived at the first Devil Room and no player has taken any damage
  // Award all players with a trinket prize
  v.run.granted = true;

  for (const player of getPlayers()) {
    const playerType = player.GetPlayerType();

    if (!EXCLUDED_CHARACTERS.has(playerType)) {
      giveTrinket(player);
    }
  }
}

function giveTrinket(player: EntityPlayer) {
  const roomSeed = g.r.GetSpawnSeed();

  player.AnimateHappy();

  if (isKeeper(player)) {
    // In the special case of Keeper or Tainted Keeper, we award 15 cents instead of a trinket
    player.AddCoins(15);
    return;
  }

  const openSlot = getOpenTrinketSlot(player);
  if (openSlot === undefined) {
    // If we do not have an available trinket slot, spawn the trinket on the ground
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TRINKET,
      player.Position,
      Vector.Zero,
      undefined,
      FREE_TRINKET_TYPE,
      roomSeed,
    );
  } else {
    // By default, put it directly in our inventory
    player.AddTrinket(FREE_TRINKET_TYPE);
  }
}
