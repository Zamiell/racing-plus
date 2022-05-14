import { CollectibleType } from "isaac-typescript-definitions";

export interface ActiveCollectibleDescription {
  collectibleType: CollectibleType | int;
  charge: int;
}
