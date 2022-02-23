import {
  canTakeFreeDevilDeals,
  findFreePosition,
  getPlayerIndex,
  inBeastRoom,
  isJacobOrEsau,
  isKeeper,
  MAX_PLAYER_POCKET_ITEM_SLOTS,
  MAX_PLAYER_TRINKET_SLOTS,
  willReviveFromSpiritShackles,
} from "isaacscript-common";
import g from "../../../../globals";
import { SeededDeathState } from "../../../../types/SeededDeathState";
import { inBeastDebugRoom } from "../../../../utils";
import { RevivalType } from "../../../race/types/RevivalType";
import { DEVIL_DEAL_BUFFER_FRAMES } from "../constants";
import {
  logSeededDeathStateChange,
  shouldSeededDeathApply,
} from "../seededDeath";
import v from "../v";

// ModCallbacksCustom.MC_PRE_CUSTOM_REVIVE
export function seededDeathPreCustomRevive(player: EntityPlayer): int | void {
  if (!shouldSeededDeathApply()) {
    return undefined;
  }

  const roomType = g.r.GetType();
  const playerIndex = getPlayerIndex(player);
  const gameFrameCount = g.g.GetFrameCount();

  // Do not revive the player if they have Spirit Shackles and it is activated
  if (willReviveFromSpiritShackles(player)) {
    return undefined;
  }

  // Do not revive the player if they took a devil deal within the past few seconds
  // (we cannot use the "DamageFlag.DAMAGE_DEVIL" to determine this because the player could have
  // taken a devil deal and died to a fire / spikes / etc.)
  // In order to reduce false positives, we can safely ignore characters that cannot die on taking a
  // devil deal
  if (
    v.run.frameOfLastDevilDeal !== null &&
    gameFrameCount <= v.run.frameOfLastDevilDeal + DEVIL_DEAL_BUFFER_FRAMES &&
    !canCharacterDieFromTakingADevilDeal(player)
  ) {
    return undefined;
  }

  // Do not revive the player if they are trying to get a "free" item from a particular special room
  if (
    roomType === RoomType.ROOM_SACRIFICE || // 13
    roomType === RoomType.ROOM_BOSSRUSH // 17
  ) {
    return undefined;
  }

  // Do not revive the player in The Beast room
  // Handling this special case would be too complicated and the player would probably lose the race
  // anyway
  if (inBeastRoom() || inBeastDebugRoom()) {
    return undefined;
  }

  dropEverything(player);
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== undefined) {
      dropEverything(player);
    }
  }

  v.run.state = SeededDeathState.WAITING_FOR_DEATH_ANIMATION_TO_FINISH;
  v.run.dyingPlayerIndex = playerIndex;
  logSeededDeathStateChange();

  // The custom revive works by awarding a 1-Up, which is confusing
  // Thus, hide the health UI with Curse of the Unknown for the duration of the revive
  g.l.AddCurse(LevelCurse.CURSE_OF_THE_UNKNOWN, false);

  return RevivalType.SEEDED_DEATH;
}

function canCharacterDieFromTakingADevilDeal(player: EntityPlayer) {
  return !canTakeFreeDevilDeals(player) && !isKeeper(player);
}

function dropEverything(player: EntityPlayer) {
  for (
    let pocketItemSlot = 0;
    pocketItemSlot < MAX_PLAYER_POCKET_ITEM_SLOTS;
    pocketItemSlot++
  ) {
    const position = findFreePosition(player.Position);
    player.DropPocketItem(pocketItemSlot, position);
  }

  for (
    let trinketSlot = 0;
    trinketSlot < MAX_PLAYER_TRINKET_SLOTS;
    trinketSlot++
  ) {
    const trinketType = player.GetTrinket(trinketSlot);
    if (trinketType === TrinketType.TRINKET_PERFECTION) {
      // In the special case of the Perfection trinket, it should be deleted instead of dropped
      player.TryRemoveTrinket(TrinketType.TRINKET_PERFECTION);
    } else {
      const position = findFreePosition(player.Position);
      player.DropTrinket(position, true);
    }
  }
}
