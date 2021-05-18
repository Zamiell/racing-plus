import * as cache from "../cache";
import * as fastReset from "../features/fastReset";

export function main(): void {
  cache.updateAPIFunctions();
  fastReset.postRender();
}
