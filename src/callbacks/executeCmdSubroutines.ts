import {
  getEntities,
  getEntityID,
  getRoomGridIndexesForType,
  log,
  logRoom,
  printConsole,
  spawnGridEntityWithVariant,
  teleport,
} from "isaacscript-common";
import * as debugPowers from "../features/mandatory/debugPowers";
import { setDevilAngelDebugRoom } from "../features/optional/major/betterDevilAngelRooms/v";
import g from "../globals";
import { restart } from "../utils";

const IGNORE_EFFECT_VARIANTS: ReadonlySet<EffectVariant> = new Set([
  EffectVariant.BLOOD_EXPLOSION, // 2
  EffectVariant.BLOOD_PARTICLE, // 5
  EffectVariant.TINY_BUG, // 21
  EffectVariant.TINY_FLY, // 33
  EffectVariant.WATER_DROPLET, // 41
  EffectVariant.WALL_BUG, // 68
  EffectVariant.FALLING_EMBER, // 87
  EffectVariant.LIGHT, // 121
  EffectVariant.TADPOLE, // 158
]);

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
      printConsole("That is an invalid Angel Room number.");
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
  const position = g.r.FindFreeTilePosition(player.Position, 0);
  const gridIndex = g.r.GetGridIndex(position);
  spawnGridEntityWithVariant(
    GridEntityType.GRID_STAIRS,
    StairsVariant.NORMAL,
    gridIndex,
  );
}

export function commands(
  functionMap: Map<string, (params: string) => void>,
): void {
  // Compile a list of the commands and sort them alphabetically
  const commandNames = [...functionMap.keys()];
  table.sort(commandNames);

  printConsole("List of Racing+ commands:");
  const text = commandNames.join(" ");
  printConsole(text);
}

export function devil(params: string): void {
  const player = Isaac.GetPlayer();
  player.UseCard(Card.CARD_JOKER);

  if (params !== "") {
    const num = tonumber(params);
    if (num === undefined) {
      printConsole("That is an invalid Devil Room number.");
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

export function listEntities(params: string, includeAll: boolean): void {
  let entityTypeFilter: int | undefined;
  if (params !== "") {
    entityTypeFilter = validateNumber(params);
    if (entityTypeFilter === undefined) {
      return;
    }
  }

  let headerMsg = "Entities in the room";
  if (entityTypeFilter !== undefined) {
    headerMsg += ` (filtered to entity type ${entityTypeFilter})`;
  }
  if (includeAll) {
    headerMsg += " (not excluding background effects)";
  }
  headerMsg += ":";
  log(headerMsg);

  const entities = getEntities();
  let numMatchedEntities = 0;
  entities.forEach((entity, i) => {
    // If a filter was specified, exclude all entities outside of the filter
    if (entityTypeFilter !== undefined && entity.Type !== entityTypeFilter) {
      return;
    }

    // Exclude background effects
    if (
      !includeAll &&
      entity.Type === EntityType.ENTITY_EFFECT &&
      IGNORE_EFFECT_VARIANTS.has(entity.Variant)
    ) {
      return;
    }

    const entityID = getEntityID(entity);
    let debugString = `${i + 1} - ${entityID}`;

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
      debugString += `.${npc.State} (NPC) (CanShutDoors: ${npc.CanShutDoors})`;
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
    debugString += ` (DropSeed: ${entity.DropSeed})`;
    debugString += ` (Position: ${entity.Position.X}, ${entity.Position.Y})`;
    debugString += ` (Velocity: ${entity.Velocity.X}, ${entity.Velocity.Y})`;
    log(debugString);

    numMatchedEntities += 1;
  });

  if (numMatchedEntities === 0) {
    log("(no entities matched)");
  }

  printConsole('Logged the entities in the room to the "log.txt" file.');
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
      return error("Invalid direction.");
    }
  }
}

export function planetarium(): void {
  const planetariumGridIndexes = getRoomGridIndexesForType(
    RoomType.ROOM_PLANETARIUM,
  );
  if (planetariumGridIndexes.length === 0) {
    printConsole("There are no Planetariums on this floor.");
    return;
  }

  const planetariumGridIndex = planetariumGridIndexes[0];
  teleport(planetariumGridIndex);
}

export function roomInfo(): void {
  logRoom();
}

export function seededRaceChar(params: string): void {
  if (params === "") {
    printConsole("You must enter a character number.");
  }

  const num = validateNumber(params);
  if (num === undefined) {
    return;
  }

  g.race.character = num;
  printConsole(`Set the seeded race character to: ${g.race.character}`);
  restart();
}

export function trapdoor(): void {
  const player = Isaac.GetPlayer();
  const position = g.r.FindFreeTilePosition(player.Position, 0);
  const gridIndex = g.r.GetGridIndex(position);
  spawnGridEntityWithVariant(
    GridEntityType.GRID_TRAPDOOR,
    TrapdoorVariant.NORMAL,
    gridIndex,
  );
}

export function validateNumber(params: string): number | undefined {
  const num = tonumber(params);
  if (num === undefined) {
    printConsole("You must specify a number.");
  }

  return num;
}
