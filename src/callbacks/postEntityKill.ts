import * as fastClearPostEntityKill from "../features/optional/major/fastClear/callbacks/postEntityKill";
import * as fadeBosses from "../features/optional/quality/fadeBosses";

export function main(entity: Entity): void {
  fastClearPostEntityKill.main(entity);
  fadeBosses.postEntityKill(entity);
}
