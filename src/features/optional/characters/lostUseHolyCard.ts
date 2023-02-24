import {
  CardType,
  PlayerType,
  PocketItemSlot,
  SoundEffect,
  UseFlag,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getEnumValues,
  getPlayersOfType,
  ModCallbackCustom,
  sfxManager,
} from "isaacscript-common";
import { Config } from "../../../classes/Config";
import { ConfigurableModFeature } from "../../../classes/ConfigurableModFeature";

export class LostUseHolyCard extends ConfigurableModFeature {
  configKey: keyof Config = "LostUseHolyCard";

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    const taintedLosts = getPlayersOfType(PlayerType.LOST_B);
    for (const player of taintedLosts) {
      const slotWithHolyCard = this.getPocketItemSlotWithHolyCard(player);
      if (slotWithHolyCard !== undefined) {
        player.SetCard(slotWithHolyCard, CardType.NULL);
        player.UseCard(CardType.HOLY, UseFlag.NO_ANIMATION);
        sfxManager.Stop(SoundEffect.HOLY_CARD);
      }
    }
  }

  getPocketItemSlotWithHolyCard(
    player: EntityPlayer,
  ): PocketItemSlot | undefined {
    const pocketItemSlots = getEnumValues(PocketItemSlot);
    return pocketItemSlots.find((pocketItemSlot) => {
      const cardType = player.GetCard(pocketItemSlot);
      return cardType === CardType.HOLY;
    });
  }
}
