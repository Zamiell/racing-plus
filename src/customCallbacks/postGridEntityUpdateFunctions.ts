import * as fastTravelPostGridEntityUpdate from "../features/optional/major/fastTravel/callbacks/postGridEntityUpdate";
import * as deleteVoidPortals from "../features/optional/quality/deleteVoidPortals";

const functionMap = new Map<
  GridEntityType,
  (gridEntity: GridEntity, gridIndex: int) => void
>();
export default functionMap;

// 17
functionMap.set(
  GridEntityType.GRID_TRAPDOOR,
  (gridEntity: GridEntity, gridIndex: int) => {
    deleteVoidPortals.postGridEntityUpdateTrapdoor(gridEntity, gridIndex);
    fastTravelPostGridEntityUpdate.trapdoor(gridEntity, gridIndex);
  },
);

// 18
functionMap.set(
  GridEntityType.GRID_STAIRS,
  (gridEntity: GridEntity, gridIndex: int) => {
    fastTravelPostGridEntityUpdate.crawlspace(gridEntity, gridIndex);
  },
);
