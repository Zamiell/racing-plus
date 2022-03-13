import {
  addConsoleCommand,
  CHARACTER_MAP,
  getEnumValues,
  getMapPartialMatch,
  log,
  onSetSeed,
  printConsole,
  restart,
} from "isaacscript-common";
import { VERSION } from "../../constants";
import { debugFunction } from "../../debugFunction";
import g from "../../globals";
import { ChallengeCustom } from "../../types/ChallengeCustom";
import { consoleCommand } from "../../utils";
import { unseed } from "../../utilsGlobals";
import { setDevilAngelDebugRoom } from "../optional/major/betterDevilAngelRooms/v";
import * as socketClient from "../race/socketClient";
import { logRaceData, RaceData } from "../race/types/RaceData";
import { RaceFormat } from "../race/types/RaceFormat";
import { RaceGoal } from "../race/types/RaceGoal";
import { RacerStatus } from "../race/types/RacerStatus";
import { RaceStatus } from "../race/types/RaceStatus";
import { speedrunSetNextCharacterAndRestart } from "../speedrun/callbacks/postRender";

const DEFAULT_SEEDED_RACE_STARTING_CHARACTER = PlayerType.PLAYER_ISAAC;
const DEFAULT_SEEDED_RACE_STARTING_ITEMS = [
  CollectibleType.COLLECTIBLE_CRICKETS_HEAD,
];

export function enableExtraConsoleCommandsRacingPlus(): void {
  addConsoleCommand("angelset", angelSet);
  addConsoleCommand("changechar", changeChar);
  addConsoleCommand("debug", debug);
  addConsoleCommand("devilset", devilSet);
  addConsoleCommand("move", move);
  addConsoleCommand("next", next);
  addConsoleCommand("previous", previous);
  addConsoleCommand("race", race);
  addConsoleCommand("rankedsoloreset", rankedSoloReset);
  addConsoleCommand("s0", s0);
  addConsoleCommand("s1", s1);
  addConsoleCommand("s2", s2);
  addConsoleCommand("seededrace", seededRace);
  addConsoleCommand("seededracecharacter", seededRaceCharacter);
  addConsoleCommand("seededracebuild", seededRaceBuild);
  addConsoleCommand("seededraceitem", seededRaceItem);
  addConsoleCommand("seededracegoal", seededRaceGoal);
  addConsoleCommand("seededraceoff", seededRaceOff);
  addConsoleCommand("unseed", unseedCommand);
  addConsoleCommand("version", version);
}

function angelSet(params: string) {
  devilAngelSet(params, false);
}

function devilSet(params: string) {
  devilAngelSet(params, true);
}

function changeChar() {
  consoleCommand(`challenge ${ChallengeCustom.CHANGE_CHAR_ORDER}`);
}

function debug() {
  printConsole("Executing debug function.");
  debugFunction();
}

/** Move the player to a specific position. */
function move() {
  const player = Isaac.GetPlayer();
  const oneByOneRoomRightDoorNextToLoadingZone = Vector(593, 280); // 593 works, 593.1 is too far
  player.Position = oneByOneRoomRightDoorNextToLoadingZone;
}

function next() {
  speedrunSetNextCharacterAndRestart(true);
}

function previous() {
  speedrunSetNextCharacterAndRestart(false);
}

function race() {
  logRaceData(g.race);
  printConsole('Logged the race statistics to the "log.txt" file.');
}

function rankedSoloReset() {
  printConsole("This command has to be performed on the Racing+ client.");
}

function s0() {
  consoleCommand(`challenge ${Challenge.CHALLENGE_NULL}`);
}

function s1() {
  consoleCommand(`challenge ${ChallengeCustom.SEASON_1}`);
  consoleCommand("setcharorder");
}

function s2() {
  consoleCommand(`challenge ${ChallengeCustom.SEASON_2}`);
  consoleCommand("setbuildvetos");
}

