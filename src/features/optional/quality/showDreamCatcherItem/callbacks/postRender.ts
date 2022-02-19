import { getEffects, getPlayers } from "isaacscript-common";
import { config } from "../../../../../modConfigMenu";
import { DreamCatcherWarpState } from "../../../../../types/DreamCatcherWarpState";
import { EffectVariantCustom } from "../../../../../types/EffectVariantCustom";
import { centerPlayers } from "../../../../mandatory/centerStart";
import * as sprites from "../sprites";
import v from "../v";

export function showDreamCatcherItemPostRender(): void {
  if (!config.showDreamCatcherItem) {
    return;
  }

  sprites.draw();
  repositionPlayer();
}

function repositionPlayer() {
  if (v.level.warpState !== DreamCatcherWarpState.REPOSITIONING_PLAYER) {
    return;
  }

  v.level.warpState = DreamCatcherWarpState.FINISHED;

  centerPlayers();

  // Fix the bug where the fast-travel pitfalls will be misaligned due to being spawned before the
  // player's position was updated
  const players = getPlayers();
  const customPitfalls = getEffects(EffectVariantCustom.PITFALL_CUSTOM);
  for (let i = 0; i < customPitfalls.length; i++) {
    const pitfall = customPitfalls[i];
    const player = players[i];
    if (pitfall !== undefined && player !== undefined) {
      pitfall.Position = player.Position;
    }
  }
}
