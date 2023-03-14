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
  game,
  getCharacterName,
  getEnumValues,
  getMapPartialMatch,
  LAST_VANILLA_CHARACTER,
  logAndPrint,
  onSetSeed,
  restart,
} from "isaacscript-common";
import { setUnseededWithRacingPlusLogic } from "./classes/features/mandatory/misc/RacingPlusIcon";
import { setDevilAngelDebugRoom } from "./classes/features/optional/major/BetterDevilAngelRooms";
import { speedrunSetCharacterNum } from "./classes/features/speedrun/characterProgress/v";
import { logRaceData, RaceData } from "./classes/RaceData";
import { VERSION } from "./constants";
import { debugFunction } from "./debugCode";
import { ChallengeCustom } from "./enums/ChallengeCustom";
import { RaceFormat } from "./enums/RaceFormat";
import { RaceGoal } from "./enums/RaceGoal";
import { RacerStatus } from "./enums/RacerStatus";
import { RaceStatus } from "./enums/RaceStatus";
import * as socketClient from "./features/race/socketClient";
import { g } from "./globals";
import { mod } from "./mod";
import { setAllModConfigMenuSettings } from "./modConfigMenu";
import { consoleCommand } from "./utils";

const DEFAULT_SEEDED_RACE_STARTING_ITEMS = [
  CollectibleType.CRICKETS_HEAD,
] as const;

const DEFAULT_DIVERSITY_RACE_STARTING_ITEMS = [
  // Active item
  CollectibleType.GLOWING_HOUR_GLASS,

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
  mod.addConsoleCommand("disableAllSettings", disableAllSettings);
  mod.addConsoleCommand("diversityRace", diversityRace);
  mod.addConsoleCommand("diversityRaceCharacter", diversityRaceCharacter);
  mod.addConsoleCommand("diversityRaceOff", diversityRaceOff);
  mod.addConsoleCommand("enableAllSettings", enableAllSettings);
  mod.addConsoleCommand("race", race);
  mod.addConsoleCommand("raceCharacter", raceCharacter);
  mod.addConsoleCommand("rankedSoloReset", rankedSoloReset);
  mod.addConsoleCommand("s0", s0);
  mod.addConsoleCommand("s1", s1);
  mod.addConsoleCommand("s2", s2);
  mod.addConsoleCommand("s3", s3);
  mod.addConsoleCommand("s4", s4);
  mod.addConsoleCommand("seededRace", seededRace);
  mod.addConsoleCommand("seededRaceCharacter", seededRaceCharacter);
  mod.addConsoleCommand("seededRaceBuild", seededRaceBuild);
  mod.addConsoleCommand("seededRaceItem", seededRaceItem);
  mod.addConsoleCommand("seededRaceGoal", seededRaceGoal);
  mod.addConsoleCommand("seededRaceOff", seededRaceOff);
  mod.addConsoleCommand("seededRaceSeed", seededRaceSeed);
  mod.addConsoleCommand("speedrunChar", speedrunChar);
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
  print("Going to: Change Char Order");
}

function debug(params: string) {
  print("Executing debug function.");
  debugFunction(params);
}

function devilSet(params: string) {
  devilAngelSet(params, true);
}

function disableAllSettings() {
  setAllModConfigMenuSettings(false);
  print("Disabled all settings in Mod Config Menu.");
}

function diversityRace(params: string) {
  if (params !== "") {
    print(
      'The "diversityRace" command does not take any arguments. (Set the seed first before using this command.)',
    );
    return;
  }

  if (!socketClient.isActive() || g.race.status !== RaceStatus.NONE) {
    print(
      'You must be connected to the Racing+ client in order to use the "diversityRace" command. (The R+ icon should be green.)',
    );
    return;
  }

  if (!onSetSeed()) {
    print(
      "You are not on a set seed; assuming that you want to use the current seed for the fake diversity race.",
    );
  }

  const seeds = game.GetSeeds();
  const startSeedString = seeds.GetStartSeedString();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  g.debug = true;
  g.race.status = RaceStatus.IN_PROGRESS;
  g.race.myStatus = RacerStatus.RACING;
  g.race.format = RaceFormat.DIVERSITY;
  g.race.seed = startSeedString;
  g.race.character = character;
  g.race.startingItems = copyArray(DEFAULT_DIVERSITY_RACE_STARTING_ITEMS);

  print(`Enabled fake diversity race mode for seed: ${startSeedString}`);
  print("You can go back to normal by using the command of: diversityRaceOff");
  restart(g.race.character);
}

function diversityRaceCharacter(params: string) {
  raceCharacter(params);
}

function diversityRaceOff() {
  g.race = new RaceData();
  print("Disabled diversity race mode.");
  setUnseededWithRacingPlusLogic();
  restart();
}

function enableAllSettings() {
  setAllModConfigMenuSettings(true);
  print("Enabled all settings in Mod Config Menu.");
}

function race() {
  logRaceData(g.race);
  print('Logged the race statistics to the "log.txt" file.');
}

