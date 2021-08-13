import { getRoomIndex } from "isaacscript-common";
import g from "../../globals";

export function isValidMotherGoalRoom(): boolean {
  const roomType = g.r.GetType();
  const roomIndex = getRoomIndex();
  return (
    roomIndex === GridRooms.ROOM_SECRET_EXIT_IDX ||
    roomType === RoomType.ROOM_ERROR ||
    roomType === RoomType.ROOM_BLACK_MARKET
  );
}

export function isValidBeastGoalRoom(): boolean {
  const roomType = g.r.GetType();
  return (
    roomType === RoomType.ROOM_BOSS ||
    roomType === RoomType.ROOM_ERROR ||
    roomType === RoomType.ROOM_BLACK_MARKET
  );
}
