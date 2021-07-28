import g from "../../globals";
import { getPlayers, gridToPos } from "../../utilGlobals";

export function postUpdate(): void {
  makeFireworksQuieter();

  if (
    (g.raceVars.finished &&
      g.race.status === "in progress" &&
      g.race.place === 1 &&
      g.race.numEntrants >= 3) ||
    g.speedrun.finished
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
  if (g.run.fireworksSpawned < 40 && gameFrameCount % 20 === 0) {
    for (let i = 0; i < 5; i++) {
      g.run.fireworksSpawned += 1;
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
