// There is a bug in the vanilla game where Converter does not work properly on characters who
// cannot gain red hearts

const CHARACTERS_WITH_NO_RED_HEARTS: PlayerType[] = [
  PlayerType.PLAYER_XXX, // 4
  PlayerType.PLAYER_BLACKJUDAS, // 12
  PlayerType.PLAYER_JUDAS_B, // 24
  PlayerType.PLAYER_XXX_B, // 25
  PlayerType.PLAYER_THEFORGOTTEN_B, // 35
  PlayerType.PLAYER_BETHANY_B, // 36
];

export function preUseItemConverter(player: EntityPlayer): boolean | void {
  const character = player.GetPlayerType();

  if (CHARACTERS_WITH_NO_RED_HEARTS.includes(character)) {
    return true;
  }

  return undefined;
}
