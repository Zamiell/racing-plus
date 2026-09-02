import type { CollectibleType } from "isaac-typescript-definitions";

export interface ActiveCollectibleDescription {
  readonly collectibleType: CollectibleType;
  readonly charge: int;
}
