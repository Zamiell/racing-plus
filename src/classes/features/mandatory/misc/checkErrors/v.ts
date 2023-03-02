/**
 * We need to separate the variables from the feature class in order to prevent circular
 * dependencies.
 */
// This is registered in "CheckErrors.ts".
// eslint-disable-next-line isaacscript/require-v-registration
export const v = {
  run: {
    afterbirthPlus: false,
    corrupted: false,
    incompleteSave: false,
    otherModsEnabled: false,
    babiesModEnabled: false,
    invalidCharOrder: false,
    season4StorageHotkeyNotSet: false,
    seasonGameRecentlyOpened: false,
    seasonConsoleRecentlyUsed: false,
    seasonBansRecentlySet: false,
  },
};

export function hasErrors(): boolean {
  const errors = Object.values(v.run);
  return errors.includes(true);
}