/** Static level artwork bundled by Metro and keyed by normalized backend level code. */
export const levelImagesByCode = {
  awakened: require("./awakened.png"),
  brother: require("./brother.png"),
  disciple: require("./disciple.png"),
  fighter: require("./fighter.png"),
  guardian: require("./guardian.png"),
  leader: require("./leader.png"),
  persevering_disciple: require("./perservering_disciple.png"),
  seeker: require("./seeker.png"),
  servant: require("./servant.png"),
  witness: require("./witness.png"),
} as const;

export type LevelImageCode = keyof typeof levelImagesByCode;
