import { getPlayers, saveDataManager } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

/** Corresponds to the "Charging" animation in "chargebar_lead_pencil.anm2" */
const NUM_FRAMES_IN_CHARGING_ANIMATION = 101;
const NUM_TEARS_UNTIL_LEAD_PENCIL = 15;
const VANILLA_CHARGE_BAR_X_OFFSET = 19;
const VANILLA_CHARGE_BAR_Y_OFFSET = 54;

const sprite = Sprite();
sprite.Load("gfx/chargebar_lead_pencil.anm2", true);

const v = {
  run: {
    firedTears: 0,
    lastFiredTearFrame: null as int | null,
  },
};

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
  if (!player.HasCollectible(CollectibleType.COLLECTIBLE_LEAD_PENCIL)) {
    return;
  }

  const character = player.GetPlayerType();
  const flyingOffset = player.GetFlyingOffset();

  // Lead Pencil is a useless item in some situations (the barrage will never fire)
  // In these situations, don't clutter the screen with the charge bar
  if (
    character === PlayerType.PLAYER_AZAZEL || // 7
    character === PlayerType.PLAYER_LILITH || // 13
    character === PlayerType.PLAYER_THEFORGOTTEN || // 16
    player.HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY) || // 68
    player.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) || // 114
    player.HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) || // 118
    player.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) || // 168
    player.HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) // 395
  ) {
    return;
  }

  // In other situations, the barrage will fire, but we have no way of tracking it
  if (
    player.HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) || // 52
    player.HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY_2) // 152
  ) {
    return;
  }

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
  const tearNum = v.run.firedTears % NUM_TEARS_UNTIL_LEAD_PENCIL;
  let barFrame =
    tearNum * (NUM_FRAMES_IN_CHARGING_ANIMATION / NUM_TEARS_UNTIL_LEAD_PENCIL);
  barFrame = Math.round(barFrame);
  sprite.SetFrame("Charging", barFrame);
  sprite.Render(
    g.r.WorldToScreenPosition(adjustedPosition),
    Vector.Zero,
    Vector.Zero,
  );
}

// ModCallbacks.MC_POST_FIRE_TEAR (61)
export function postFireTear(): void {
  if (!config.leadPencilChargeBar) {
    return;
  }

  // Lead Pencil fires every N tears
  // The counter needs to be incremented even if the player does not have Lead Pencil,
  // so that the charge bar will be accurate if they pick up the item mid-run
  const gameFrameCount = g.g.GetFrameCount();

  // The second tear of multi-shots don't count towards the Lead Pencil counter
  if (gameFrameCount === v.run.lastFiredTearFrame) {
    return;
  }
  v.run.lastFiredTearFrame = gameFrameCount;

  v.run.firedTears += 1;
}
