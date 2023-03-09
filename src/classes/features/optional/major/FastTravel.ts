import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import { v } from "./fastTravel/v";

export class FastTravel extends ConfigurableModFeature {
  configKey: keyof Config = "FastClear";
  v = v;
}
