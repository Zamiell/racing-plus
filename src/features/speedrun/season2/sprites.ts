const sprites: Record<string, Sprite | null> = {
  characterTitle: null,

  seededStartingTitle: null, // "Starting Item" or "Starting Build"
  seededItemCenter: null,
  seededItemLeft: null,
  seededItemRight: null,
  seededItemFarLeft: null,
  seededItemFarRight: null,
};
export default sprites;

export function resetSprites(): void {
  for (const key of Object.keys(sprites)) {
    const property = key;
    sprites[property] = null;
  }
}
