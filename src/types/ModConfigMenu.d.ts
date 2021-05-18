declare const ModConfigMenu: ModConfigMenuInterface;

/** @noSelf */
declare interface ModConfigMenuInterface {
  AddSetting(
    categoryName: string,
    subcategoryName: string,
    setting?: ModConfigMenuSetting,
  ): void;

  // Used to wipe ModConfigMenu data on reload for convenience during development
  MenuData: MenuData[];
}

/** @noSelf */
declare interface ModConfigMenuSetting {
  CurrentSetting: () => any; // eslint-disable-line @typescript-eslint/no-explicit-any
  Display: () => string;
  Info: string[];
  OnChange: (newValue: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  Type: ModConfigMenuOptionType;
}

declare const enum ModConfigMenuOptionType {
  TEXT = 1,
  SPACE = 2,
  SCROLL = 3,
  BOOLEAN = 4,
  NUMBER = 5,
  KEYBIND_KEYBOARD = 6,
  KEYBIND_CONTROLLER = 7,
  TITLE = 8,
}

declare interface MenuData {
  Name: string;
  Subcategories: string[];
}
