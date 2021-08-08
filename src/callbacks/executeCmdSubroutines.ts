import * as debugPowers from "../features/mandatory/debugPowers";
import g from "../globals";
import { teleport } from "../utilGlobals";

export function blackMarket(): void {
  teleport(GridRooms.ROOM_BLACK_MARKET_IDX);
}

export function chaosCardTears(): void {
  debugPowers.toggleChaosCard();
}

export function crawlspace(): void {
  const player = Isaac.GetPlayer();
  if (player !== null) {
    const position = g.r.FindFreePickupSpawnPosition(player.Position, 0, true);
    Isaac.GridSpawn(GridEntityType.GRID_STAIRS, 0, position, true);
  }
}

export function commands(
  functionMap: Map<string, (params: string) => void>,
): void {
  // Compile a list of the commands and sort them alphabetically
  const commandNames = [...functionMap.keys()];
  table.sort(commandNames);

  print("List of Racing+ commands:");
  const text = commandNames.join(" ");
  print(text);
}

export function devil(): void {
  const player = Isaac.GetPlayer();
  if (player !== null) {
    player.UseCard(Card.CARD_JOKER);
  }
}

export function IAMERROR(): void {
  teleport(GridRooms.ROOM_ERROR_IDX);
}

export function trapdoor(): void {
  const player = Isaac.GetPlayer();
  if (player !== null) {
    const position = g.r.FindFreePickupSpawnPosition(player.Position, 0, true);
    Isaac.GridSpawn(GridEntityType.GRID_TRAPDOOR, 0, position, true);
  }
}

export function validateNumber(params: string): number | undefined {
  const num = tonumber(params);
  if (num === undefined) {
    print("You must specify a number.");
  }

  return num;
}
