// We need to separate out the variables to prevent circular dependencies.

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