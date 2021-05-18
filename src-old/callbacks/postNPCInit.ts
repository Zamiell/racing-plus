// In this callback, an NPC's position will not be initialized yet

import { Vector.Zero } from "../constants";
import g from "../globals";

// EntityType.ENTITY_BABY (38)
export function baby(npc: EntityNPC): void {
  if (g.run.spawningAngel) {
    return;
  }

  // We only want to replace Babies on the Isaac fight
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  if (stage !== 10 || roomType !== RoomType.ROOM_BOSS) {
    return;
  }

  // Get the position of the boss
  const isaacs = Isaac.FindByType(
    EntityType.ENTITY_ISAAC,
    -1,
    -1,
    false,
    false,
  );
  if (isaacs.length === 0) {
    return;
  }
  const isaacPos = isaacs[1].Position;

  let position;
  do {
    // Get a random position on the edge of a circle around Isaac
    // (2.5 grid squares = 100)
    const randomCirclePosition = RandomVector().Normalized().__mul(100);
    position = isaacPos.__add(randomCirclePosition);

    // We want to ensure that we do not spawn a Baby too close to the player
  } while (position.Distance(g.p.Position) <= 80);

  g.run.spawningAngel = true;
  g.g.Spawn(
    npc.Type,
    npc.Variant,
    position,
    Vector.Zero,
    null,
    npc.SubType,
    npc.InitSeed,
  );
  g.run.spawningAngel = false;
  npc.Remove();
}

// EntityType.ENTITY_THE_HAUNT (260)
export function theHaunt(npc: EntityNPC): void {
  // Speed up the first Lil' Haunt (260.10) attached to a Haunt (2/3)
  if (npc.Variant === 10 && npc.Parent !== null) {
    // This will only target Lil' Haunts that are attached to a Haunt
    // If we change Lil' Haunts that are not attached to a Haunt to an idle state during their
    // appear animation, they will turn into bosses for some reason and show the boss health bars
    // at the bottom of the screen

    // Change it from NpcState.STATE_INIT to NpcState.STATE_IDLE
    // For Lil' Haunts attached to a Haunt, we still have to manually set them to
    // NpcState.STATE_MOVE, but it produces cleaner results when you go from 3 to 4 rather than
    // from 0 to 4
    npc.State = NpcState.STATE_IDLE;

    // Keeping Lil' Haunts in place is next handled in the "checkEntities" file
    // Speeding up the first Lil' Haunt is next handled in the "postUpdate.checkHauntSpeedup()"
    // function
  }
}
