import {
  getHUDOffsetVector,
  getVisibleHearts,
  hasFlag,
  isKeeper,
} from "isaacscript-common";
import g from "../../../globals";

const sprite = Sprite();
sprite.Load("gfx/ui/p20_holy_mantle.anm2", true);

export function postRender(): void {
  const curses = g.l.GetCurses();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const extraLives = player.GetExtraLives();
  const effects = player.GetEffects();
  const numMantles = effects.GetCollectibleEffectNum(
    CollectibleType.COLLECTIBLE_HOLY_MANTLE,
  );
  const visibleHearts = getVisibleHearts(player);

  if (numMantles < 1) {
    return;
  }

  const hudOffset1Heart = 41;
  const hudOffset2Heart = hudOffset1Heart + 12;
  const hudOffset3Heart = hudOffset2Heart + 12;
  const hudOffset4Heart = hudOffset3Heart + 12;
  const hudOffset5Heart = hudOffset4Heart + 12;
  const hudOffset6Heart = hudOffset5Heart + 12;

  const hudOffset1Row = 2;
  const hudOffset2Row = hudOffset1Row + 10;

  let xOffset = hudOffset6Heart;
  const yOffset = visibleHearts > 6 ? hudOffset2Row : hudOffset1Row;

  let xHeart = visibleHearts % 6;
  if (xHeart === 0) {
    xHeart = 6;
  }

  if (xHeart <= 1) {
    xOffset = hudOffset1Heart;
  } else if (xHeart === 2) {
    xOffset = hudOffset2Heart;
  } else if (xHeart === 3) {
    xOffset = hudOffset3Heart;
  } else if (xHeart === 4) {
    xOffset = hudOffset4Heart;
  } else if (xHeart === 5) {
    xOffset = hudOffset5Heart;
  } else if (xHeart >= 6) {
    xOffset = hudOffset6Heart;
  }

  if (hasFlag(curses, LevelCurse.CURSE_OF_THE_UNKNOWN)) {
    xOffset = hudOffset1Heart;
  }

  if (character === PlayerType.PLAYER_THELOST) {
    if (extraLives > 0) {
      xOffset += 24;
    }
  }

  const animation = isKeeper(player) ? "Keeper_Mantle" : "Mantle";
  sprite.Play(animation, true);
  const hudOffset = getHUDOffsetVector();
  const heartOffset = Vector(xOffset, yOffset);
  const position = hudOffset.add(heartOffset);
  sprite.Render(position, Vector.Zero, Vector.Zero);
}
