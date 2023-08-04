import type {
  TrinketType} from "isaac-typescript-definitions";
import {
  BossID,
  CollectibleType,
  EntityType,
  LevelStage,
  PlayerType,
  PlayerVariant,
  RoomType
} from "isaac-typescript-definitions";
import {
  ReadonlyMap,
  anyPlayerHasCollectible,
  game,
  getCollectibleInitCharge,
  getCollectibleMaxCharges,
  getEntities,
  getFamiliars,
  getPlayers,
  getReversedMap,
  inRoomType,
  isRoomInsideGrid,
  log,
  logError,
  onStage,
} from "isaacscript-common";
import { COLLECTIBLE_PLACEHOLDER_REVERSE_MAP } from "./classes/features/optional/gameplay/extraStartingItems/constants";
import { automaticItemInsertionCheckIfCollectibleDropsPickups } from "./classes/features/optional/quality/AutomaticItemInsertion";
import { CollectibleTypeCustom } from "./enums/CollectibleTypeCustom";
import { shouldConsistentDevilAngelRoomsApply } from "./features/race/consistentDevilAngelRooms";
import type { ServerCollectibleID } from "./types/ServerCollectibleID";

const SERVER_COLLECTIBLE_ID_TO_COLLECTIBLE_TYPE_MAP = new ReadonlyMap<
  int,
  CollectibleType
>([
  [1001, CollectibleTypeCustom.THIRTEEN_LUCK],
  [1002, CollectibleTypeCustom.FIFTEEN_LUCK],
  [1003, CollectibleTypeCustom.SAWBLADE],
]);

const COLLECTIBLE_TYPE_TO_SERVER_COLLECTIBLE_ID_MAP = getReversedMap(
  SERVER_COLLECTIBLE_ID_TO_COLLECTIBLE_TYPE_MAP,
);

export function addCollectibleAndRemoveFromPools(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): void {
  const itemPool = game.GetItemPool();

  // Before adding the new collectible, pretend like the item is becoming queued so that the
  // automatic item insertion feature works properly.
  automaticItemInsertionCheckIfCollectibleDropsPickups(player, collectibleType);

  const initCharges = getCollectibleInitCharge(collectibleType);
  const maxCharges = getCollectibleMaxCharges(collectibleType);
  const charges = initCharges === -1 ? maxCharges : initCharges;

  player.AddCollectible(collectibleType, charges);
  itemPool.RemoveCollectible(collectibleType);

  const placeholderCollectible =
    COLLECTIBLE_PLACEHOLDER_REVERSE_MAP.get(collectibleType);
  if (placeholderCollectible !== undefined) {
    itemPool.RemoveCollectible(placeholderCollectible);
  }
}

export function addTrinketAndRemoveFromPools(
  player: EntityPlayer,
  trinketType: TrinketType,
): void {
  const itemPool = game.GetItemPool();

  player.AddTrinket(trinketType);
  itemPool.RemoveTrinket(trinketType);
}

export function consoleCommand(command: string): void {
  log(`Executing console command: ${command}`);
  Isaac.ExecuteCommand(command);
  log(`Finished executing console command: ${command}`);
}

/**
 * In seeded races, we arbitrarily increase the Devil Room deals counter by one, so account for
 * this.
 */
export function getEffectiveDevilDeals(): int {
  const devilRoomDeals = game.GetDevilRoomDeals();

  return shouldConsistentDevilAngelRoomsApply()
    ? devilRoomDeals - 1
    : devilRoomDeals;
}

/**
 * We must use "GetCollectibleNum" instead of "HasCollectible" because the latter will be true if
 * they are holding the Mysterious Paper trinket.
 */
export function getPlayerPhotoStatus(): {
  hasPolaroid: boolean;
  hasNegative: boolean;
} {
  const hasPolaroid = anyPlayerHasCollectible(CollectibleType.POLAROID, true);
  const hasNegative = anyPlayerHasCollectible(CollectibleType.NEGATIVE, true);

  return { hasPolaroid, hasNegative };
}

export function inClearedMomBossRoom(): boolean {
  const room = game.GetRoom();
  const roomClear = room.IsClear();

  return inMomBossRoom() && roomClear;
}

export function inMomBossRoom(): boolean {
  const room = game.GetRoom();
  const bossID = room.GetBossID();
  const roomInsideGrid = isRoomInsideGrid();

  return (
    onStage(LevelStage.DEPTHS_2) &&
    inRoomType(RoomType.BOSS) &&
    roomInsideGrid &&
    // We want to filter out the situations where the Dad's Note room is cleared.
    bossID === BossID.MOM
  );
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
    logError(
      `Error: Failed to find a corresponding collectible type for the server collectible ID of: ${serverCollectibleID}`,
    );
    return CollectibleType.SAD_ONION;
  }

  return collectibleType;
}

export function collectibleTypeToServerCollectibleID(
  collectibleType: CollectibleType,
): ServerCollectibleID | undefined {
  const serverCollectibleID =
    COLLECTIBLE_TYPE_TO_SERVER_COLLECTIBLE_ID_MAP.get(collectibleType);
  return serverCollectibleID as ServerCollectibleID | undefined;
}

/**
 * Don't check for inputs when:
 * - the game is paused
 * - the console is open
 * - Mod Config Menu is open
 * - a custom console is open
 */
export function shouldCheckForGameplayInputs(): boolean {
  const isPaused = game.IsPaused();
  return (
    !isPaused &&
    (ModConfigMenu === undefined || !ModConfigMenu.IsVisible) &&
    (AwaitingTextInput === undefined || !AwaitingTextInput)
  );
}
