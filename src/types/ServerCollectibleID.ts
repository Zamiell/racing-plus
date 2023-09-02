/**
 * Most of the time, the collectible ID sent by the server will be equivalent to the
 * `CollectibleType`. However, for modded items, it will be a unique ID that must be locally
 * converted to the applicable collectible type.
 */
export type ServerCollectibleID = int & {
  readonly __serverCollectibleIDBrand: unique symbol;
};
