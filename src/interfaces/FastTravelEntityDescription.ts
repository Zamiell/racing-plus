import type { FastTravelEntityState } from "../enums/FastTravelEntityState";

export interface FastTravelEntityDescription {
  readonly initial: boolean;
  state: FastTravelEntityState;
}
