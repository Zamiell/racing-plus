// Some pills are removed via specifying a bogus achievement in pocketitems.xml
// However, they can still appear if the player gets a False PHD and it converts a Telepills,
// I can see forever!, or Lemon Party
// If this happens, convert them to specific other pills

const BANNED_PILLS = new Map<PillEffect, PillEffect>([
  [PillEffect.PILLEFFECT_AMNESIA, PillEffect.PILLEFFECT_HORF], // 25
  [PillEffect.PILLEFFECT_QUESTIONMARK, PillEffect.PILLEFFECT_IM_EXCITED], // 31
]);

export function main(
  pillEffect: PillEffect,
  _pillColor: PillColor,
): number | null {
  const pillReplacement = BANNED_PILLS.get(pillEffect);
  if (pillReplacement !== undefined) {
    return pillReplacement;
  }

  return null;
}
