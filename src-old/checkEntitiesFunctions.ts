/*
const functionMap = new Map<int, (entity: Entity) => void>();
export default functionMap;

/*
// EntityType.ENTITY_THE_HAUNT (260)
functionMap.set(260, (entity) => {
  // We only care about Lil' Haunts (260.10)
  if (entity.Variant !== 10) {
    return;
  }
  const npc = entity.ToNPC();

  // Add them to the table so that we can track them
  const index = GetPtrHash(npc); // It is safer to use "GetPtrHash()" than "npc.Index"
  if (g.run.currentLilHaunts[index] === null) {
    // This can't be in the NPC_UPDATE callback because it does ! fire during the "Appear" animation
    // This can't be in the PostNPCInit callback because the position is always equal to (0, 0)
    // there
    g.run.currentLilHaunts[index] = {
      index = npc.Index,
      pos = npc.Position,
      ptr = EntityPtr(npc),
    };
    const string = `Added a Lil' Haunt with index ${index} to the table (with `;
    if (npc.Parent === null) {
      string += "no";
    } else {
      string += "a";
      g.run.currentLilHaunts[index].parentIndex = npc.Parent.Index;
    }
    string += " parent).";
    Isaac.DebugString(string);
  }

  // Remove invulnerability frames from Lil' Haunts that are ! attached to a Haunt
  // (we can't ) { it any earlier than the 4th frame because it will introduce additional bugs,
  // such as the Lil' Haunt becoming invisible)
  if (npc.Parent === null && npc.FrameCount === 4) {
    // Changing the NPC's state triggers the invulnerability removal in the next frame
    npc.State = NpcState.STATE_MOVE; // 4

    // Additionally, we also have to manually set the collision, because
    // tears will pass through Lil' Haunts when they first spawn
    npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL; // 4

    Isaac.DebugString(
      `Removed invulnerability frames && set collision for a Lil' Haunt with index. ${npc.Index.toString()}`,
    );
  }

  // Lock newly spawned Lil' Haunts in place so that they don't immediately rush the player
  if (npc.State === NpcState.STATE_MOVE && npc.FrameCount <= 16) {
    npc.Position = g.run.room.currentLilHaunts[index].pos;
    npc.Velocity = Vector.Zero;
  }
});



// EntityType.ENTITY_RACE_TROPHY
CheckEntities.functions[EntityType.ENTITY_RACE_TROPHY] = function(entity)
  // We can't check in the NPC_UPDATE callback since it will ! fire during the "Appear" animation

  // Don't check anything if ( we have already finished the race / speedrun
  if ( g.raceVars.finished ||
     Speedrun.finished ) {

    return
  }

  // Check to see if ( we are touching the trophy
  if ( g.p.Position.Distance(entity.Position) > 24 ) { // 25 is a touch too big
    return
  }

  // We should ! be able to finish the race if ( we died at the same time as defeating the } boss
  if ( g.p.IsDead() ) {
    return
  }

  // We should ! be able to finish the race while we are in ghost form
  if ( g.run.seededDeath.state === SeededDeath.state.GHOST_FORM ) {
    return
  }


  entity.Remove()
  g.p.AnimateCollectible(CollectibleType.COLLECTIBLE_TROPHY, "Pickup", "PlayerPickupSparkle2")

  if ( Isaac.GetChallenge() === Challenge.CHALLENGE_NULL ) { // 0
    Race.Finish()
  } else {
    Speedrun.Finish()
  }
}
*/
