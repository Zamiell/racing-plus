import { getPlayers, MAX_PLAYER_POCKET_ITEM_SLOTS } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

export function postGameStarted(): void {
  if (!config.lostUseHolyCard) {
    return;
  }

  for (const player of getPlayers()) {
    const character = player.GetPlayerType();
    if (character === PlayerType.PLAYER_THELOST_B) {
      for (
        let pocketItemSlot = 0;
        pocketItemSlot < MAX_PLAYER_POCKET_ITEM_SLOTS;
        pocketItemSlot++
      ) {
        const card = player.GetCard(pocketItemSlot);
        if (card === Card.CARD_HOLY) {
          player.SetCard(pocketItemSlot, Card.CARD_NULL);
          player.UseCard(Card.CARD_HOLY, UseFlag.USE_NOANIM);
          break;
        }
      }
    }
  }
}
