import {
  game,
  getCharacterName,
  log,
  ModCallbackCustom,
} from "isaacscript-common";
import { hasErrors } from "../classes/features/mandatory/misc/checkErrors/v";
import { racePostGameStarted } from "../features/race/callbacks/postGameStarted";
import { mod } from "../mod";
import { speedrunResetPersistentVars } from "../speedrun/resetVars";
import { inSpeedrun } from "../speedrun/utilsSpeedrun";

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    main,
    undefined,
  );
}

function main(isContinued: boolean) {
  const seeds = game.GetSeeds();
  const startSeedString = seeds.GetStartSeedString();
  const renderFrameCount = Isaac.GetFrameCount();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const characterName = getCharacterName(character);

  log(
    `POST_GAME_STARTED_REORDERED - Seed: ${startSeedString} - Render frame: ${renderFrameCount} - Continued: ${isContinued} - Character: ${characterName} (${character})`,
  );

  // Make sure that the MinimapAPI is enabled. (We may have disabled it in a previous run.)
  if (MinimapAPI !== undefined) {
    MinimapAPI.Config.Disable = false;
  }

  if (!inSpeedrun()) {
    speedrunResetPersistentVars();
  }

  if (isContinued) {
    return;
  }

  // Check for errors that should prevent the mod from doing anything.
  if (hasErrors()) {
    return;
  }

  // Major
  racePostGameStarted();
}