function seededRace(params: string) {
  if (params !== "") {
    printConsole(
      'The "seededrace" command does not take any arguments. (Set the seed first before using this command.)',
    );
    return;
  }

  if (!socketClient.isActive() || g.race.status !== RaceStatus.NONE) {
    printConsole(
      'You must be connected to the Racing+ client in order to use the "seededrace" command. (The R+ icon should be green.)',
    );
    return;
  }

  if (!onSetSeed()) {
    printConsole(
      "You are not on a set seed; assuming that you want to use the current seed for the fake seeded race.",
    );
  }

  const startSeedString = g.seeds.GetStartSeedString();

  g.debug = true;
  g.race.status = RaceStatus.IN_PROGRESS;
  g.race.myStatus = RacerStatus.RACING;
  g.race.format = RaceFormat.SEEDED;
  g.race.seed = startSeedString;
  g.race.character = DEFAULT_SEEDED_RACE_STARTING_CHARACTER;
  g.race.startingItems = DEFAULT_SEEDED_RACE_STARTING_ITEMS;

  printConsole(`Enabled seeded race mode for seed: ${startSeedString}`);
  restart(g.race.character);
}

function seededRaceCharacter(params: string) {
  if (params === "") {
    printConsole("You must specify a character name or number.");
    return;
  }

  const num = tonumber(params);
  if (num !== undefined) {
    // Validate the character sub-type
    if (num < 0 || num >= PlayerType.NUM_PLAYER_TYPES) {
      printConsole("That is an invalid player sub-type.");
      return;
    }

    g.race.character = num;
    printConsole(`Set the seeded race character to: ${g.race.character}`);
    restart(g.race.character);
    return;
  }

  const match = getMapPartialMatch(params, CHARACTER_MAP);
  if (match === undefined) {
    printConsole(`Unknown character: ${params}`);
    return;
  }

  g.race.character = match;
  printConsole(`Set the seeded race character to: ${g.race.character}`);
  restart(g.race.character);
}

function seededRaceBuild() {
  printConsole('Use the "seededraceitem" command instead.');
}

function seededRaceItem(params: string) {
  if (params === "") {
    printConsole(
      'You must enter an collectible type. (For example, "114" for Mom\'s Knife, or "245,2" for 20/20 + The Inner Eye.)',
    );
    return;
  }

  const startingItemStrings = params.split(",");
  const startingItems: int[] = [];
  for (const startingItemString of startingItemStrings) {
    const num = tonumber(startingItemString);
    if (num === undefined) {
      printConsole(
        `That is an invalid collectible type: ${startingItemString}`,
      );
      return;
    }
    startingItems.push(num);
  }

  g.race.startingItems = startingItems;
  printConsole(
    `Set the seeded race item(s) to: [${g.race.startingItems.join(",")}]`,
  );
  restart();
}

function seededRaceGoal(params: string) {
  const raceGoals = getEnumValues(RaceGoal);
  if (!raceGoals.includes(params as RaceGoal)) {
    printConsole(`That is an invalid race goal: ${params}`);
    return;
  }

  g.race.goal = params as RaceGoal;
  printConsole(`Set the seeded race goal to: ${g.race.goal}`);
  restart();
}

function seededRaceOff() {
  g.race = new RaceData();
  printConsole("Disabled seeded race mode.");
  unseed();
  restart();
}

function unseedCommand() {
  unseed();
  restart();
}

function version() {
  const msg = `Racing+ version: ${VERSION}`;
  log(msg);
  printConsole(msg);
}

// -----------
// Subroutines
// -----------

function devilAngelSet(params: string, devil: boolean) {
  const roomName = devil ? "Devil" : "Angel";
  if (params === "") {
    printConsole(`You must provide an ${roomName} Room number.`);
  }

  const num = tonumber(params);
  if (num === undefined) {
    printConsole(`That is an invalid ${roomName} Room number.`);
    return;
  }

  setDevilAngelDebugRoom(num);
}
