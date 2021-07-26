import * as fadeBosses from "../features/optional/bosses/fadeBosses";
import fastClearPostEntityKill from "../features/optional/major/fastClear/callbacks/postEntityKill";

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
