import {
  CardType,
  PlayerType,
  PocketItemSlot,
  SoundEffect,
  UseFlag,
} from "isaac-typescript-definitions";
import {
  getEnumValues,
  getPlayersOfType,
  sfxManager,
} from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.lostUseHolyCard) {
    return;
  }

  const taintedLosts = getPlayersOfType(PlayerType.THE_LOST_B);
  for (const player of taintedLosts) {
    const slotWithHolyCard = getPocketItemSlotWithHolyCard(player);
    if (slotWithHolyCard !== undefined) {
      player.SetCard(slotWithHolyCard, CardType.NULL);
      player.UseCard(CardType.HOLY, UseFlag.NO_ANIMATION);
      sfxManager.Stop(SoundEffect.HOLY_CARD);
    }
  }
}

function getPocketItemSlotWithHolyCard(player: EntityPlayer) {
  const pocketItemSlots = getEnumValues(PocketItemSlot);
  return pocketItemSlots.find((pocketItemSlot) => {
    const cardType = player.GetCard(pocketItemSlot);
    return cardType === CardType.HOLY;
  });
}
