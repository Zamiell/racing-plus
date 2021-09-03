import { getPlayers, gridToPos, saveDataManager } from "isaacscript-common";
import g from "../../globals";
import RaceStatus from "../race/types/RaceStatus";
import { speedrunIsFinished } from "../speedrun/v";

const v = {
  run: {
    numFireworksSpawned: 0,
  },
};

export function init(): void {
  saveDataManager("fireworks", v);
}

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
  if (!g.sfx.IsPlaying(SoundEffect.SOUND_BOSS1_EXPLOSIONS)) {
    return;
  }

  // TODO replace with "Isaac.CountEntities()" after the next patch
  const fireworks = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariant.FIREWORKS,
  );
  if (fireworks.length > 0) {
    g.sfx.AdjustVolume(SoundEffect.SOUND_BOSS1_EXPLOSIONS, 0.2);
  }
}

function spawnSparkleOnPlayer() {
  for (const player of getPlayers()) {
    const randomVector = RandomVector().mul(10);
    const blingPosition = player.Position.add(randomVector);
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariant.ULTRA_GREED_BLING,
      0,
      blingPosition,
      Vector.Zero,
      null,
    );
  }
}

function spawnFireworks() {
  const gameFrameCount = g.g.GetFrameCount();

  // Spawn 30 fireworks (1000.104.0)
  // (some can be duds randomly)
  if (v.run.numFireworksSpawned < 40 && gameFrameCount % 20 === 0) {
    for (let i = 0; i < 5; i++) {
      v.run.numFireworksSpawned += 1;
      const fireworkPos = gridToPos(math.random(1, 11), math.random(2, 8));
      const firework = Isaac.Spawn(
        EntityType.ENTITY_EFFECT,
        EffectVariant.FIREWORKS,
        0,
        fireworkPos,
        Vector.Zero,
        null,
      ).ToEffect();
      if (firework !== null) {
        firework.SetTimeout(20);
      }
    }
  }
}
