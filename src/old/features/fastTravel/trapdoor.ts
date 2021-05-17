import { ChallengeCustom } from "../../challenges/enums";
import { ZERO_VECTOR } from "../../constants";
import g from "../../globals";
import * as misc from "../../misc";
import * as sprites from "../../sprites";
import { EffectVariantCustom } from "../../types/enums";
import * as seededFloors from "../seededFloors";
import {
  FADE_TO_BLACK_FRAMES,
  FastTravelState,
  JUMP_UP_ANIMATION_FRAME_LENGTH,
} from "./constants";

// Called from the "CheckEntities.Grid()" and "CheckEntities.NonGrid()" functions
export function replace(entity: Entity | GridEntity, gridIndex: int): void {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const roomFrameCount = g.r.GetFrameCount();
  const challenge = Isaac.GetChallenge();

  // There is no way to manually travel to the "Infinite Basements" Easter Egg floors,
  // so just disable the fast-travel feature
  if (g.seeds.HasSeedEffect(SeedEffect.SEED_INFINITE_BASEMENT)) {
    return;
  }

  // Don't replace anything in The Void portal room
  if (roomIndex === GridRooms.ROOM_THE_VOID_IDX) {
    return;
  }

  let deleteAndDontReplace = false;

  // Delete the Womb trapdoor that spawns after Mom if the goal of the run is the Boss Rush
  if (
    stage === 6 &&
    ((g.race.status === "in progress" && g.race.goal === "Boss Rush") ||
      (challenge === ChallengeCustom.R7_SEASON_7 &&
        g.season7.remainingGoals.includes("Boss Rush") &&
        g.season7.remainingGoals.length === 1))
  ) {
    deleteAndDontReplace = true;
  }

  // Delete the "natural" trapdoor that spawns one frame after It Lives! (or Hush) is killed
  // (it spawns after one frame because of fast-clear; on vanilla it spawns after a long delay)
  if (gameFrameCount === g.run.itLivesKillFrame + 1) {
    deleteAndDontReplace = true;
  }

  if (deleteAndDontReplace) {
    (entity as GridEntity).Sprite = Sprite(); // If we don't do this, it will still show for a frame
    g.r.RemoveGridEntity(gridIndex, 0, false); // gridEntity.Destroy() does not work
    return;
  }

  // Spawn a custom entity to emulate the original
  let trapdoor: EntityEffect | null;
  if (roomIndex === GridRooms.ROOM_BLUE_WOOM_IDX) {
    trapdoor = Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariantCustom.BLUE_WOMB_TRAPDOOR_FAST_TRAVEL,
      0,
      entity.Position,
      ZERO_VECTOR,
      null,
    ).ToEffect();
  } else if (stage === 6 || stage === 7) {
    trapdoor = Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariantCustom.WOMB_TRAPDOOR_FAST_TRAVEL,
      0,
      entity.Position,
      ZERO_VECTOR,
      null,
    ).ToEffect();
  } else {
    trapdoor = Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariantCustom.TRAPDOOR_FAST_TRAVEL,
      0,
      entity.Position,
      ZERO_VECTOR,
      null,
    ).ToEffect();
  }

  if (trapdoor === null) {
    error("Failed to spawn the trapdoor.");
  }

  // This is needed so that the entity will not appear on top of the player
  trapdoor.DepthOffset = -100;

  if (roomFrameCount > 1) {
    const data = trapdoor.GetData();
    data.fresh = true; // Mark that it should be open even if the room is not cleared
  }

  // The custom entity will not respawn if we leave the room,
  // so we need to keep track of it for the remainder of the floor
  g.run.level.replacedTrapdoors.push({
    room: roomIndex,
    pos: entity.Position,
  });

  // Spawn the trapdoor closed by default
  let closed = true;
  if (
    // After Satan, there is no reason to remain in Sheol
    // After Blue Baby in an "Everything" race, there is no reason to remain on The Chest
    (stage === 10 || stage === 11) &&
    // We only want it to apply to Boss rooms because it looks buggy if the trapdoor snaps open in
    // I AM ERROR rooms
    roomType === RoomType.ROOM_BOSS
  ) {
    closed = false;
  }
  if (closed) {
    trapdoor.State = 1;
    trapdoor.GetSprite().Play("Closed", true);
  }

  // Remove the original entity
  if (gridIndex === -1) {
    // We are replacing a Big Chest
    (entity as Entity).Remove();
  } else {
    // We are replacing a trapdoor grid entity
    (entity as GridEntity).Sprite = Sprite(); // If we don't do this, it will still show for a frame
    g.r.RemoveGridEntity(gridIndex, 0, false); // entity.Destroy() does not work
  }
}

