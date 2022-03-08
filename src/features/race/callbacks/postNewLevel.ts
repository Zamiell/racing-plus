import { anyPlayerIs, getRandom } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import * as megaSatan from "../megaSatan";
import * as socket from "../socket";
import { inSeededRace } from "../v";

const CHARACTERS_THAT_ALWAYS_GET_ANGEL_ROOMS = [
  PlayerType.PLAYER_BETHANY,
  PlayerType.PLAYER_MAGDALENE_B,
];

export function racePostNewLevel(): void {
  if (!config.clientCommunication) {
    return;
  }

  socket.postNewLevel();
  megaSatan.postNewLevel();
  setSeededRaceConsistentDevilAngelRooms();
}

/**
 * In seeded races, players will get either all Devil Rooms or all Angel Rooms, with a 50% chance
 * of each based on the starting seed of the run.
 */
function setSeededRaceConsistentDevilAngelRooms() {
  if (!inSeededRace()) {
    return;
  }

  // This mechanic should not apply to Ranked Solo runs
  if (g.race.ranked && g.race.solo) {
    return;
  }

  const startSeed = g.seeds.GetStartSeed();
  const randomChance = getRandom(startSeed);
  let devil = randomChance < 0.5;
  if (anyPlayerIs(...CHARACTERS_THAT_ALWAYS_GET_ANGEL_ROOMS)) {
    devil = false;
  }

  if (devil) {
    g.l.InitializeDevilAngelRoom(false, true);
  } else {
    g.l.InitializeDevilAngelRoom(true, false);
  }
}
