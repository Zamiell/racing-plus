import g from "../../../globals";

export function postGameStarted(): void {
  if (!g.config.judasAddBomb) {
    return;
  }

  const character = g.p.GetPlayerType();
  if (character === PlayerType.PLAYER_JUDAS) {
    g.p.AddBombs(1);
  }
}
