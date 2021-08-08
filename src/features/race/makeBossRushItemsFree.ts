import { anyPlayerIs, getRoomIndex } from "isaacscript-common";
import g from "../../globals";
import v from "./v";

export function postNewRoom(): void {
  if (!anyPlayerIs(PlayerType.PLAYER_KEEPER_B)) {
    return;
  }

  const roomIndex = getRoomIndex();

  if (
    !v.run.madeBossRushItemsFree &&
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "Boss Rush" &&
    roomIndex === GridRooms.ROOM_BOSSRUSH_IDX
  ) {
    v.run.madeBossRushItemsFree = true;
    makeBossRushItemsFree();
  }
}

function makeBossRushItemsFree() {
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );
  for (const collectible of collectibles) {
    const pickup = collectible.ToPickup();
    if (pickup !== null) {
      pickup.AutoUpdatePrice = false;
      pickup.Price = PickupPrice.PRICE_FREE;
    }
  }
}
