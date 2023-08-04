import type { PlayerIndex } from "isaacscript-common";
import {
  CallbackCustom,
  DefaultMap,
  game,
  getPlayerFromEntity,
  getPlayerIndex,
  isTearFromPlayer,
  ModCallbackCustom,
} from "isaacscript-common";
import {
  drawCustomChargeBar,
  NUM_FRAMES_IN_CHARGING_ANIMATION,
  shouldDrawCustomChargeBar,
} from "../../../../customChargeBar";
import { CustomChargeBarType } from "../../../../enums/CustomChargeBarType";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const NUM_TEARS_UNTIL_LEAD_PENCIL_FIRES = 15;

const v = {
  run: {
    playersNumFiredTearsMap: new DefaultMap<PlayerIndex, int>(0),
    playersLastFiredFrameMap: new Map<PlayerIndex, int>(),
  },
};

const sprite = Sprite();
sprite.Load("gfx/chargebar_lead_pencil.anm2", true);

/**
 * Incubus and Blood Babies have their own counter that is independent of the player. However, we
 * don't draw an extra charge bar for every familiar, since that would clutter the screen.
 */
export class LeadPencilChargeBar extends ConfigurableModFeature {
  configKey: keyof Config = "LeadPencilChargeBar";
  v = v;

  @CallbackCustom(ModCallbackCustom.POST_BONE_SWING)
  postBoneSwing(boneClub: EntityKnife): void {
    checkIncrementLeadPencilCounter(boneClub);
  }

  @CallbackCustom(ModCallbackCustom.POST_PLAYER_RENDER_REORDERED)
  postPlayerRenderReordered(player: EntityPlayer): void {
    if (!shouldDrawCustomChargeBar(player, CustomChargeBarType.LEAD_PENCIL)) {
      return;
    }

    // The Forgotten and The Soul have different Lead Pencil counters.
    const playerIndex = getPlayerIndex(player, true);
    const numFiredTears =
      v.run.playersNumFiredTearsMap.getAndSetDefault(playerIndex);
    const tearsLeft = numFiredTears % NUM_TEARS_UNTIL_LEAD_PENCIL_FIRES;

    const frameAmountPerCharge =
      NUM_FRAMES_IN_CHARGING_ANIMATION / NUM_TEARS_UNTIL_LEAD_PENCIL_FIRES;
    const frame = Math.round(tearsLeft * frameAmountPerCharge);
    drawCustomChargeBar(player, sprite, frame, CustomChargeBarType.LEAD_PENCIL);
  }

  @CallbackCustom(ModCallbackCustom.POST_TEAR_INIT_VERY_LATE)
  postTearInitVeryLate(tear: EntityTear): void {
    if (isTearFromPlayer(tear)) {
      checkIncrementLeadPencilCounter(tear);
    }
  }
}

/**
 * Lead Pencil fires every N tears. The counter needs to be incremented even if the player does not
 * have Lead Pencil, so that the charge bar will be accurate if they pick up the item mid-run.
 */
function checkIncrementLeadPencilCounter(entity: Entity) {
  const gameFrameCount = game.GetFrameCount();

  const player = getPlayerFromEntity(entity);
  if (player === undefined) {
    return;
  }

  // The Forgotten and The Soul have different Lead Pencil counters.
  const playerIndex = getPlayerIndex(player, true);

  // The second tear of a multi-tear-shot does not count towards the Lead Pencil counter. In the
  // same way, if Forgotten has two bone clubs, the second swing does not count towards the Lead
  // Pencil counter.
  const lastFiredTearFrame = v.run.playersLastFiredFrameMap.get(playerIndex);
  if (gameFrameCount === lastFiredTearFrame) {
    return;
  }
  v.run.playersLastFiredFrameMap.set(playerIndex, gameFrameCount);

  const oldNumFiredTears =
    v.run.playersNumFiredTearsMap.getAndSetDefault(playerIndex);
  const newNumFiredTears = oldNumFiredTears + 1;
  v.run.playersNumFiredTearsMap.set(playerIndex, newNumFiredTears);
}
