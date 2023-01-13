import {
  game,
  getEffects,
  getPlayers,
  movePlayersToCenter,
  setFloorDisplayFlags,
  setPlayerHealth,
} from "isaacscript-common";
import { DreamCatcherWarpState } from "../../../../../enums/DreamCatcherWarpState";
import { EffectVariantCustom } from "../../../../../enums/EffectVariantCustom";
import { mod } from "../../../../../mod";
import { config } from "../../../../../modConfigMenu";
import * as sprites from "../sprites";
import { DREAM_CATCHER_FEATURE_NAME, v } from "../v";
import { checkStartDreamCatcherWarp } from "../warp";

export function showDreamCatcherItemPostRender(): void {
  if (!config.showDreamCatcherItem) {
    return;
  }

  checkArrivedFloor();
  sprites.draw();
  repositionPlayer();
}

function checkArrivedFloor() {
  if (!v.level.arrivedOnNewFloor) {
    return;
  }
  v.level.arrivedOnNewFloor = false;

  checkStartDreamCatcherWarp();
}

function repositionPlayer() {
  if (v.level.warpState !== DreamCatcherWarpState.REPOSITIONING_PLAYER) {
    return;
  }

  v.level.warpState = DreamCatcherWarpState.FINISHED;

  const hud = game.GetHUD();

  movePlayersToCenter();

  // Fix the bug where the fast-travel pitfalls will be misaligned due to being spawned before the
  // player's position was updated.
  const customPitfalls = getEffects(EffectVariantCustom.PITFALL_CUSTOM);
  const players = getPlayers();
  customPitfalls.forEach((pitfall, i) => {
    const player = players[i];
    if (player !== undefined) {
      pitfall.Position = player.Position;
    }
  });

  setFloorDisplayFlags(v.level.floorDisplayFlags);

  // Restore the player's health.
  const player = Isaac.GetPlayer();
  if (v.level.health !== null) {
    setPlayerHealth(player, v.level.health);
  }

  hud.SetVisible(true);

  mod.enableAllSound(DREAM_CATCHER_FEATURE_NAME);
}
