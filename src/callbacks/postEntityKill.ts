import * as fastClearPostEntityKill from "../features/optional/major/fastClear/callbacks/postEntityKill";
import * as fastClear3 from "../features/optional/major/fastClear3";
import * as fadeBosses from "../features/optional/quality/fadeBosses";

export function main(entity: Entity): void {
  fastClearPostEntityKill.main(entity);
  fastClear3.postEntityKill(entity);
  fadeBosses.postEntityKill(entity);
}
