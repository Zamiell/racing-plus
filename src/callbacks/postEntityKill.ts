import * as fastClearPostEntityKill from "../features/optional/major/fastClear/callbacks/postEntityKill";
import * as fastClear4PostEntityKill from "../features/optional/major/fastClear4/callbacks/postEntityKill";
import * as fadeBosses from "../features/optional/quality/fadeBosses";

export function main(entity: Entity): void {
  fastClearPostEntityKill.main(entity);
  fastClear4PostEntityKill.main(entity);
  fadeBosses.postEntityKill(entity);
}
