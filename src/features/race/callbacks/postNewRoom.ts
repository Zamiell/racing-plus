import {
  asLevelStage,
  asNumber,
  inMegaSatanRoom,
  LAST_STAGE,
} from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import * as endOfRaceButtons from "../endOfRaceButtons";
import * as makeBossRushItemsFree from "../makeBossRushItemsFree";
import * as raceRoom from "../raceRoom";
import * as removeRepentanceDoor from "../removeRepentanceDoor";
import * as removeStrangeDoor from "../removeStrangeDoor";
import * as removeVoidDoor from "../removeVoidDoor";
import * as replaceScolex from "../replaceScolex";
import * as seeded3DollarBill from "../seeded3DollarBill";
import * as socket from "../socket";
import * as spawnCorpseTrapdoor from "../spawnCorpseTrapdoor";
import * as startingRoom from "../startingRoom";
import * as topSprite from "../topSprite";
import * as victoryLap from "../victoryLap";

// We take the next stage after the final vanilla stage.
const MEGA_SATAN_FAKE_STAGE_NUM = asLevelStage(asNumber(LAST_STAGE) + 1);

export function racePostNewRoom(): void {
  if (!config.ClientCommunication) {
    return;
  }

  socket.postNewRoom();
  raceRoom.postNewRoom();
  startingRoom.postNewRoom();
  topSprite.postNewRoom();
  spawnCorpseTrapdoor.postNewRoom();
  makeBossRushItemsFree.postNewRoom();
  removeStrangeDoor.postNewRoom();
  removeRepentanceDoor.postNewRoom();
  removeVoidDoor.postNewRoom();
  replaceScolex.postNewRoom();
  seeded3DollarBill.postNewRoom();
  endOfRaceButtons.postNewRoom();
  victoryLap.postNewRoom();
  recordMegaSatanRoom();
}

function recordMegaSatanRoom() {
  if (inMegaSatanRoom()) {
    socket.send("level", `${MEGA_SATAN_FAKE_STAGE_NUM}-0-false`);
  }
}
