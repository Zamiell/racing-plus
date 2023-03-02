export function pack(format: string, structData: unknown[]): string;
export function unpack(
  format: string,
  stream: string,
  pos?: int,
): LuaMultiReturn<unknown[]>;
