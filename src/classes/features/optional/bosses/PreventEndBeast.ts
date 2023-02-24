import {
  BeastVariant,
  EntityType,
  LevelStage,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  ModCallbackCustom,
  onStage,
  spawnNPC,
  spawnPickup,
  VectorZero,
} from "isaacscript-common";
import { consoleCommand } from "../../../../utils";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const v = {
  run: {
    beastDefeated: false,
  },
};

export class PreventEndBeast extends ConfigurableModFeature {
  configKey: keyof Config = "PreventEndBeast";
  v = v;

  @CallbackCustom(
    ModCallbackCustom.POST_ENTITY_KILL_FILTER,
    EntityType.BEAST,
    BeastVariant.BEAST,
  )
  postEntityKillBeast(): void {
    v.run.beastDefeated = true;

    // Reload the Beast room again.
    consoleCommand("goto x.itemdungeon.666");
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const room = game.GetRoom();
    const centerPos = room.GetCenterPos();

    if (!onStage(LevelStage.HOME) || !v.run.beastDefeated) {
      return;
    }

    // We have now reloaded the room after killing The Beast. If we do nothing, The Beast fight will
    // begin again. If we remove all of the Beast entities, it will trigger the credits. Instead, we
    // spawn another Beast to prevent the fight from beginning.
    spawnNPC(EntityType.BEAST, BeastVariant.BEAST, 0, VectorZero);

    // Spawn a big chest (which will get replaced with a trophy if we happen to be in a race).
    spawnPickup(PickupVariant.BIG_CHEST, 0, centerPos);
  }
}
