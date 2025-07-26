import { game, getEntityID, log } from "isaacscript-common";
import { FAST_CLEAR_DEBUG } from "./constants";

// This is registered in "FastClear.ts".
// eslint-disable-next-line isaacscript/require-v-registration
export const v = {
  room: {
    aliveEnemies: new Set<PtrHash>(),
    aliveBosses: new Set<PtrHash>(),
    delayClearUntilGameFrame: null as int | null,
    fastClearedRoom: false,
  },
};

export function logFastClear(
  added: boolean,
  entity: Entity,
  ptrHash: PtrHash,
  parentCallback: string,
): void {
  if (!FAST_CLEAR_DEBUG) {
    return;
  }

  const gameFrameCount = game.GetFrameCount();

  const verb = added ? "Added" : "Removed";
  const entityID = getEntityID(entity);
  const npc = entity.ToNPC();
  const state = npc === undefined ? "n/a" : npc.State.toString();
  log(
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    `${verb} fast-clear entity to track on game frame ${gameFrameCount}: ${entityID}, state: ${state}, parent: ${entity.Parent}, spawnerEntity: ${entity.SpawnerEntity}, ptrHash: ${ptrHash}, parentCallback: ${parentCallback}`,
  );
  log(
    `Total fast-clear entities tracked on game frame ${gameFrameCount}: ${v.room.aliveEnemies.size}`,
  );
  log(`fastClearedRoom: ${v.room.fastClearedRoom}`);
}

export function getFastClearNumAliveEnemies(): number {
  return v.room.aliveEnemies.size;
}

export function getFastClearNumAliveBosses(): number {
  return v.room.aliveBosses.size;
}
