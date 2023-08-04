import type { FastTravelEntityState } from "../enums/FastTravelEntityState";

export interface FastTravelEntityDescription {
  initial: boolean;
  state: FastTravelEntityState;
}
