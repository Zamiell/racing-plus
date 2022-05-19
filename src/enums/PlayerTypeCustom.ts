export const PlayerTypeCustom = {
  RANDOM_BABY: Isaac.GetPlayerTypeByName("Random Baby"),
} as const;

// We don't want to validate the enum, since it is valid for it to be -1.
