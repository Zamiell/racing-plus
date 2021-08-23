import { log, onSetSeed } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import formatSetup from "../formatSetup";
import * as placeLeft from "../placeLeft";
import * as raceRoom from "../raceRoom";
import * as seededDeath from "../seededDeath";
import * as socket from "../socket";
import * as socketFunctions from "../socketFunctions";
import * as sprites from "../sprites";
import * as startingRoom from "../startingRoom";
import * as topSprite from "../topSprite";
import RaceDifficulty from "../types/RaceDifficulty";
import RaceFormat from "../types/RaceFormat";
import RacerStatus from "../types/RacerStatus";
import RaceStatus from "../types/RaceStatus";

export default function racePostGameStarted(): void {
  if (!config.clientCommunication) {
    return;
  }

  resetRaceVars();
  socket.postGameStarted();
  seededDeath.postGameStarted();
  sprites.resetAll();

  // For race validation purposes, use the 0th player
  const player = Isaac.GetPlayer();

  if (!validateRace(player)) {
    return;
  }
  socket.send("runMatchesRuleset");

  formatSetup(player);
  raceRoom.initSprites();
  startingRoom.initSprites();
  topSprite.postGameStarted();
  placeLeft.postGameStarted();
}

function resetRaceVars() {
  // If we finished a race and we reset,
  // we don't want to show any of the graphics on the starting screen
  // Clear out all of the race data to defaults
  // (the client will only explicitly reset the race data if we navigate back to the lobby)
  if (g.raceVars.finished) {
    socketFunctions.reset();
  }

  g.raceVars.finished = false;
  g.raceVars.finishedTime = 0;
}

function validateRace(player: EntityPlayer) {
  return (
    validateInRace() &&
    validateChallenge() &&
    validateDifficulty() &&
    validateSeed() &&
    validateCharacter(player)
  );
}

function validateInRace() {
  // We want to still draw some race-related things even if we have finished or quit the race,
  // so don't check for "g.race.myStatus"
  return g.race.status !== RaceStatus.NONE;
}

function validateChallenge() {
  if (
    g.race.myStatus !== RacerStatus.NOT_READY &&
    g.race.myStatus !== RacerStatus.READY &&
    g.race.myStatus !== RacerStatus.RACING
  ) {
    return true;
  }

  const challenge = Isaac.GetChallenge();

  if (
    challenge !== Challenge.CHALLENGE_NULL &&
    g.race.format !== RaceFormat.CUSTOM
  ) {
    g.run.restart = true;
    return false;
  }

  return true;
}

function validateDifficulty() {
  if (
    g.race.myStatus !== RacerStatus.NOT_READY &&
    g.race.myStatus !== RacerStatus.READY &&
    g.race.myStatus !== RacerStatus.RACING
  ) {
    return true;
  }

  if (
    g.race.difficulty === RaceDifficulty.NORMAL &&
    g.g.Difficulty !== Difficulty.DIFFICULTY_NORMAL &&
    g.race.format !== RaceFormat.CUSTOM
  ) {
    log(
      `Error: Supposed to be on normal mode. (Currently, the difficulty is ${g.g.Difficulty}.)`,
    );
    topSprite.setErrorHardMode();
    return false;
  }

  if (
    g.race.difficulty === RaceDifficulty.HARD &&
    g.g.Difficulty !== Difficulty.DIFFICULTY_HARD &&
    g.race.format !== RaceFormat.CUSTOM
  ) {
    log(
      `Error: Supposed to be on hard mode. (Currently, the difficulty is ${g.g.Difficulty}.)`,
    );
    topSprite.setErrorNormalMode();
    return false;
  }

  return true;
}

function validateSeed() {
  if (
    g.race.myStatus !== RacerStatus.NOT_READY &&
    g.race.myStatus !== RacerStatus.READY &&
    g.race.myStatus !== RacerStatus.RACING
  ) {
    return true;
  }

  const startSeedString = g.seeds.GetStartSeedString();

  if (
    g.race.format === RaceFormat.SEEDED &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    startSeedString !== g.race.seed
  ) {
    g.run.restart = true;
    return false;
  }

  if (
    (g.race.format === RaceFormat.UNSEEDED ||
      g.race.format === RaceFormat.DIVERSITY) &&
    onSetSeed()
  ) {
    // If the run started with a set seed,
    // this will change the reset behavior to that of an unseeded run
    g.seeds.Reset();

    g.run.restart = true;
    return false;
  }

  return true;
}

function validateCharacter(player: EntityPlayer) {
  if (
    g.race.myStatus !== RacerStatus.NOT_READY &&
    g.race.myStatus !== RacerStatus.READY &&
    g.race.myStatus !== RacerStatus.RACING
  ) {
    return true;
  }

  const character = player.GetPlayerType();

  if (character !== g.race.character && g.race.format !== RaceFormat.CUSTOM) {
    g.run.restart = true;
    return false;
  }

  return true;
}
