import {
  getPlayersOfType,
  MAX_PLAYER_POCKET_ITEM_SLOTS,
  range,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.lostUseHolyCard) {
    return;
  }

  const taintedLosts = getPlayersOfType(PlayerType.PLAYER_THELOST_B);
  for (const player of taintedLosts) {
    const slotWithHolyCard = getPocketItemSlotWithHolyCard(player);
    if (slotWithHolyCard !== undefined) {
      player.SetCard(slotWithHolyCard, Card.CARD_NULL);
      player.UseCard(Card.CARD_HOLY, UseFlag.USE_NOANIM);
      g.sfx.Stop(SoundEffect.SOUND_HOLY_CARD);
    }
  }
}

function getPocketItemSlotWithHolyCard(player: EntityPlayer) {
  const pocketItemSlots = range(0, MAX_PLAYER_POCKET_ITEM_SLOTS - 1);
  return pocketItemSlots.find((pocketItemSlot) => {
    const card = player.GetCard(pocketItemSlot);
    return card === Card.CARD_HOLY;
  });
}
