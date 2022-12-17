import {
  Challenge,
  CollectibleType,
  PlayerType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  asCollectibleType,
  asNumber,
  CHARACTER_NAME_TO_TYPE_MAP,
  copyArray,
  FIRST_CHARACTER,
  getCharacterName,
  getEnumValues,
  getMapPartialMatch,
  LAST_VANILLA_CHARACTER,
  log,
  onSetSeed,
  printConsole,
  restart,
} from "isaacscript-common";
import { logRaceData, RaceData } from "../../classes/RaceData";
import { VERSION } from "../../constants";
import { debugFunction } from "../../debugCode";
import { ChallengeCustom } from "../../enums/ChallengeCustom";
import { RaceFormat } from "../../enums/RaceFormat";
import { RaceGoal } from "../../enums/RaceGoal";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";
import { mod } from "../../mod";
import { setAllModConfigMenuSettings } from "../../modConfigMenu";
import { consoleCommand } from "../../utils";
import { setDevilAngelDebugRoom } from "../optional/major/betterDevilAngelRooms/v";
import * as socketClient from "../race/socketClient";
import { setUnseededWithRacingPlusLogic } from "./racingPlusSprite";

const DEFAULT_SEEDED_RACE_STARTING_ITEMS = [
  CollectibleType.CRICKETS_HEAD,
] as const;

const DEFAULT_DIVERSITY_RACE_STARTING_ITEMS = [
  // Active item
  CollectibleType.POOP,

  // Passive items
  CollectibleType.SAD_ONION,
  CollectibleType.INNER_EYE,
  CollectibleType.SPOON_BENDER,

  // Trinket
  TrinketType.SWALLOWED_PENNY,
] as const;

export function enableExtraConsoleCommandsRacingPlus(): void {
  mod.addConsoleCommand("angelSet", angelSet);
  mod.addConsoleCommand("cco", cco);
  mod.addConsoleCommand("changeCharOrder", changeCharOrder);
  mod.addConsoleCommand("d", debug);
  mod.addConsoleCommand("devilSet", devilSet);
  mod.addConsoleCommand("disable", disable);
  mod.addConsoleCommand("diversityRace", diversityRace);
  mod.addConsoleCommand("diversityRaceCharacter", diversityRaceCharacter);
  mod.addConsoleCommand("enable", enable);
  mod.addConsoleCommand("move", move);
  mod.addConsoleCommand("race", race);
  mod.addConsoleCommand("raceCharacter", raceCharacter);
  mod.addConsoleCommand("rankedSoloReset", rankedSoloReset);
  mod.addConsoleCommand("s0", s0);
  mod.addConsoleCommand("s1", s1);
  mod.addConsoleCommand("s2", s2);
  mod.addConsoleCommand("s3", s3);
  mod.addConsoleCommand("seededRace", seededRace);
  mod.addConsoleCommand("seededRaceCharacter", seededRaceCharacter);
  mod.addConsoleCommand("seededRaceBuild", seededRaceBuild);
  mod.addConsoleCommand("seededRaceItem", seededRaceItem);
  mod.addConsoleCommand("seededRaceGoal", seededRaceGoal);
  mod.addConsoleCommand("seededRaceOff", seededRaceOff);
  mod.addConsoleCommand("seededRaceSeed", seededRaceSeed);
  mod.removeConsoleCommand("unseed");
  mod.addConsoleCommand("unseed", unseedCommand);
  mod.addConsoleCommand("version", version);
}

function angelSet(params: string) {
  devilAngelSet(params, false);
}

/** Alias for the "changecharorder" command. */
function cco() {
  changeCharOrder();
}

function changeCharOrder() {
  consoleCommand(`challenge ${ChallengeCustom.CHANGE_CHAR_ORDER}`);
}

function debug(params: string) {
  printConsole("Executing debug function.");
  debugFunction(params);
}

function devilSet(params: string) {
  devilAngelSet(params, true);
}

function disable() {
  setAllModConfigMenuSettings(false);
}

function diversityRace(params: string) {
  if (params !== "") {
    printConsole(
      'The "diversityRace" command does not take any arguments. (Set the seed first before using this command.)',
    );
    return;
  }

  if (!socketClient.isActive() || g.race.status !== RaceStatus.NONE) {
    printConsole(
      'You must be connected to the Racing+ client in order to use the "diversityRace" command. (The R+ icon should be green.)',
    );
    return;
  }

  if (!onSetSeed()) {
    printConsole(
      "You are not on a set seed; assuming that you want to use the current seed for the fake diversity race.",
    );
  }

  const startSeedString = g.seeds.GetStartSeedString();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  g.debug = true;
  g.race.status = RaceStatus.IN_PROGRESS;
  g.race.myStatus = RacerStatus.RACING;
  g.race.format = RaceFormat.DIVERSITY;
  g.race.seed = startSeedString;
  g.race.character = character;
  g.race.startingItems = copyArray(DEFAULT_DIVERSITY_RACE_STARTING_ITEMS);

  printConsole(`Enabled fake seeded race mode for seed: ${startSeedString}`);
  printConsole(
    "You can go back to normal by using the command of: seededRaceOff",
  );
  restart(g.race.character);
}

