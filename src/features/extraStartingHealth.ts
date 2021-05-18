import g from "../globals";

export default function extraStartingHealth(): void {
  if (!g.config.extraStartingHealth) {
    return;
  }

  const character = g.p.GetPlayerType();

  switch (character) {
    // 3
    case PlayerType.PLAYER_JUDAS: {
      g.p.AddSoulHearts(1);
      break;
    }

    // 4
    case PlayerType.PLAYER_XXX: {
      g.p.AddSoulHearts(1);
      break;
    }

    // 7
    case PlayerType.PLAYER_AZAZEL: {
      g.p.AddBlackHearts(1);
      break;
    }

    // 9
    case PlayerType.PLAYER_EDEN: {
      giveEdenHealth();
      break;
    }

    // 11
    case PlayerType.PLAYER_LAZARUS2: {
      g.p.AddSoulHearts(1);
      break;
    }

    // 12
    case PlayerType.PLAYER_BLACKJUDAS: {
      g.p.AddBlackHearts(3);
      break;
    }

    // 24
    case PlayerType.PLAYER_JUDAS_B: {
      g.p.AddBlackHearts(3);
      break;
    }

    // 25
    case PlayerType.PLAYER_XXX_B: {
      g.p.AddSoulHearts(1);
      break;
    }

    // 28
    case PlayerType.PLAYER_AZAZEL_B: {
      g.p.AddBlackHearts(1);
      break;
    }

    // 30
    case PlayerType.PLAYER_EDEN_B: {
      giveEdenHealth();
      break;
    }

    // 35
    case PlayerType.PLAYER_THEFORGOTTEN_B: {
      g.p.AddSoulHearts(1);
      break;
    }

    // 36
    case PlayerType.PLAYER_BETHANY_B: {
      g.p.AddSoulHearts(1);
      break;
    }

    // 38
    case PlayerType.PLAYER_LAZARUS2_B: {
      g.p.AddSoulHearts(3);
      break;
    }

    default: {
      break;
    }
  }
}

function giveEdenHealth() {
  const redHearts = g.p.GetMaxHearts();
  const soulHearts = g.p.GetSoulHearts();

  if (redHearts === 2 && soulHearts === 0) {
    g.p.AddSoulHearts(1);
  } else if (redHearts === 0) {
    while (g.p.GetSoulHearts() <= 6) {
      g.p.AddSoulHearts(1);
    }
  }
}
