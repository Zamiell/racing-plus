import {
  getEntities,
  getFamiliars,
  getPlayers,
  log,
  logArray,
} from "isaacscript-common";
import { SERVER_COLLECTIBLE_ID_TO_COLLECTIBLE_TYPE_MAP } from "./maps/serverCollectibleIDToCollectibleTypeMap";
import { PlayerTypeCustom } from "./types/PlayerTypeCustom";

export function consoleCommand(command: string): void {
  log(`Executing console command: ${command}`);
  Isaac.ExecuteCommand(command);
  log(`Finished executing console command: ${command}`);
}

export function getPartialMatchFromMap<T>(
  searchText: string,
  map: ReadonlyMap<string, T>,
): T | undefined {
  const keys = [...map.keys()];
  keys.sort();

  searchText = searchText.toLowerCase();
  searchText = searchText.replaceAll(" ", "");

  const matchingKeys = keys.filter((key) =>
    key.toLowerCase().startsWith(searchText),
  );
  matchingKeys.sort();
  logArray(matchingKeys);

  const matchingKey = matchingKeys[0];
  if (matchingKey === undefined) {
    return undefined;
  }

  return map.get(matchingKey);
}

export function hasPolaroidOrNegative(): [boolean, boolean] {
  let hasPolaroid = false;
  let hasNegative = false;
  for (const player of getPlayers()) {
    // We must use "GetCollectibleNum" instead of "HasCollectible" because the latter will be true
    // if they are holding the Mysterious Paper trinket
    if (player.GetCollectibleNum(CollectibleType.COLLECTIBLE_POLAROID) > 0) {
      hasPolaroid = true;
    }
    if (player.GetCollectibleNum(CollectibleType.COLLECTIBLE_NEGATIVE) > 0) {
      hasNegative = true;
    }
  }

  return [hasPolaroid, hasNegative];
}

export function moveEsauNextToJacob(): void {
  const esaus = getEntities(
    EntityType.ENTITY_PLAYER,
    PlayerVariant.PLAYER,
    PlayerType.PLAYER_ESAU,
  );
  for (const esau of esaus) {
    const player = esau.ToPlayer();
    if (player === undefined) {
      continue;
    }

    const jacob = player.GetOtherTwin();
    if (jacob === undefined) {
      continue;
    }

    const adjustment = Vector(20, 0);
    const adjustedPosition = jacob.Position.add(adjustment);
    esau.Position = adjustedPosition;
  }
}

export function movePlayersAndFamiliars(position: Vector): void {
  const players = getPlayers();
  for (const player of players) {
    player.Position = position;
  }

  moveEsauNextToJacob();

  // Put familiars next to the players
  for (const familiar of getFamiliars()) {
    familiar.Position = position;
  }
}

export function restart(): void {
  consoleCommand("restart");
}

export function restartAsCharacter(
  character: PlayerType | PlayerTypeCustom,
): void {
  // Doing a "restart 40" causes the player to spawn as Tainted Soul without a Forgotten companion
  if (character === PlayerType.PLAYER_THESOUL_B) {
    character = PlayerType.PLAYER_THEFORGOTTEN_B;
  }

  consoleCommand(`restart ${character}`);
}

export function restartChallenge(challenge: Challenge): void {
  // This command will change the challenge of the run and restart the game
  consoleCommand(`challenge ${challenge}`);
}

export function restartSeed(seed: string): void {
  // This command will change the seed of the run and restart the game
  consoleCommand(`seed ${seed}`);
}

export function serverCollectibleIDToCollectibleType(serverCollectibleID: int) {
  // 1001-1999 is reserved for server collectible IDs
  if (serverCollectibleID <= 1000 || serverCollectibleID >= 2000) {
    return serverCollectibleID;
  }

  const collectibleType =
    SERVER_COLLECTIBLE_ID_TO_COLLECTIBLE_TYPE_MAP.get(serverCollectibleID);
  if (collectibleType === undefined) {
    log(
      `Error: Failed to find a corresponding collectible type for the server collectible ID of: ${serverCollectibleID}`,
    );
    return CollectibleType.COLLECTIBLE_SAD_ONION;
  }

  return collectibleType;
}
