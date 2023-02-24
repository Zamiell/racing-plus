import {
  BossID,
  CollectibleType,
  EntityType,
  LevelStage,
  PlayerType,
  PlayerVariant,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  game,
  getCollectibleInitCharge,
  getCollectibleItemType,
  getCollectibleMaxCharges,
  getEntities,
  getFamiliars,
  getPlayers,
  inRoomType,
  isRoomInsideGrid,
  log,
  newPickingUpItem,
} from "isaacscript-common";
import { COLLECTIBLE_PLACEHOLDER_REVERSE_MAP } from "./features/optional/gameplay/extraStartingItems/constants";
import { automaticItemInsertionPreItemPickup } from "./features/optional/quality/automaticItemInsertion/callbacks/preItemPickup";
import { shouldConsistentDevilAngelRoomsApply } from "./features/race/consistentDevilAngelRooms";
import { SERVER_COLLECTIBLE_ID_TO_COLLECTIBLE_TYPE_MAP } from "./maps/serverCollectibleIDToCollectibleTypeMap";
import { ServerCollectibleID } from "./types/ServerCollectibleID";

export function addCollectibleAndRemoveFromPools(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): void {
  const itemPool = game.GetItemPool();

  // Before adding the new collectible, pretend like the item is becoming queued so that the
  // automatic item insertion feature works properly.
  const itemType = getCollectibleItemType(collectibleType);
  const pickingUpItem = newPickingUpItem();
  pickingUpItem.itemType = itemType;
  pickingUpItem.subType = collectibleType;
  automaticItemInsertionPreItemPickup(player, pickingUpItem);

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

export function consoleCommand(command: string): void {
  log(`Executing console command: ${command}`);
  Isaac.ExecuteCommand(command);
  log(`Finished executing console command: ${command}`);
}

export function getEffectiveDevilDeals(): int {
  const devilRoomDeals = game.GetDevilRoomDeals();

  // In seeded races, we arbitrarily increase the Devil Room deals counter by one, so account for
  // this.
  return shouldConsistentDevilAngelRoomsApply()
    ? devilRoomDeals - 1
    : devilRoomDeals;
}

export function giveTrinketAndRemoveFromPools(
  player: EntityPlayer,
  trinketType: TrinketType,
): void {
  const itemPool = game.GetItemPool();

  player.AddTrinket(trinketType);
  itemPool.RemoveTrinket(trinketType);
}

/**
 * We must use "GetCollectibleNum" instead of "HasCollectible" because the latter will be true if
 * they are holding the Mysterious Paper trinket.
 */
export function hasPolaroidOrNegative(): [boolean, boolean] {
  const players = getPlayers();

  const hasPolaroid = players.some((player) => {
    const numPolaroids = player.GetCollectibleNum(
      CollectibleType.POLAROID,
      true,
    );
    return numPolaroids > 0;
  });

  const hasNegative = players.some((player) => {
    const numNegatives = player.GetCollectibleNum(
      CollectibleType.NEGATIVE,
      true,
    );
    return numNegatives > 0;
  });

  return [hasPolaroid, hasNegative];
}

export function inClearedMomBossRoom(): boolean {
  const level = game.GetLevel();
  const stage = level.GetStage();
  const room = game.GetRoom();
  const roomClear = room.IsClear();
  const bossID = room.GetBossID();
  const roomInsideGrid = isRoomInsideGrid();

  return (
    stage === LevelStage.DEPTHS_2 &&
    inRoomType(RoomType.BOSS) &&
    roomInsideGrid &&
    roomClear &&
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
    log(
      `Error: Failed to find a corresponding collectible type for the server collectible ID of: ${serverCollectibleID}`,
    );
    return CollectibleType.SAD_ONION;
  }

  return collectibleType;
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
