import type { FastTravelEntityState } from "../enums/FastTravelEntityState";

// eslint-disable-next-line complete/type-declaration-immutability
export interface FastTravelEntityDescription {
  readonly initial: boolean;
  state: FastTravelEntityState;
}
