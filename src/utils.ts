import {
  Challenge,
  CollectibleType,
  EntityType,
  PlayerType,
  PlayerVariant,
} from "isaac-typescript-definitions";
import { getEntities, getFamiliars, getPlayers, log } from "isaacscript-common";
import { SERVER_COLLECTIBLE_ID_TO_COLLECTIBLE_TYPE_MAP } from "./maps/serverCollectibleIDToCollectibleTypeMap";
import { ServerCollectibleID } from "./types/ServerCollectibleID";

export function consoleCommand(command: string): void {
  log(`Executing console command: ${command}`);
  Isaac.ExecuteCommand(command);
  log(`Finished executing console command: ${command}`);
}

export function hasPolaroidOrNegative(): [boolean, boolean] {
  let hasPolaroid = false;
  let hasNegative = false;
  for (const player of getPlayers()) {
    // We must use "GetCollectibleNum" instead of "HasCollectible" because the latter will be true
    // if they are holding the Mysterious Paper trinket.
    if (player.GetCollectibleNum(CollectibleType.POLAROID) > 0) {
      hasPolaroid = true;
    }
    if (player.GetCollectibleNum(CollectibleType.NEGATIVE) > 0) {
      hasNegative = true;
    }
  }

  return [hasPolaroid, hasNegative];
}

export function moveEsauNextToJacob(): void {
  const esaus = getEntities(
    EntityType.PLAYER,
    PlayerVariant.PLAYER,
    PlayerType.ESAU,
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

  // Put familiars next to the players.
  for (const familiar of getFamiliars()) {
    familiar.Position = position;
  }
}

export function restartChallenge(challenge: Challenge): void {
  // This command will change the challenge of the run and restart the game.
  consoleCommand(`challenge ${challenge}`);
}

export function restartSeed(seed: string): void {
  // This command will change the seed of the run and restart the game.
  consoleCommand(`seed ${seed}`);
}

export function serverCollectibleIDToCollectibleType(
  serverCollectibleID: ServerCollectibleID,
): CollectibleType {
  // 1001-1999 is reserved for server collectible IDs.
  if (serverCollectibleID <= 1000 || serverCollectibleID >= 2000) {
    return serverCollectibleID;
  }

  const collectibleType =
    SERVER_COLLECTIBLE_ID_TO_COLLECTIBLE_TYPE_MAP.get(serverCollectibleID);
  if (collectibleType === undefined) {
    log(
      `Error: Failed to find a corresponding collectible type for the server collectible ID of: ${serverCollectibleID}`,
    );
    return CollectibleType.SAD_ONION;
  }

  return collectibleType;
}
