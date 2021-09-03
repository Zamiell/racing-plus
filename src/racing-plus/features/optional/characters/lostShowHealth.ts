import { getHUDOffsetVector } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const HEART_UI_POSITION = Vector(41, 2);
const HEART_UI_EXTRA_LIVES_OFFSET = Vector(24, 0);

const sprite = Sprite();
sprite.Load("gfx/ui/p20_lost_health.anm2", true);

export function postRender(): void {
  if (!config.lostShowHealth) {
    return;
  }

  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const soulHearts = player.GetSoulHearts();
  const extraLives = player.GetExtraLives();

  if (
    character !== PlayerType.PLAYER_THELOST &&
    character !== PlayerType.PLAYER_THELOST_B
  ) {
    return;
  }

  // Don't display the UI if we just died
  if (soulHearts < 1) {
    return;
  }

  const hudOffset = getHUDOffsetVector();
  let position = HEART_UI_POSITION.add(hudOffset);
  if (extraLives > 0) {
    position = position.add(HEART_UI_EXTRA_LIVES_OFFSET);
  }

  sprite.Play("Lost_Heart_Half", true);
  sprite.Render(position, Vector.Zero, Vector.Zero);
}
