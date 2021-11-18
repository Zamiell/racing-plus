import { getPlayers, saveDataManager } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { NUM_FRAMES_IN_CHARGING_ANIMATION, VANILLA_CHARGE_BAR_X_OFFSET, VANILLA_CHARGE_BAR_Y_OFFSET } from "./leadPencilChargeBar";

const NUM_ROOMS_TO_CHARGE_AZAZELS_RAGE = 4;

const sprite = Sprite();
sprite.Load("gfx/chargebar_azazels_rage.anm2", true);

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!config.azazelsRageChargeBar) {
    return;
  }

  for (const player of getPlayers()) {
    drawChargeBar(player);
  }
}

function drawChargeBar(player: EntityPlayer) {
  if (!player.HasCollectible(CollectibleType.COLLECTIBLE_AZAZELS_RAGE)) {
    return;
  }

  const character = player.GetPlayerType();
  const flyingOffset = player.GetFlyingOffset();
  const effects = player.GetEffects();
  let numCharges = effects.GetCollectibleEffectNum(
    CollectibleType.COLLECTIBLE_AZAZELS_RAGE,
  );

  // The number of effects goes to 6 when the blast is firing
  if (numCharges > 4) {
    numCharges = 0;
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
  let barFrame =
    numCharges * (NUM_FRAMES_IN_CHARGING_ANIMATION / NUM_ROOMS_TO_CHARGE_AZAZELS_RAGE);
  barFrame = Math.round(barFrame);
  sprite.SetFrame("Charging", barFrame);
  const position = g.r.WorldToScreenPosition(adjustedPosition);
  sprite.Render(
    position,
    Vector.Zero,
    Vector.Zero,
  );
}
