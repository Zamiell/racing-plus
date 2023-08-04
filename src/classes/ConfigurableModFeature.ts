import { ModFeature } from "isaacscript-common";
import { mod } from "../mod";
import { config } from "../modConfigMenu";
import type { Config } from "./Config";

export abstract class ConfigurableModFeature extends ModFeature {
  abstract configKey: keyof Config;

  constructor() {
    super(mod, false);
    this.shouldCallbackMethodsFire = () => config[this.configKey];
  }
}
