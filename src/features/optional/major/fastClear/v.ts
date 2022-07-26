import { game, getEntityID, log, saveDataManager } from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import { FAST_CLEAR_DEBUG } from "./constants";

const v = {
  room: {
    aliveEnemies: new Set<PtrHash>(),
    delayClearUntilGameFrame: null as int | null,
    fastClearedRoom: false,
  },
};
export default v;

export function init(): void {
  saveDataManager("fastClear", v, featureEnabled);
}

function featureEnabled() {
  return config.fastClear;
}

export function logFastClear(
  added: boolean,
  entity: Entity,
  ptrHash: PtrHash,
  parentCallback: string,
): void {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!FAST_CLEAR_DEBUG) {
    return;
  }

  const gameFrameCount = game.GetFrameCount();

  const verb = added ? "Added" : "Removed";
  const entityID = getEntityID(entity);
  const npc = entity.ToNPC();
  const state = npc === undefined ? "n/a" : npc.State.toString();
  log(
    `${verb} fast-clear entity to track on game frame ${gameFrameCount}: ${entityID}, state: ${state}, parent: ${entity.Parent}, spawnerEntity: ${entity.SpawnerEntity}, ptrHash: ${ptrHash}, parentCallback: ${parentCallback}`,
  );
  log(
    `Total fast-clear entities tracked on game frame ${gameFrameCount}: ${v.room.aliveEnemies.size}`,
  );
  log(`fastClearedRoom: ${v.room.fastClearedRoom}`);
}
