import { ModFeature } from "isaacscript-common";
import { mod } from "../mod";
import { config } from "../modConfigMenu";
import { Config } from "./Config";

export class ConfigurableModFeature extends ModFeature {
  constructor(configKey: keyof Config) {
    super(mod);
    this.shouldCallbackMethodsFire = () => config[configKey];
  }
}
