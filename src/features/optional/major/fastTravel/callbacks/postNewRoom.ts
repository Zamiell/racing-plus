import g from "../../../../../globals";
import { getRoomIndex, removeGridEntity } from "../../../../../misc";
import { EffectVariantCustom } from "../../../../../types/enums";
import * as crawlspace from "../crawlspace";
import * as fastTravel from "../fastTravel";
import * as heavenDoor from "../heavenDoor";
import * as trapdoor from "../trapdoor";

export function main(): void {
  if (!g.config.fastTravel) {
    return;
  }

  const roomIndex = getRoomIndex();

  // crawlspace.postNewRoom();

  respawnTrapdoors(roomIndex);
  respawnCrawlspaces(roomIndex);
  respawnHeavenDoors(roomIndex);
}

function respawnTrapdoors(roomIndex: int) {
  for (const replacedTrapdoor of g.run.level.fastTravel.replacedTrapdoors) {
    if (replacedTrapdoor.room === roomIndex) {
      removeOverlappingGridEntity(replacedTrapdoor.position);
      const effectVariant = trapdoor.getTrapdoorVariant();
      fastTravel.spawn(
        effectVariant,
        replacedTrapdoor.position,
        trapdoor.shouldSpawnOpen,
      );
    }
  }
}

function respawnCrawlspaces(roomIndex: int) {
  for (const replacedCrawlspace of g.run.level.fastTravel.replacedCrawlspaces) {
    if (replacedCrawlspace.room === roomIndex) {
      removeOverlappingGridEntity(replacedCrawlspace.position);
      fastTravel.spawn(
        EffectVariantCustom.CRAWLSPACE_FAST_TRAVEL,
        replacedCrawlspace.position,
        crawlspace.shouldSpawnOpen,
      );
    }
  }
}

function respawnHeavenDoors(roomIndex: int) {
  for (const replacedHeavenDoor of g.run.level.fastTravel.replacedHeavenDoors) {
    if (replacedHeavenDoor.room === roomIndex) {
      removeOverlappingGridEntity(replacedHeavenDoor.position);
      fastTravel.spawn(
        EffectVariantCustom.HEAVEN_DOOR_FAST_TRAVEL,
        replacedHeavenDoor.position,
        heavenDoor.shouldSpawnOpen,
      );
    }
  }
}

// Remove any grid entities that will overlap with the custom trapdoor/crawlspace
// (this is needed because rocks/poop can respawn in the room after re-entering)
function removeOverlappingGridEntity(position: Vector) {
  // Check for the existence of an overlapping grid entity
  const gridIndex = g.r.GetGridIndex(position);
  const gridEntity = g.r.GetGridEntity(gridIndex);
  if (gridEntity === null) {
    return;
  }

  removeGridEntity(gridEntity);
  removeCornyPoopFly(gridEntity);
}

function removeCornyPoopFly(gridEntity: GridEntity) {
  // Removing a Corny Poop will turn the Eternal Fly into an Attack Fly
  const saveState = gridEntity.GetSaveState();
  if (
    saveState.Type === GridEntityType.GRID_POOP &&
    saveState.Variant === PoopVariant.CORN
  ) {
    const flies = Isaac.FindByType(
      EntityType.ENTITY_ETERNALFLY,
      -1,
      -1,
      false,
      false,
    );
    for (const fly of flies) {
      fly.Remove();
    }
  }
}
