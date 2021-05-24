import * as startWithD6 from "../features/optional/major/startWithD6";
import g from "../globals";

export function postUpdate(): void {
  const character = g.p.GetPlayerType();
  if (character !== g.run.currentCharacter) {
    g.run.currentCharacter = character;
    postPlayerChange();
  }
}

export function postGameStarted(): void {
  g.run.currentCharacter = g.p.GetPlayerType();
}

function postPlayerChange() {
  startWithD6.postPlayerChange();
}
