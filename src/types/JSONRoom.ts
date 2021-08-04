export default interface JSONRoom {
  /** Needs to be converted to an int. */
  "@difficulty": string;
  /** Needs to be converted to an int. */
  "@height": string;
  "@name": string;
  /** Needs to be converted to an int. */
  "@shape": string;
  /** Needs to be converted to an int. */
  "@subtype": string;
  /** Needs to be converted to an int. */
  "@type": string;
  /** Needs to be converted to an int. */
  "@variant": string;
  /** Needs to be converted to a float. */
  "@weight": string;
  /** Needs to be converted to an int. */
  "@width": string;

  door: JSONDoor[];
  spawn: JSONSpawn[];
}

interface JSONDoor {
  /** "True" or "False" */
  "@exists": string;
  /** Needs to be converted to an int. */
  "@x": string;
  /** Needs to be converted to an int. */
  "@y": string;
}

export interface JSONSpawn {
  /** Needs to be converted to an int. */
  "@x": string;
  /** Needs to be converted to an int. */
  "@y": string;

  entity: JSONEntity;
}

interface JSONEntity {
  /** Needs to be converted to an int. */
  "@type": string;
  /** Needs to be converted to an int. */
  "@variant": string;
  /** Needs to be converted to an int. */
  "@subtype": string;
  /** Needs to be converted to a float. */
  "@weight": string;
}
