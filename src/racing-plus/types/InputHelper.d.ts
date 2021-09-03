// This is a global exposed as part of ModConfigMenu

declare const InputHelper: InputHelperInterface;

/** @noSelf */
declare interface InputHelperInterface {
  KeyboardPressed(this: void, key: Keyboard, controllerIndex: int): boolean;

  ControllerToString: LuaTable<Keyboard, string | null>;
  KeyboardToString: LuaTable<Keyboard, string | null>;
}
