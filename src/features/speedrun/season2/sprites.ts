const sprites = {
  characterTitle: null as Sprite | null,

  /** "Starting Item" or "Starting Build". */
  seededStartingTitle: null as Sprite | null,

  seededItemCenter: null as Sprite | null,
  seededItemLeft: null as Sprite | null,
  seededItemRight: null as Sprite | null,
  seededItemFarLeft: null as Sprite | null,
  seededItemFarRight: null as Sprite | null,
};
export default sprites;

export function resetSprites(): void {
  for (const key of Object.keys(sprites)) {
    // @ts-expect-error The key will always be valid here.
    sprites[key] = null;
  }
}