// Called from the PostRender callback
export function checkState(): void {
  // Fix the bug where Dr. Fetus bombs can be shot while jumping
  if (g.run.trapdoor.state > FastTravelState.DISABLED) {
    g.p.FireDelay = 1;
  }

  switch (g.run.trapdoor.state) {
    case FastTravelState.PLAYER_ANIMATION: {
      checkStatePlayerAnimation();
      break;
    }

    case FastTravelState.FADING_TO_BLACK: {
      checkStateFadingToBlack();
      break;
    }

    case FastTravelState.POST_NEW_ROOM_2: {
      checkStatePostNewRoom2();
      break;
    }

    case FastTravelState.CONTROLS_ENABLED: {
      checkStateControlsEnabled();
      break;
    }

    case FastTravelState.PLAYER_JUMP: {
      checkStatePlayerJump();
      break;
    }

    default: {
      break;
    }
  }
}

// FastTravelState.PLAYER_ANIMATION
function checkStatePlayerAnimation() {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const isaacFrameCount = Isaac.GetFrameCount();

  if (gameFrameCount < g.run.trapdoor.frame) {
    return;
  }

  // State FADING_TO_BLACK is activated when the "Trapdoor" animation is completed
  g.run.trapdoor.state = FastTravelState.FADING_TO_BLACK;

  // Mark to change floors after the screen is black
  g.run.trapdoor.frame = isaacFrameCount + FADE_TO_BLACK_FRAMES;
  // (we must use Isaac frames instead of game frames for this part because game frames do not pass
  // during a room transition)

  g.p.Visible = false;

  // Make the screen fade to black
  // (we can go to any room for this, so we just use the starting room)
  g.g.StartRoomTransition(
    g.l.GetStartingRoomIndex(),
    Direction.NO_DIRECTION,
    RoomTransition.TRANSITION_NONE,
  );
}

// FastTravelState.FADING_TO_BLACK
function checkStateFadingToBlack() {
  // Local variables
  const stage = g.l.GetStage();
  const isaacFrameCount = Isaac.GetFrameCount();

  if (isaacFrameCount < g.run.trapdoor.frame) {
    return;
  }

  // State SCREEN_IS_BLACK is activated when the screen is black
  g.run.trapdoor.state = FastTravelState.SCREEN_IS_BLACK;
  g.run.trapdoor.floor = stage;
  sprites.init("black", "black"); // Cover the screen with a big black sprite
  if (MinimapAPI !== null) {
    // We must also disable the custom minimap when we want the screen to be black
    MinimapAPI.Config.Disable = true;
  }

  gotoNextFloor(g.run.trapdoor.upwards);
}

// FastTravelState.POST_NEW_ROOM_2
function checkStatePostNewRoom2() {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  if (!g.p.ControlsEnabled) {
    return;
  }

  // State CONTROLS_ENABLED is activated when the player controls are enabled
  // (this happens automatically by the game)
  g.run.trapdoor.state = FastTravelState.CONTROLS_ENABLED;
  g.run.trapdoor.frame = gameFrameCount + 5; // Wait a while longer
  g.p.ControlsEnabled = false;
}

// FastTravelState.CONTROLS_ENABLED
function checkStateControlsEnabled() {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  if (gameFrameCount < g.run.trapdoor.frame) {
    return;
  }

  // State PLAYER_JUMP is activated when the the hole is spawned and ready
  g.run.trapdoor.state = FastTravelState.PLAYER_JUMP;
  g.run.trapdoor.frame = gameFrameCount + JUMP_UP_ANIMATION_FRAME_LENGTH;

  for (let i = 0; i < g.g.GetNumPlayers(); i++) {
    const player = Isaac.GetPlayer(i);
    if (player === null) {
      continue;
    }

    // Make the player(s) visible again
    const spriteScale = g.run.trapdoor.scale.get(i);
    if (spriteScale !== undefined) {
      player.SpriteScale = spriteScale;
    }

    // Give the player(s) the collision that we removed earlier
    player.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL;

    // Play the jumping out of the hole animation
    player.PlayExtraAnimation("Jump");
  }

  // Make the hole do the disappear animation
  const pitfalls = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariantCustom.PITFALL_CUSTOM,
    -1,
    false,
    false,
  );
  for (const pitfall of pitfalls) {
    pitfall.GetSprite().Play("Disappear", true);
  }
}

