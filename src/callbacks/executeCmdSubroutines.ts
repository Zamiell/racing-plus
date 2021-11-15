import { log, teleport } from "isaacscript-common";
import * as debugPowers from "../features/mandatory/debugPowers";
import { setDevilAngelDebugRoom } from "../features/optional/major/betterDevilAngelRooms/v";
import { findFreePosition } from "../utilGlobals";

export function angel(params: string): void {
  const player = Isaac.GetPlayer();
  const hasEucharist = player.HasCollectible(
    CollectibleType.COLLECTIBLE_EUCHARIST,
  );
  if (!hasEucharist) {
    player.AddCollectible(CollectibleType.COLLECTIBLE_EUCHARIST, 0, false);
  }
  player.UseCard(Card.CARD_JOKER);
  if (!hasEucharist) {
    player.RemoveCollectible(CollectibleType.COLLECTIBLE_EUCHARIST);
  }

  if (params !== "") {
    const num = tonumber(params);
    if (num === undefined) {
      Isaac.ConsoleOutput("That is an invalid Angel Room number.");
      return;
    }

    setDevilAngelDebugRoom(num);
  }
}

export function blackMarket(): void {
  teleport(GridRooms.ROOM_BLACK_MARKET_IDX);
}

export function chaosCardTears(): void {
  debugPowers.toggleChaosCard();
}

export function crawlspace(): void {
  const player = Isaac.GetPlayer();
  if (player !== undefined) {
    const position = findFreePosition(player.Position);
    Isaac.GridSpawn(GridEntityType.GRID_STAIRS, 0, position, true);
  }
}

export function commands(
  functionMap: Map<string, (params: string) => void>,
): void {
  // Compile a list of the commands and sort them alphabetically
  const commandNames = [...functionMap.keys()];
  table.sort(commandNames);

  Isaac.ConsoleOutput("List of Racing+ commands:");
  const text = commandNames.join(" ");
  Isaac.ConsoleOutput(text);
}

export function devil(params: string): void {
  const player = Isaac.GetPlayer();
  if (player !== undefined) {
    player.UseCard(Card.CARD_JOKER);
  }

  if (params !== "") {
    const num = tonumber(params);
    if (num === undefined) {
      Isaac.ConsoleOutput("That is an invalid Devil Room number.");
      return;
    }

    setDevilAngelDebugRoom(num);
  }
}

export function goldenBomb(): void {
  const player = Isaac.GetPlayer();
  player.AddGoldenBomb();
}

export function goldenKey(): void {
  const player = Isaac.GetPlayer();
  player.AddGoldenKey();
}

export function IAMERROR(): void {
  teleport(GridRooms.ROOM_ERROR_IDX);
}

export function list(includeAll: boolean): void {
  log("Entities in the room:");
  const roomEntities = Isaac.GetRoomEntities();
  for (let i = 0; i < roomEntities.length; i++) {
    const entity = roomEntities[i];

    // Exclude background effects
    if (
      !includeAll &&
      entity.Type === EntityType.ENTITY_EFFECT &&
      (entity.Variant === EffectVariant.TINY_BUG || // 21
        entity.Variant === EffectVariant.TINY_FLY || // 33
        entity.Variant === EffectVariant.WATER_DROPLET || // 41
        entity.Variant === EffectVariant.WALL_BUG || // 68
        entity.Variant === EffectVariant.FALLING_EMBER || // 87
        entity.Variant === EffectVariant.LIGHT) // 121
    ) {
      continue;
    }

    let debugString = `${i + 1} - ${entity.Type}.${entity.Variant}.${
      entity.SubType
    }`;

    const bomb = entity.ToBomb();
    if (bomb !== undefined) {
      debugString += " (bomb)";
    }

    const effect = entity.ToEffect();
    if (effect !== undefined) {
      debugString += `.${effect.State} (effect)`;
    }

    const familiar = entity.ToFamiliar();
    if (familiar !== undefined) {
      debugString += `.${familiar.State} (familiar)`;
    }

    const knife = entity.ToKnife();
    if (knife !== undefined) {
      debugString += " (knife)";
    }

    const laser = entity.ToLaser();
    if (laser !== undefined) {
      debugString += " (laser)";
    }

    const npc = entity.ToNPC();
    if (npc !== undefined) {
      debugString += `.${npc.State} (NPC)`;
    }

    const pickup = entity.ToPickup();
    if (pickup !== undefined) {
      debugString += `.${pickup.State} (pickup)`;
    }

    const player = entity.ToPlayer();
    if (player !== undefined) {
      debugString += " (player)";
    }

    const projectile = entity.ToProjectile();
    if (projectile !== undefined) {
      debugString += " (projectile)";
    }

    const tear = entity.ToTear();
    if (tear !== undefined) {
      debugString += " (tear)";
    }

    debugString += ` (InitSeed: ${entity.InitSeed})`;
    debugString += ` (Position: ${entity.Position.X}, ${entity.Position.Y})`;
    log(debugString);
  }
  Isaac.ConsoleOutput('Logged the entities in the room to the "log.txt" file.');
}

export function movePlayer(params: string, direction: Direction): void {
  const player = Isaac.GetPlayer();

  let amount = 0.5;
  if (params !== "") {
    const num = validateNumber(params);
    if (num === undefined) {
      return;
    }
    amount = num;
  }

  const modification = getModificationVector(amount, direction);
  player.Position = player.Position.add(modification);
}

function getModificationVector(amount: float, direction: Direction) {
  switch (direction) {
    // 0
    case Direction.LEFT: {
      return Vector(amount * -1, 0);
    }

    // 1
    case Direction.UP: {
      return Vector(0, amount * -1);
    }

    // 2
    case Direction.RIGHT: {
      return Vector(amount, 0);
    }

    // 3
    case Direction.DOWN: {
      return Vector(0, amount);
    }

    default: {
      error("Invalid direction.");
      return Vector.Zero;
    }
  }
}

export function trapdoor(): void {
  const player = Isaac.GetPlayer();
  if (player !== undefined) {
    const position = findFreePosition(player.Position);
    Isaac.GridSpawn(GridEntityType.GRID_TRAPDOOR, 0, position, true);
  }
}

export function validateNumber(params: string): number | undefined {
  const num = tonumber(params);
  if (num === undefined) {
    Isaac.ConsoleOutput("You must specify a number.");
  }

  return num;
}
