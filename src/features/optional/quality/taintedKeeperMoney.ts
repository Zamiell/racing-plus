import { getPlayers } from "../../../utilGlobals";

export function postGameStarted(): void {
  for (const player of getPlayers()) {
    const character = player.GetPlayerType();
    if (character === PlayerType.PLAYER_KEEPER_B) {
      player.AddCoins(15);
    }
  }
}