// FastTravelState.PLAYER_JUMP
function checkStatePlayerJump() {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  if (gameFrameCount < g.run.trapdoor.frame) {
    return;
  }

  // We are finished when the the player has emerged from the hole
  g.run.trapdoor.state = FastTravelState.DISABLED;

  // Enable the controls for all players
  for (let i = 0; i < g.g.GetNumPlayers(); i++) {
    const player = Isaac.GetPlayer(i);
    if (player !== null) {
      player.ControlsEnabled = true;
    }
  }

  // Kill the hole
  const pitfalls = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariantCustom.PITFALL_CUSTOM,
    -1,
    false,
    false,
  );
  for (const pitfall of pitfalls) {
    pitfall.Remove();
  }
}

// Called from the PostNewRoom callback
export function checkNewFloor(): void {
  // Local variables
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const character = g.p.GetPlayerType();

  // We are not travelling to a new level if we went through a Mega Satan trapdoor,
  // so bypass the below PostNewRoom check
  if (
    g.run.trapdoor.state === FastTravelState.SCREEN_IS_BLACK &&
    g.run.trapdoor.megaSatan
  ) {
    g.run.trapdoor.state = FastTravelState.POST_NEW_ROOM_1;
  }

  // We will hit the PostNewRoom callback twice when doing a fast-travel,
  // so do nothing on the first time
  // (this is only because of the manual callback reordering)
  if (g.run.trapdoor.state === FastTravelState.SCREEN_IS_BLACK) {
    g.run.trapdoor.state = FastTravelState.POST_NEW_ROOM_1;
  } else if (g.run.trapdoor.state === FastTravelState.POST_NEW_ROOM_1) {
    g.run.trapdoor.state = FastTravelState.POST_NEW_ROOM_2;

    // Remove the black sprite to reveal the new floor
    sprites.init("black", "");
    if (MinimapAPI !== null) {
      MinimapAPI.Config.Disable = false;
    }

    let pos = g.r.GetCenterPos();
    if (g.g.Difficulty >= Difficulty.DIFFICULTY_GREED && stage !== 7) {
      // The center of the room in Greed Mode will be on top of the trigger switch
      // On vanilla, the player appears near the top of the room (at 320, 280)
      // However, if we adjust the position to this, it will cause the camera to bug out
      // Thus, make the player appear near the bottom
      pos = Vector(320, 560);
    } else if (g.run.trapdoor.megaSatan) {
      // The center of the Mega Satan room is near the top
      // Causing Isaac to warp to the top causes the camera to bug out,
      // so adjust the position to be near the bottom entrance
      pos = Vector(320, 650);

      // Additionally, stop the boss room sound effect
      g.sfx.Stop(SoundEffect.SOUND_CASTLEPORTCULLIS);
    } else if (stage === 9) {
      // Blue Womb
      // Emulate the vanilla starting position
      pos = Vector(320, 560);
    }

    for (let i = 0; i < g.g.GetNumPlayers(); i++) {
      const player = Isaac.GetPlayer(i);
      if (player === null) {
        continue;
      }

      // Make the player(s) invisible so that we can jump out of the hole
      // (this has to be in the PostNewRoom callback so that we don't get bugs with the Glowing Hour
      // Glass)
      // (we can't use "player.Visible = false" because it won't do anything here)
      g.run.trapdoor.scale.set(i, player.SpriteScale);
      player.SpriteScale = ZERO_VECTOR;

      // Move the player to the center of the room
      player.Position = pos;
    }

    // Additionally, move all familiars to the center of the room
    const familiars = Isaac.FindByType(
      EntityType.ENTITY_FAMILIAR,
      -1,
      -1,
      false,
      false,
    );
    for (const familiar of familiars) {
      familiar.Position = pos;
    }

    // Spawn a hole
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariantCustom.PITFALL_CUSTOM,
      0,
      pos,
      ZERO_VECTOR,
      null,
    );

    // Show what the new floor is
    // (the game won't show this naturally since we used the console command to get here)
    if (
      // The "Victory Lap" text will overlap with the stage text,
      // so don't bother showing it if the race is finished
      !g.raceVars.finished &&
      // The baby descriptions will slightly overlap with the stage text,
      // so don't bother showing it if we are playing as "Random Baby"
      character !== Isaac.GetPlayerTypeByName("Random Baby")
    ) {
      g.run.streakText = g.l.GetName(stage, stageType, 0, 0, false);
      if (g.run.streakText === "???") {
        g.run.streakText = "Blue Womb";
      }
      g.run.streakFrame = Isaac.GetFrameCount();
    }

    // Open the Hush door to speed things up
    if (stage === 9) {
      // Blue Womb
      const hushDoor = g.r.GetDoor(1);
      if (hushDoor !== null) {
        hushDoor.TryUnlock(true);
      }
      g.sfx.Stop(SoundEffect.SOUND_BOSS_LITE_ROAR);
    }
  }
}