function diversityRaceCharacter(params: string) {
  raceCharacter(params);
}

function enable() {
  setAllModConfigMenuSettings(true);
}

/** Move the player to a specific position. */
function move() {
  const player = Isaac.GetPlayer();
  const oneByOneRoomRightDoorNextToLoadingZone = Vector(593, 280); // 593 works, 593.1 is too far
  player.Position = oneByOneRoomRightDoorNextToLoadingZone;
}

function race() {
  logRaceData(g.race);
  printConsole('Logged the race statistics to the "log.txt" file.');
}

function raceCharacter(params: string) {
  if (params === "") {
    printConsole("You must specify a character name or number.");
    return;
  }

  let character: PlayerType;
  const num = tonumber(params) as PlayerType | undefined;
  if (num === undefined) {
    const match = getMapPartialMatch(params, CHARACTER_NAME_TO_TYPE_MAP);
    if (match === undefined) {
      printConsole(`Unknown character: ${params}`);
      return;
    }

    character = match[1];
  } else {
    if (num < FIRST_CHARACTER || num > LAST_VANILLA_CHARACTER) {
      printConsole(`Invalid player sub-type: ${num}`);
      return;
    }

    character = num;
  }

  g.race.character = character;

  const characterName = getCharacterName(character);
  restart(g.race.character);
  printConsole(`Set the race character to: ${characterName} (${character})`);
}

function rankedSoloReset() {
  printConsole("This command has to be performed on the Racing+ client.");
}

function s0() {
  goToChallenge(Challenge.NULL);
}

function s1() {
  goToChallenge(ChallengeCustom.SEASON_1);
}

function s2() {
  goToChallenge(ChallengeCustom.SEASON_2);
}

function s3() {
  goToChallenge(ChallengeCustom.SEASON_3);
}

function goToChallenge(challenge: Challenge) {
  if (asNumber(challenge) === -1) {
    printConsole("That challenge was not found.");
  } else {
    consoleCommand(`challenge ${challenge}`);
  }
}

function seededRace(params: string) {
  if (params !== "") {
    printConsole(
      'The "seededRace" command does not take any arguments. (Set the seed first before using this command.)',
    );
    return;
  }

  if (!socketClient.isActive() || g.race.status !== RaceStatus.NONE) {
    printConsole(
      'You must be connected to the Racing+ client in order to use the "seededRace" command. (The R+ icon should be green.)',
    );
    return;
  }

  if (!onSetSeed()) {
    printConsole(
      "You are not on a set seed; assuming that you want to use the current seed for the fake seeded race.",
    );
  }

  const startSeedString = g.seeds.GetStartSeedString();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  g.debug = true;
  g.race.status = RaceStatus.IN_PROGRESS;
  g.race.myStatus = RacerStatus.RACING;
  g.race.format = RaceFormat.SEEDED;
  g.race.seed = startSeedString;
  g.race.character = character;
  g.race.startingItems = copyArray(DEFAULT_SEEDED_RACE_STARTING_ITEMS);

  printConsole(`Enabled fake seeded race mode for seed: ${startSeedString}`);
  printConsole(
    "You can go back to normal by using the command of: seededRaceOff",
  );
  restart(g.race.character);
}

function seededRaceCharacter(params: string) {
  raceCharacter(params);
}

function seededRaceBuild() {
  printConsole('Use the "seededRaceItem" command instead.');
}

function seededRaceItem(params: string) {
  if (params === "") {
    printConsole(
      'You must enter an collectible type. (For example, "114" for Mom\'s Knife, or "245,2" for 20/20 + The Inner Eye.)',
    );
    return;
  }

  const startingItemStrings = params.split(",");
  const startingItems: CollectibleType[] = [];
  for (const startingItemString of startingItemStrings) {
    const num = tonumber(startingItemString);
    if (num === undefined) {
      printConsole(
        `That is an invalid collectible type: ${startingItemString}`,
      );
      return;
    }
    startingItems.push(asCollectibleType(num));
  }

  g.race.startingItems = startingItems;
  printConsole(
    `Set the seeded race item(s) to: [${g.race.startingItems.join(",")}]`,
  );
  restart();
}

function seededRaceGoal(params: string) {
  const raceGoals = getEnumValues(RaceGoal);
  const raceGoal = params as RaceGoal;
  if (!raceGoals.includes(raceGoal)) {
    printConsole(`That is an invalid race goal: ${params}`);
    return;
  }

  g.race.goal = raceGoal;
  printConsole(`Set the seeded race goal to: ${g.race.goal}`);
  restart();
}

function seededRaceOff() {
  g.race = new RaceData();
  printConsole("Disabled seeded race mode.");
  setUnseededWithRacingPlusLogic();
  restart();
}

function seededRaceSeed(params: string) {
  if (params === "") {
    printConsole("You must specify the seed.");
    return;
  }

  if (params.length !== 9 || params[5] !== " ") {
    printConsole("That is an invalid format for the seed.");
    return;
  }

  g.race.seed = params;

  printConsole(`Set the seeded race seed to: ${params}`);
  restart();
}

function unseedCommand() {
  setUnseededWithRacingPlusLogic();
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
