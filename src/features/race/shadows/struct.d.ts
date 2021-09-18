export function pack(format: string, ...args: unknown[]): string;
export function unpack(
  format: string,
  stream: string,
  pos?: int,
): LuaMultiReturn<unknown[]>;
