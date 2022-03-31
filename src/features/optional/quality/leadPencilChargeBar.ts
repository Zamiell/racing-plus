// Incubus has its own counter that is independent of the player
// However, we don't draw an extra charge bar for every Incubus, since that would clutter the screen

import {
  DefaultMap,
  getPlayerIndex,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import {
  drawCustomChargeBar,
  NUM_FRAMES_IN_CHARGING_ANIMATION,
  shouldDrawAnyCustomChargeBar,
  shouldDrawCustomChargeBar,
} from "../../../customChargeBar";
import { CustomChargeBarType } from "../../../enums/CustomChargeBarType";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

const NUM_TEARS_UNTIL_LEAD_PENCIL_FIRES = 15;

const v = {
  run: {
    playersNumFiredTearsMap: new DefaultMap<PlayerIndex, int>(0),
    playersLastFiredFrameMap: new Map<PlayerIndex, int>(),
  },
};

const sprite = Sprite();
sprite.Load("gfx/chargebar_lead_pencil.anm2", true);

export function init(): void {
  saveDataManager("leadPencilChargeBar", v, featureEnabled);
}

function featureEnabled() {
  return config.leadPencilChargeBar;
}

// ModCallbacks.MC_POST_PLAYER_RENDER (32)
export function postPlayerRender(player: EntityPlayer): void {
  if (!config.leadPencilChargeBar) {
    return;
  }

  if (!shouldDrawAnyCustomChargeBar()) {
    return;
  }

  if (!shouldDrawCustomChargeBar(player, CustomChargeBarType.LEAD_PENCIL)) {
    return;
  }

  // The Forgotten and The Soul have different Lead Pencil counters
  const playerIndex = getPlayerIndex(player, true);
  const numFiredTears =
    v.run.playersNumFiredTearsMap.getAndSetDefault(playerIndex);
  const tearsLeft = numFiredTears % NUM_TEARS_UNTIL_LEAD_PENCIL_FIRES;

  const frameAmountPerCharge =
    NUM_FRAMES_IN_CHARGING_ANIMATION / NUM_TEARS_UNTIL_LEAD_PENCIL_FIRES;
  const frame = Math.round(tearsLeft * frameAmountPerCharge);
  drawCustomChargeBar(player, sprite, frame, CustomChargeBarType.LEAD_PENCIL);
}

// ModCallbacks.MC_POST_FIRE_TEAR (61)
export function postFireTear(tear: EntityTear): void {
  if (!config.leadPencilChargeBar) {
    return;
  }

  incrementLeadPencilCounter(tear.Parent);
}

// ModCallbacksCustom.MC_POST_BONE_SWING
export function postBoneSwing(boneClub: EntityKnife): void {
  if (!config.leadPencilChargeBar) {
    return;
  }

  incrementLeadPencilCounter(boneClub.Parent);
}

/**
 * Lead Pencil fires every N tears. The counter needs to be incremented even if the player does not
 * have Lead Pencil, so that the charge bar will be accurate if they pick up the item mid-run.
 */
function incrementLeadPencilCounter(parent: Entity | undefined) {
  if (parent === undefined) {
    return;
  }

  const player = parent.ToPlayer();
  if (player === undefined) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();

  // The Forgotten and The Soul have different Lead Pencil counters
  const playerIndex = getPlayerIndex(player, true);

  // The second tear of a multi-tear-shot does not count towards the Lead Pencil counter
  // In the same way, if Forgotten has two bone clubs, the second swing does not count towards the
  // Lead Pencil counter
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
