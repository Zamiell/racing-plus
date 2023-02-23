import {
  EffectVariant,
  EntityType,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  doesEntityExist,
  game,
  getPlayers,
  newRNG,
  repeat,
  setSeed,
  sfxManager,
  spawnEffect,
} from "isaacscript-common";
import { RaceStatus } from "../../enums/RaceStatus";
import { g } from "../../globals";
import { mod } from "../../mod";
import { speedrunIsFinished } from "../speedrun/v";

const v = {
  run: {
    numFireworksSpawned: 0,
    rng: newRNG(),
  },
};

export function init(): void {
  mod.saveDataManager("fireworks", v);
}

// ModCallback.POST_UPDATE (1)
export function postUpdate(): void {
  makeFireworksQuieter();

  if (
    (g.raceVars.finished &&
      g.race.status === RaceStatus.IN_PROGRESS &&
      g.race.place === 1 &&
      g.race.numEntrants >= 3) ||
    speedrunIsFinished()
  ) {
    spawnSparkleOnPlayer();
    spawnFireworks();
  }
}

function makeFireworksQuieter() {
  if (!sfxManager.IsPlaying(SoundEffect.BOSS_1_EXPLOSIONS)) {
    return;
  }

  if (doesEntityExist(EntityType.EFFECT, EffectVariant.FIREWORKS)) {
    sfxManager.AdjustVolume(SoundEffect.BOSS_1_EXPLOSIONS, 0.2);
  }
}

function spawnSparkleOnPlayer() {
  for (const player of getPlayers()) {
    const randomVector = RandomVector().mul(10);
    const blingPosition = player.Position.add(randomVector);
    spawnEffect(EffectVariant.ULTRA_GREED_BLING, 0, blingPosition);
  }
}

function spawnFireworks() {
  const gameFrameCount = game.GetFrameCount();
  const room = game.GetRoom();

  // Spawn 30 fireworks. (Some can be duds randomly.)
  if (v.run.numFireworksSpawned < 40 && gameFrameCount % 20 === 0) {
    repeat(5, () => {
      v.run.numFireworksSpawned++;
      const seed = v.run.rng.Next();
      const randomGridIndex = room.GetRandomTileIndex(seed);
      const position = room.GetGridPosition(randomGridIndex);
      const firework = spawnEffect(EffectVariant.FIREWORKS, 0, position);
      firework.SetTimeout(20);
    });
  }
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const seeds = game.GetSeeds();
  const startSeed = seeds.GetStartSeed();
  setSeed(v.run.rng, startSeed);
}
