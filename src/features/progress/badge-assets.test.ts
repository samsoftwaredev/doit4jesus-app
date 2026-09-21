import { getLocalBadgeArtwork } from "./badge-assets";

const expectedArtwork = {
  BELT_OF_TRUTH: require("../../../assets/images/badges/belt_of_truth.png"),
  BOOTS_OF_READINESS: require("../../../assets/images/badges/boots_of_readiness.png"),
  BREASTPLATE_OF_RIGHTEOUSNESS: require("../../../assets/images/badges/breastplate_of_righteousness.png"),
  CHURCH_SCHEDULE_STEWARD: require("../../../assets/images/badges/church_schedule_steward.png"),
  COMMUNITY_HELPER: require("../../../assets/images/badges/community_helper.png"),
  FIRST_ROSARY: require("../../../assets/images/badges/first_rosary.png"),
  HELMET_OF_SALVATION: require("../../../assets/images/badges/helmet_of_salvation.png"),
  PRAYER_INTENTION_1: require("../../../assets/images/badges/first_intention.png"),
  PRAYER_INTENTION_3: require("../../../assets/images/badges/faithful_intecessor.png"),
  PRAYER_INTENTION_7: require("../../../assets/images/badges/prayer_advocate.png"),
  PRAYER_STREAK: require("../../../assets/images/badges/prayer_streak.png"),
  SCRIPTURE_SEEKER: require("../../../assets/images/badges/scripture_seeker.png"),
  SHIELD_OF_FAITH: require("../../../assets/images/badges/shield_of_faith.png"),
  SWORD_OF_THE_SPIRIT: require("../../../assets/images/badges/sword_of_the_spirit.png"),
};

describe("badge artwork", () => {
  it.each(Object.entries(expectedArtwork))("maps %s to its bundled badge image", (code, artwork) => {
    expect(getLocalBadgeArtwork(code)).toBe(artwork);
  });

  it("returns null for future badge codes without bundled artwork", () => {
    expect(getLocalBadgeArtwork("FUTURE_BADGE")).toBeNull();
  });
});