// Remove the long fade out / fade in when entering trapdoors
// (and redirect Sacrifice Room teleports)
export function gotoNextFloor(upwards: boolean, redirectStage?: int): void {
  // Local variables
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  // Handle custom Mega Satan trapdoors
  if (g.run.trapdoor.megaSatan) {
    g.g.StartRoomTransition(
      GridRooms.ROOM_MEGA_SATAN_IDX,
      Direction.UP,
      RoomTransition.TRANSITION_NONE,
    );

    return;
  }

  // By default, we will not need to reseed the new floor
  g.run.reseedNextFloor = false;

  // Get the number and type of the next floor
  let nextStage: int;
  if (redirectStage === undefined) {
    nextStage = getNextStage();
  } else {
    // We are redirecting a Sacrifice Room teleport, so we are going backwards
    nextStage = redirectStage;
  }
  let nextStageType = getNextStageType(nextStage, upwards);

  // Check for completely custom floor paths
  if (g.race.goal === "Everything") {
    if (stage === 10 && stageType === 1) {
      // 10.1 (Cathedral)
      // Cathedral goes to Sheol
      nextStage = 10;
      nextStageType = 0;

      // We need to reseed it because by default,
      // Sheol will have the same layout as Cathedral
      g.run.reseedNextFloor = true;
    } else if (stage === 10 && stageType === 0) {
      // 10.0 (Sheol)
      // Sheol goes to The Chest
      nextStage = 11;
      nextStageType = 1;
    } else if (stage === 11 && stageType === 1) {
      // 11.0 (The Chest)
      // The Chest goes to the Dark Room
      nextStage = 11;
      nextStageType = 0;

      // We need to reseed it because by default,
      // the Dark Room will have the same layout as The Chest
      g.run.reseedNextFloor = true;
    }
  }

  // Before we go to the next floor, remove health if we used a Strength Card
  fixStrengthCardBug();

  // Check to see if we need to take extra steps to seed the floor consistently by performing health
  // and inventory modifications
  seededFloors.before(nextStage);

  // Use the console to manually travel to the floor
  travelStage(nextStage, nextStageType);

  // Revert the health && inventory modifications
  seededFloors.after();
}

function getNextStage() {
  // Local variables
  const stage = g.l.GetStage();
  const roomIndexUnsafe = g.l.GetCurrentRoomIndex();

  if (g.run.trapdoor.voidPortal) {
    return 12;
  }

  if (stage === 8 && roomIndexUnsafe !== GridRooms.ROOM_BLUE_WOOM_IDX) {
    // If we are not in the Womb special room, we need to skip a floor
    // (since the Blue Womb is floor 9)
    return 10;
  }

  if (stage === 11) {
    // The Chest goes to The Chest
    // The Dark Room goes to the Dark Room
    g.run.reseedNextFloor = true;
    return 11;
  }

  if (stage === 12) {
    // The Void goes to The Void
    g.run.reseedNextFloor = true;
    return 12;
  }

  // By default, go to the next floor
  return (stage as int) + 1;
}

