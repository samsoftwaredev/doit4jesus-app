const iconAssets = [
  require("../../../assets/images/icons/bell.svg"),
  require("../../../assets/images/icons/bible.svg"),
  require("../../../assets/images/icons/church.svg"),
  require("../../../assets/images/icons/confession.svg"),
  require("../../../assets/images/icons/envelop.svg"),
  require("../../../assets/images/icons/eucaristia.svg"),
  require("../../../assets/images/icons/noPhone.svg"),
  require("../../../assets/images/icons/rosary.svg"),
  require("../../../assets/images/icons/settings.svg"),
  require("../../../assets/images/icons/weight.svg"),
];

describe("bundled icon artwork", () => {
  it("provides SVG artwork for every icon", () => {
    expect(iconAssets).toHaveLength(10);
  });
});
