import g from "../globals";
import { teleport } from "../misc";

export function blackMarket(): void {
  teleport(GridRooms.ROOM_BLACK_MARKET_IDX);
}

export function chaosCardTears(): void {
  g.run.debugChaosCard = !g.run.debugChaosCard;
  const enabled = g.run.debugChaosCard ? "Enabled" : "Disabled";
  print(`${enabled} Chaos Card tears.`);
}

export function commands(
  functionMap: Map<string, (params: string) => void>,
): void {
  // Compile a list of the commands && sort them
  const commandNames: string[] = [];
  for (const [commandName] of functionMap) {
    commandNames.push(commandName);
  }
  table.sort(commandNames);

  print("List of Racing+ commands:");
  const text = commandNames.join(" ");
  print(text);
}

export function devil(): void {
  g.p.UseCard(Card.CARD_JOKER);
}

export function IAMERROR(): void {
  teleport(GridRooms.ROOM_ERROR_IDX);
}

export function validateNumber(params: string): number | undefined {
  const num = tonumber(params);
  if (num === undefined) {
    print("You must specify a number.");
  }
  return num;
}
