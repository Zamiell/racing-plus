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
    playingAsNonBaby: false,
    invalidCharOrder: false,
    seasonGameRecentlyOpened: false,
    seasonConsoleRecentlyUsed: false,
    season2BansRecentlySet: false,
    season4StorageHotkeyNotSet: false,
    season5ModNotEnabled: false,
  },
};

export function hasErrors(): boolean {
  const errors = Object.values(v.run);
  return errors.includes(true);
}
