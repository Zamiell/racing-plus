// merge takes the values from a new table and merges them into an old table
// It will only copy over values that are present in the old table
// In other words, it will ignore extraneous values in the new table
export function merge(oldTable: LuaTable, newTable: LuaTable): void {
  if (type(oldTable) !== "table" || type(newTable) !== "table") {
    error("merge is comparing a value that is not a table.");
  }

  for (const key of Object.keys(oldTable)) {
    const oldValue = oldTable.get(key); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const newValue = newTable.get(key); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const oldType = type(oldValue);
    const newType = type(newValue);

    if (oldType !== newType) {
      // A property on the incoming table either does not exist or is a mismatched type
      // Skip copying this property
      continue;
    }

    if (oldType === "table") {
      // Recursively handle sub-tables
      merge(oldValue, newValue);
      continue;
    }

    // Base case - copy the value
    oldTable.set(key, newValue);
  }
}
