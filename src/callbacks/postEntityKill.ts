import * as fadeBosses from "../features/optional/bosses/fadeBosses";
import fastClearPostEntityKill from "../features/optional/major/fastClear/callbacks/postEntityKill";
import * as RCDNPC from "../roomClearDelayNPC";
import { EntityTypeCustom } from "../types/enums";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_ENTITY_KILL,
    roomClearDelayNPC,
    EntityTypeCustom.ENTITY_ROOM_CLEAR_DELAY_NPC,
  );
}

export function main(entity: Entity): void {
  /*
  log(
    `MC_POST_ENTITY_KILL - ${entity.Type}.${entity.Variant}.${
      entity.SubType
    } (on game frame ${Game().GetFrameCount()})`,
  );
  */

  fastClearPostEntityKill(entity);
  fadeBosses.postEntityKill(entity);
}

export function roomClearDelayNPC(entity: Entity): void {
  RCDNPC.postEntityKill(entity);
}
