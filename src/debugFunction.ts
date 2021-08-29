import g from "./globals";
import { CollectibleTypeCustom } from "./types/enums";

export default function debugFunction(): void {
  // Enable debug mode
  g.debug = true;

  Isaac.DebugString(
    `LOL ${CollectibleTypeCustom.COLLECTIBLE_GUPPY_TRANSFORMATION_HELPER}`,
  );
}

export function debugFunction2(): void {}
