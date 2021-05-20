import g from "../../globals";
import { consoleCommand } from "../../misc";

export function checkRestartWrongCharacter(): boolean {
  if (g.race.status === "none" || g.race.rFormat === "custom") {
    return false;
  }

  const character = g.p.GetPlayerType();

  if (character !== g.race.character) {
    consoleCommand(`restart ${g.race.character}`);
    return true;
  }

  return false;
}

export function checkRestartWrongSeed(): boolean {
  if (g.race.rFormat !== "seeded" || g.race.status !== "in progress") {
    return false;
  }

  const startSeedString = g.seeds.GetStartSeedString();

  if (startSeedString !== g.race.seed) {
    // This command will change the seed of the run and restart the game
    consoleCommand(`seed ${g.race.seed}`);

    return true;
  }

  return false;
}
