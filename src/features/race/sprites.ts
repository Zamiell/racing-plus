/* eslint-disable import/no-unused-modules */

const sprites = new Map<string, Sprite>();

export function init(spriteKey: string, _spriteName: string): void {
  const sprite = sprites.get(spriteKey);
  if (sprite === undefined) {
    // TODO
  }
}
