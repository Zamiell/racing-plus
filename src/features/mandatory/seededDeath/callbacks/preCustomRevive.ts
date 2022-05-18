import {
  Card,
  LevelCurse,
  PillColor,
  PocketItemSlot,
  RoomType,
  TrinketSlot,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  characterCanTakeFreeDevilDeals,
  findFreePosition,
  getEnumValues,
  getPlayerIndex,
  inBeastRoom,
  isJacobOrEsau,
  isKeeper,
} from "isaacscript-common";
import { RevivalType } from "../../../../enums/RevivalType";
import { SeededDeathState } from "../../../../enums/SeededDeathState";
import g from "../../../../globals";
import { DEVIL_DEAL_BUFFER_GAME_FRAMES } from "../constants";
import {
  logSeededDeathStateChange,
  shouldSeededDeathFeatureApply,
} from "../seededDeath";
import v from "../v";

export function seededDeathPreCustomRevive(player: EntityPlayer): int | void {
  if (!shouldSeededDeathFeatureApply()) {
    return undefined;
  }

  if (!shouldSeededDeathRevive(player)) {
    return undefined;
  }

  preRevivalDeathAnimation(player);

  return RevivalType.SEEDED_DEATH;
}

function shouldSeededDeathRevive(player: EntityPlayer) {
  const roomType = g.r.GetType();
  const gameFrameCount = g.g.GetFrameCount();

  // Do not revive the player if they took a devil deal within the past few seconds. (We cannot use
  // the `DamageFlag.DAMAGE_DEVIL` to determine this because the player could have taken a devil
  // deal and died to a fire / spikes / etc.). In order to reduce false positives, we can safely
  // ignore characters that cannot die on taking a devil deal.
  if (
    v.run.frameOfLastDevilDeal !== null &&
    gameFrameCount <=
      v.run.frameOfLastDevilDeal + DEVIL_DEAL_BUFFER_GAME_FRAMES &&
    canCharacterDieFromTakingADevilDeal(player)
  ) {
    return false;
  }

  // Do not revive the player if they are trying to get a "free" item from a particular special
  // room.
  if (
    roomType === RoomType.SACRIFICE || // 13
    roomType === RoomType.BOSS_RUSH // 17
  ) {
    return false;
  }

  // Do not revive the player in The Beast room. Handling this special case would be too complicated
  // and the player would probably lose the race anyway.
  if (inBeastRoom()) {
    return false;
  }

  return true;
}

function preRevivalDeathAnimation(player: EntityPlayer) {
  const playerIndex = getPlayerIndex(player);

  dropEverything(player);
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== undefined) {
      dropEverything(player);
    }
  }

  v.run.state = SeededDeathState.WAITING_FOR_POST_CUSTOM_REVIVE;
  v.run.dyingPlayerIndex = playerIndex;
  logSeededDeathStateChange();

  // The custom revive works by awarding a 1-Up, which is confusing. Thus, hide the health UI with
  // Curse of the Unknown for the duration of the revive.
  g.l.AddCurse(LevelCurse.UNKNOWN, false);
}

function canCharacterDieFromTakingADevilDeal(player: EntityPlayer) {
  const character = player.GetPlayerType();
  return !characterCanTakeFreeDevilDeals(character) && !isKeeper(player);
}

function dropEverything(player: EntityPlayer) {
  for (const pocketItemSlot of getEnumValues(PocketItemSlot)) {
    const card = player.GetCard(pocketItemSlot);
    const pillColor = player.GetPill(pocketItemSlot);
    if (card === Card.NULL && pillColor === PillColor.NULL) {
      continue;
    }

    const position = findFreePosition(player.Position);
    player.DropPocketItem(pocketItemSlot, position);
  }

  for (const trinketSlot of getEnumValues(TrinketSlot)) {
    const trinketType = player.GetTrinket(trinketSlot);
    if (trinketType === TrinketType.NULL) {
      continue;
    }

    if (trinketType === TrinketType.PERFECTION) {
      // In the special case of the Perfection trinket, it should be deleted instead of dropped.
      player.TryRemoveTrinket(TrinketType.PERFECTION);
    } else {
      const position = findFreePosition(player.Position);
      player.DropTrinket(position, true);
    }
  }
}
