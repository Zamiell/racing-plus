import * as fastClearPostEntityKill from "../features/optional/major/fastClear/callbacks/postEntityKill";
import * as fastClear2 from "../features/optional/major/fastClear2";

export function main(entity: Entity): void {
  fastClearPostEntityKill.main(entity);
  fastClear2.postEntityKill(entity);
}