function getNextStageType(nextStage: int, upwards: boolean) {
  // Local variables
  const stageType = g.l.GetStageType();

  if (nextStage === 9) {
    // Blue Womb does not have any alternate floors
    return 0;
  }

  if (nextStage === 10) {
    if (upwards) {
      // Go to Cathedral (10.1)
      return 1;
    }

    // Go to Sheol (10.0)
    return 0;
  }

  if (nextStage === 11) {
    if (stageType === 0) {
      // Sheol (10.0) goes to the Dark Room (11.0)
      return 0;
    }

    // By default, go to The Chest (11.1)
    return 1;
  }

  return getStageType(nextStage);
}

export function getStageType(stage: int): StageType {
  // Local variables
  const stageSeed = g.seeds.GetStageSeed(stage);

  // The following is the game's internal code to determine the floor type
  // (this came directly from Spider)
  /*
    u32 Seed = g_Game->GetSeeds().GetStageSeed(NextStage);
    if (!g_Game->IsGreedMode()) {
      StageType = ((Seed % 2) == 0 && (
        ((NextStage == STAGE1_1 || NextStage == STAGE1_2) && gd.Unlocked(ACHIEVEMENT_CELLAR)) ||
        ((NextStage == STAGE2_1 || NextStage == STAGE2_2) && gd.Unlocked(ACHIEVEMENT_CATACOMBS)) ||
        ((NextStage == STAGE3_1 || NextStage == STAGE3_2) && gd.Unlocked(ACHIEVEMENT_NECROPOLIS)) ||
        ((NextStage == STAGE4_1 || NextStage == STAGE4_2)))
      ) ? STAGETYPE_WOTL : STAGETYPE_ORIGINAL;
    if (Seed % 3 == 0 && NextStage < STAGE5)
      StageType = STAGETYPE_AFTERBIRTH;
  */

  // Emulate what the game's internal code does
  if (stageSeed % 2 === 0) {
    return StageType.STAGETYPE_WOTL;
  }

  if (stageSeed % 3 === 0) {
    return StageType.STAGETYPE_AFTERBIRTH;
  }

  return StageType.STAGETYPE_ORIGINAL;
}

export function travelStage(stage: int, stageType: int): void {
  // Build the command that will take us to the next floor
  let command = `stage ${stage}`;
  if (stageType === 1) {
    command += "a";
  } else if (stageType === 2) {
    command += "b";
  }

  misc.executeCommand(command);

  if (g.run.reseedNextFloor) {
    g.run.reseedNextFloor = false;

    // Doing a "reseed" immediately after a "stage" command won't mess anything up
    misc.executeCommand("reseed");
  }
}

// Called from the PostNewLevel callback
function fixStrengthCardBug() {
  // If the player uses a Strength card in a room and jumps into a trapdoor,
  // then the extra heart container will not get properly removed because we manually warp the
  // player away from the room/floor
  // So, detect for this condition and manually remove the heart container
  if (!g.run.room.usedStrength) {
    return;
  }
  g.run.room.usedStrength = false;

  // Handle the special case of if we used a Strength card on another form
  const character = g.p.GetPlayerType();
  if (
    (g.run.room.usedStrengthChar === PlayerType.PLAYER_THEFORGOTTEN && // 16
      character === PlayerType.PLAYER_THESOUL) || // 17
    (g.run.room.usedStrengthChar === PlayerType.PLAYER_THESOUL && // 17
      character === PlayerType.PLAYER_THEFORGOTTEN) // 16
  ) {
    // The bug will not occur in this special case
    // In other words, the game will properly remove the bone heart (if we used the Strength card on
    // The Forgotten) or the soul heart (if we used the Strength card on The Soul) for us,
    // so we don't have to do anything here
    return;
  }

  // Don't actually remove the heart container if do doing so would kill us
  // (which is the vanilla behavior)
  const maxHearts = g.p.GetMaxHearts();
  const soulHearts = g.p.GetSoulHearts();
  const boneHearts = g.p.GetBoneHearts();
  if (
    (maxHearts === 2 && soulHearts === 0 && boneHearts === 0) ||
    (character === PlayerType.PLAYER_THEFORGOTTEN && boneHearts === 1)
  ) {
    Isaac.DebugString(
      "Deliberately not removing the heart from a Strength card since it would kill us.",
    );
  } else {
    g.p.AddMaxHearts(-2, true); // Remove a heart container
    Isaac.DebugString(
      "Took away 1 heart container to fix the Fast-Travel bug with Strength cards.",
    );
  }
}
