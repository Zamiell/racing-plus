import { Challenge, Difficulty } from "isaac-typescript-definitions";
import { game, log, onSetSeed } from "isaacscript-common";
import { setUnseededWithRacingPlusLogic } from "../../../classes/features/mandatory/RacingPlusIcon";
import {
  isRestartingOnNextFrame,
  restartOnNextFrame,
  setRestartChallenge,
  setRestartCharacter,
  setRestartSeed,
} from "../../../classes/features/mandatory/RestartOnNextFrame";
import { RaceDifficulty } from "../../../enums/RaceDifficulty";
import { RaceFormat } from "../../../enums/RaceFormat";
import { RacerStatus } from "../../../enums/RacerStatus";
import { RaceStatus } from "../../../enums/RaceStatus";
import { g } from "../../../globals";
import { config } from "../../../modConfigMenu";
import * as consistentDevilAngelRooms from "../consistentDevilAngelRooms";
import { formatSetup } from "../formatSetup";
import * as placeLeft from "../placeLeft";
import * as raceRoom from "../raceRoom";
import * as socket from "../socket";
import * as sprites from "../sprites";
import * as startingRoom from "../startingRoom";
import * as topSprite from "../topSprite";

export function racePostGameStarted(): void {
  if (!config.ClientCommunication) {
    return;
  }

  resetRaceVars();
  socket.postGameStarted();
  sprites.resetAll();

  // For race validation purposes, use the 0th player.
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
  consistentDevilAngelRooms.postGameStarted();
}

function resetRaceVars() {
  g.raceVars.finished = false;
  g.raceVars.finishedTime = 0;
}

function validateRace(player: EntityPlayer) {
  return (
    !isRestartingOnNextFrame() &&
    validateInRace() &&
    validateChallenge() &&
    validateDifficulty() &&
    validateSeed() &&
    validateCharacter(player)
  );
}

function validateInRace() {
  // We want to still draw some race-related things even if we have finished or quit the race, so
  // don't check for "g.race.myStatus".
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

  if (challenge !== Challenge.NULL && g.race.format !== RaceFormat.CUSTOM) {
    restartOnNextFrame();
    setRestartChallenge(Challenge.NULL);
    log(
      "Restarting since we are on a custom challenge and this is not a custom race.",
    );
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
    game.Difficulty !== Difficulty.NORMAL &&
    g.race.format !== RaceFormat.CUSTOM
  ) {
    log(
      `Error: Supposed to be on normal mode. (Currently, the difficulty is ${game.Difficulty}.)`,
    );
    topSprite.setErrorHardMode();
    return false;
  }

  if (
    g.race.difficulty === RaceDifficulty.HARD &&
    game.Difficulty !== Difficulty.HARD &&
    g.race.format !== RaceFormat.CUSTOM
  ) {
    log(
      `Error: Supposed to be on hard mode. (Currently, the difficulty is ${game.Difficulty}.)`,
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
    restartOnNextFrame();
    setRestartSeed(g.race.seed);
    return false;
  }

  if (
    (g.race.format === RaceFormat.UNSEEDED ||
      g.race.format === RaceFormat.DIVERSITY) &&
    onSetSeed()
  ) {
    // If the run started with a set seed, change the reset behavior to that of an unseeded run.
    restartOnNextFrame();
    setUnseededWithRacingPlusLogic();
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
    restartOnNextFrame();
    setRestartCharacter(g.race.character);
    return false;
  }

  return true;
}
