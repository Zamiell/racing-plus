/**
 * We need to separate the variables from the feature class in order to prevent circular
 * dependencies.
 */
// This is registered in "CheckErrors.ts".
// eslint-disable-next-line isaacscript/require-v-registration
export const v = {
  run: {
    babiesModEnabled: false,

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
  for (const [key, value] of Object.entries(v.run)) {
    if (key !== "babiesModEnabled" && value) {
      return true;
    }
  }

  return false;
}
