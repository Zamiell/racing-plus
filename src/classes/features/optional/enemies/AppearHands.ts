import {
  EntityType,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  sfxManager,
} from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class AppearHands extends ConfigurableModFeature {
  configKey: keyof Config = "AppearHands";

  // 69, 213
  @Callback(ModCallback.PRE_NPC_UPDATE, EntityType.MOMS_HAND)
  preNPCUpdateMomsHand(npc: EntityNPC): boolean | undefined {
    return this.preNPCUpdateHand(npc);
  }

  // 69, 287
  @Callback(ModCallback.PRE_NPC_UPDATE, EntityType.MOMS_DEAD_HAND)
  preNPCUpdateMomsDeadHand(npc: EntityNPC): boolean | undefined {
    return this.preNPCUpdateHand(npc);
  }

  preNPCUpdateHand(npc: EntityNPC): boolean | undefined {
    const sprite = npc.GetSprite();

    // Ignore the normal AI when it is playing the custom "Appear" animation.
    if (sprite.IsPlaying("Appear")) {
      return true;
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    // Mute the audio tell of Mom laughing, since it is obnoxious.
    sfxManager.Stop(SoundEffect.MOM_VOX_EVIL_LAUGH);
  }

  @CallbackCustom(ModCallbackCustom.POST_NPC_INIT_LATE, EntityType.MOMS_HAND)
  postNPCInitLateMomsHand(npc: EntityNPC): void {
    this.playCustomAppearAnimation(npc);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_NPC_INIT_LATE,
    EntityType.MOMS_DEAD_HAND,
  )
  postNPCInitLateMomsDeadHand(npc: EntityNPC): void {
    this.playCustomAppearAnimation(npc);
  }

  /**
   * Play a custom animation when hands first spawn. (They jump up to the ceiling from the floor.)
   *
   * This cannot be in the `POST_NPC_INIT` callback because if it is done there, a shadow will
   * appear below the hand, which does not look very good, and I don't know of how to remove the
   * shadow.
   */
  playCustomAppearAnimation(npc: EntityNPC): void {
    const sprite = npc.GetSprite();
    sprite.Play("Appear", true);
  }
}
