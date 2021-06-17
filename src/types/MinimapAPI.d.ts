declare const MinimapAPI: {
  Config: {
    Disable: boolean;
  };
  GetRoomByIdx(roomIndex: int): MinimapAPIRoomDescriptor;
};

interface MinimapAPIRoomDescriptor {
  Remove(): void;
  DisplayFlags: int;
}
