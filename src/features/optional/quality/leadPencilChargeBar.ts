// Incubus has its own counter that is independent of the player
// However, we don't draw an extra charge bar for every Incubus, since that would clutter the screen

import {
  DefaultMap,
  getPlayerIndex,
  getPlayers,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

/** Corresponds to the "Charging" animation in "chargebar_lead_pencil.anm2" */
export const NUM_FRAMES_IN_CHARGING_ANIMATION = 101;
const NUM_TEARS_UNTIL_LEAD_PENCIL_FIRES = 15;
export const VANILLA_CHARGE_BAR_X_OFFSET = 19;
export const VANILLA_CHARGE_BAR_Y_OFFSET = 54;

const UNTRACKABLE_COLLECTIBLES: readonly CollectibleType[] = [
  CollectibleType.COLLECTIBLE_DR_FETUS, // 52
  CollectibleType.COLLECTIBLE_TECHNOLOGY, // 68
  CollectibleType.COLLECTIBLE_MOMS_KNIFE, // 114
  CollectibleType.COLLECTIBLE_BRIMSTONE, // 118
  CollectibleType.COLLECTIBLE_TECHNOLOGY_2, // 152
  CollectibleType.COLLECTIBLE_EPIC_FETUS, // 168
  CollectibleType.COLLECTIBLE_MONSTROS_LUNG, // 229
  CollectibleType.COLLECTIBLE_TECH_X, // 395
];

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

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!config.leadPencilChargeBar) {
    return;
  }

  for (const player of getPlayers()) {
    drawChargeBar(player);
  }
}

function drawChargeBar(player: EntityPlayer) {
  if (!shouldDrawChargeBar(player)) {
    return;
  }

  const flyingOffset = player.GetFlyingOffset();

  // The Forgotten and The Soul have different Lead Pencil counters
  const playerIndex = getPlayerIndex(player, true);
  const numFiredTears =
    v.run.playersNumFiredTearsMap.getAndSetDefault(playerIndex);

  // The vanilla charge bars appear to the top-right of the player
  // We place the lead pencil charge bar to the top-left
  const adjustX = VANILLA_CHARGE_BAR_X_OFFSET * -1 * player.SpriteScale.X;
  const adjustY =
    VANILLA_CHARGE_BAR_Y_OFFSET * player.SpriteScale.Y - flyingOffset.Y;
  const adjustedPosition = Vector(
    player.Position.X + adjustX,
    player.Position.Y - adjustY,
  );

  // Render it
  const tearsLeft = numFiredTears % NUM_TEARS_UNTIL_LEAD_PENCIL_FIRES;
  let barFrame =
    tearsLeft *
    (NUM_FRAMES_IN_CHARGING_ANIMATION / NUM_TEARS_UNTIL_LEAD_PENCIL_FIRES);
  barFrame = Math.round(barFrame);
  sprite.SetFrame("Charging", barFrame);
  const position = g.r.WorldToScreenPosition(adjustedPosition);
  sprite.Render(position, Vector.Zero, Vector.Zero);
}

function shouldDrawChargeBar(player: EntityPlayer) {
  const character = player.GetPlayerType();

  if (!player.HasCollectible(CollectibleType.COLLECTIBLE_LEAD_PENCIL)) {
    return false;
  }

  // In some situations, the Lead Pencil barrage will fire, but we have no way of tracking it
  // (because there is no PostLaserFired callback)
  if (
    character === PlayerType.PLAYER_AZAZEL || // 7
    playerHasUntrackableCollectible(player)
  ) {
    return false;
  }

  return true;
}

function playerHasUntrackableCollectible(player: EntityPlayer) {
  return UNTRACKABLE_COLLECTIBLES.some((collectibleType) =>
    player.HasCollectible(collectibleType),
  );
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
