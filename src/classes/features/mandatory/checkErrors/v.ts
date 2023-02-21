export const v = {
  run: {
    afterbirthPlus: false,
    corrupted: false,
    incompleteSave: false,
    otherModsEnabled: false,
    babiesModEnabled: false,
    invalidCharOrder: false,
    seasonGameRecentlyOpened: false,
    seasonConsoleRecentlyUsed: false,
    seasonBansRecentlySet: false,
    season4StorageHotkeyNotSet: false,
  },
};

export function hasErrors(): boolean {
  const errors = Object.values(v.run);
  return errors.includes(true);
}
