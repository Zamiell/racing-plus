import { Vector.Zero } from "../constants";
import g from "../globals";
import * as misc from "../misc";
import { EffectVariantCustom } from "../types/enums";

const functionMap = new Map<
  EffectVariant,
  (
    subType: int,
    spawner: Entity,
    initSeed: int,
  ) => [EntityType, EffectVariant, int, int] | null
>();
export default functionMap;

// 19
functionMap.set(
  EffectVariant.CRACK_THE_SKY,
  (subType: int, spawner: Entity, initSeed: int) => {
    // Local variables
    const roomFrameCount = g.r.GetFrameCount();

    // Custom Crack the Sky effect
    if (g.run.room.spawningLight) {
      return null;
    }

    if (
      spawner.Type !== EntityType.ENTITY_WAR && // 65
      spawner.Type !== EntityType.ENTITY_ISAAC // 102
    ) {
      return null;
    }

    const npc = spawner.ToNPC();
    if (npc === null) {
      return null;
    }

    const isaacSpawn = spawner.Type === EntityType.ENTITY_ISAAC;
    if (
      isaacSpawn &&
      npc.State === 9 // The "wave" light beam attack
    ) {
      // Only change the beams of light in the second phase
      return null;
    }

    // Spawn effects randomly in a circle on or around the player
    let maxDist = 150;
    if (isaacSpawn) {
      maxDist = 100;
    }

    let redoPos: boolean;
    let newPosition: Vector;
    do {
      redoPos = false;

      const randomDistance = math.random(0, maxDist);
      const randomVector = RandomVector().__mul(randomDistance);
      newPosition = randomVector.__add(g.p.Position);
      newPosition = g.r.GetClampedPosition(newPosition, 10);

      // Try to avoid respawning this effect where another one already spawned
      for (const lightDescription of g.run.room.lightPositions) {
        if (
          roomFrameCount - lightDescription.frame <= 60 &&
          newPosition.Distance(lightDescription.position) <= 20
        ) {
          redoPos = true;
          break;
        }
      }

      // Try to avoid respawning this effect on top of who spawned it
      if (newPosition.Distance(spawner.Position) <= 20) {
        redoPos = true;
      }
    } while (redoPos);

    // Spawn an extra light effect
    // (so that Isaac spawns 4 lights instead of 2, which makes things more interesting)
    if (isaacSpawn && !g.run.room.spawningExtraLight) {
      g.run.room.spawningExtraLight = true;
      const newSeed = misc.incrementRNG(initSeed);
      g.g.Spawn(
        EntityType.ENTITY_EFFECT,
        EffectVariant.CRACK_THE_SKY,
        newPosition,
        Vector.Zero,
        spawner,
        subType,
        newSeed,
      );
      g.run.room.spawningExtraLight = false;
    }

    g.run.room.lightPositions.push({
      frame: roomFrameCount,
      position: newPosition,
    });

    newPosition = g.r.GetClampedPosition(newPosition, 10);

    const effect = g.g.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariantCustom.CRACK_THE_SKY_BASE,
      newPosition,
      Vector.Zero,
      spawner,
      subType,
      initSeed,
    );
    const data = effect.GetData();
    const sprite = effect.GetSprite();
    effect.ClearEntityFlags(EntityFlag.FLAG_APPEAR);
    effect.RenderZOffset = -10000;
    sprite.Play("DelayedAppear", true);

    data.CrackSkySpawnPosition = newPosition;
    data.CrackSkySpawnSpawner = spawner;

    return [EntityType.ENTITY_EFFECT, 0, 0, 0];
  },
);

// 22
functionMap.set(
  EffectVariant.CREEP_RED,
  (subType: int, _spawner: Entity, initSeed: int) => {
    // Change enemy red creep to green
    return [
      EntityType.ENTITY_EFFECT,
      EffectVariant.CREEP_GREEN,
      subType,
      initSeed,
    ];
  },
);

// 51
functionMap.set(
  EffectVariant.HOT_BOMB_FIRE,
  (subType: int, spawner: Entity, initSeed: int) => {
    if (
      subType !== 0 && // Enemy fires are never subtype 0
      spawner.Type === EntityType.ENTITY_TEAR
    ) {
      // Fix the bug where Fire Mind fires from Fire Mind tears from Angelic Prism will damage the
      // player
      return [
        EntityType.ENTITY_EFFECT,
        EffectVariant.HOT_BOMB_FIRE,
        0,
        initSeed,
      ];
    }

    return null;
  },
);

// 53
functionMap.set(
  EffectVariant.PLAYER_CREEP_GREEN,
  (subType: int, spawner: Entity, initSeed: int) => {
    // Ignore creep generated from Lil Spewer
    if (
      spawner !== null &&
      spawner.Type === EntityType.ENTITY_FAMILIAR &&
      spawner.Variant === FamiliarVariant.LIL_SPEWER
    ) {
      return null;
    }

    // Change player green creep to blue
    return [
      EntityType.ENTITY_EFFECT,
      EffectVariant.PLAYER_CREEP_HOLYWATER_TRAIL,
      subType,
      initSeed,
    ];
  },
);