function raceCharacter(params: string) {
  if (params === "") {
    print("You must specify a character name or number.");
    return;
  }

  let character: PlayerType;
  const num = tonumber(params) as PlayerType | undefined;
  if (num === undefined) {
    const match = getMapPartialMatch(params, CHARACTER_NAME_TO_TYPE_MAP);
    if (match === undefined) {
      print(`Unknown character: ${params}`);
      return;
    }

    character = match[1];
  } else {
    if (num < FIRST_CHARACTER || num > LAST_VANILLA_CHARACTER) {
      print(`Invalid player sub-type: ${num}`);
      return;
    }

    character = num;
  }

  g.race.character = character;

  const characterName = getCharacterName(character);
  restart(g.race.character);
  print(`Set the race character to: ${characterName} (${character})`);
}

function rankedSoloReset() {
  print("This command has to be performed on the Racing+ client.");
}

function s0() {
  goToChallenge(Challenge.NULL);
  print("Going to: [no challenge]");
}

function s1() {
  goToChallenge(ChallengeCustom.SEASON_1);
  print("Going to: R+7 Season 1");
}

function s2() {
  goToChallenge(ChallengeCustom.SEASON_2);
  print("Going to: R+7 Season 2");
}

function s3() {
  goToChallenge(ChallengeCustom.SEASON_3);
  print("Going to: R+7 Season 3");
}

function s4() {
  goToChallenge(ChallengeCustom.SEASON_4);
  print("Going to: R+7 Season 4");
}

function goToChallenge(challenge: Challenge) {
  if (asNumber(challenge) === -1) {
    print("That challenge was not found.");
  } else {
    consoleCommand(`challenge ${challenge}`);
  }
}

function seededRace(params: string) {
  if (params !== "") {
    print(
      'The "seededRace" command does not take any arguments. (Set the seed first before using this command.)',
    );
    return;
  }

  if (!socketClient.isActive() || g.race.status !== RaceStatus.NONE) {
    print(
      'You must be connected to the Racing+ client in order to use the "seededRace" command. (The R+ icon should be green.)',
    );
    return;
  }

  if (!onSetSeed()) {
    print(
      "You are not on a set seed; assuming that you want to use the current seed for the fake seeded race.",
    );
  }

  const seeds = game.GetSeeds();
  const startSeedString = seeds.GetStartSeedString();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  g.debug = true;
  g.race.status = RaceStatus.IN_PROGRESS;
  g.race.myStatus = RacerStatus.RACING;
  g.race.format = RaceFormat.SEEDED;
  g.race.seed = startSeedString;
  g.race.character = character;
  g.race.startingItems = copyArray(DEFAULT_SEEDED_RACE_STARTING_ITEMS);

  print(`Enabled fake seeded race mode for seed: ${startSeedString}`);
  print("You can go back to normal by using the command of: seededRaceOff");
  restart(g.race.character);
}

function seededRaceCharacter(params: string) {
  raceCharacter(params);
}

function seededRaceBuild() {
  print('Use the "seededRaceItem" command instead.');
}

function seededRaceItem(params: string) {
  if (params === "") {
    print(
      'You must enter an collectible type. (For example, "114" for Mom\'s Knife, or "245,2" for 20/20 + The Inner Eye.)',
    );
    return;
  }

  const startingItemStrings = params.split(",");
  const startingItems: CollectibleType[] = [];
  for (const startingItemString of startingItemStrings) {
    const num = tonumber(startingItemString);
    if (num === undefined) {
      print(`That is an invalid collectible type: ${startingItemString}`);
      return;
    }
    startingItems.push(asCollectibleType(num));
  }

  g.race.startingItems = startingItems;
  print(`Set the seeded race item(s) to: [${g.race.startingItems.join(",")}]`);
  restart();
}

function seededRaceGoal(params: string) {
  const raceGoals = getEnumValues(RaceGoal);
  const raceGoal = params as RaceGoal;
  if (!raceGoals.includes(raceGoal)) {
    print(`That is an invalid race goal: ${params}`);
    return;
  }

  g.race.goal = raceGoal;
  print(`Set the seeded race goal to: ${g.race.goal}`);
  restart();
}

function seededRaceOff() {
  g.race = new RaceData();
  print("Disabled seeded race mode.");
  setUnseededWithRacingPlusLogic();
  restart();
}

function seededRaceSeed(params: string) {
  if (params === "") {
    print("You must specify the seed.");
    return;
  }

  if (params.length !== 9 || params[5] !== " ") {
    print("That is an invalid format for the seed.");
    return;
  }

  g.race.seed = params;

  print(`Set the seeded race seed to: ${params}`);
  restart();
}

function speedrunChar(params: string) {
  if (params === "") {
    print("You must specify a character number.");
    return;
  }

  const num = tonumber(params);
  if (num === undefined) {
    print("That is an invalid character number.");
    return;
  }

  speedrunSetCharacterNum(num);
}

function unseedCommand() {
  setUnseededWithRacingPlusLogic();
  restart();
}

function version() {
  const msg = `Racing+ version: ${VERSION}`;
  logAndPrint(msg);
}

// -----------
// Subroutines
// -----------

function devilAngelSet(params: string, devil: boolean) {
  const roomName = devil ? "Devil" : "Angel";
  if (params === "") {
    print(`You must provide an ${roomName} Room number.`);
  }

  const num = tonumber(params);
  if (num === undefined) {
    print(`That is an invalid ${roomName} Room number.`);
    return;
  }

  setDevilAngelDebugRoom(num);
  print(`Set ${roomName} Room number to: ${num}`);
}